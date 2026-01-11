import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления кланами'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            clan_id = params.get('clan_id')
            
            if clan_id:
                cur.execute("""
                    SELECT c.*, u.username as leader_name,
                           (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id) as member_count
                    FROM clans c
                    LEFT JOIN users u ON c.leader_id = u.id
                    WHERE c.id = %s
                """, (clan_id,))
                clan = cur.fetchone()
                
                if not clan:
                    return response(404, {'error': 'Клан не найден'})
                
                cur.execute("""
                    SELECT cm.*, u.username, ch.character_name, ch.level
                    FROM clan_members cm
                    JOIN users u ON cm.user_id = u.id
                    JOIN characters ch ON cm.character_id = ch.id
                    WHERE cm.clan_id = %s
                    ORDER BY cm.rank DESC, cm.contribution DESC
                """, (clan_id,))
                members = cur.fetchall()
                
                return response(200, {
                    'clan': dict(clan),
                    'members': [dict(m) for m in members]
                })
            
            else:
                cur.execute("""
                    SELECT c.*, u.username as leader_name,
                           (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id) as member_count
                    FROM clans c
                    LEFT JOIN users u ON c.leader_id = u.id
                    ORDER BY c.level DESC, c.experience DESC
                    LIMIT 50
                """)
                clans = cur.fetchall()
                
                return response(200, {
                    'clans': [dict(c) for c in clans]
                })
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                clan_name = body.get('clan_name')
                clan_tag = body.get('clan_tag')
                leader_id = body.get('leader_id')
                character_id = body.get('character_id')
                description = body.get('description', '')
                logo_emoji = body.get('logo_emoji', '⚔️')
                
                if not clan_name or not clan_tag or not leader_id or not character_id:
                    return response(400, {'error': 'Все поля обязательны'})
                
                try:
                    cur.execute("""
                        INSERT INTO clans (clan_name, clan_tag, leader_id, description, logo_emoji)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING *
                    """, (clan_name, clan_tag, leader_id, description, logo_emoji))
                    clan = cur.fetchone()
                    
                    cur.execute("""
                        INSERT INTO clan_members (clan_id, user_id, character_id, rank)
                        VALUES (%s, %s, %s, 'leader')
                    """, (clan['id'], leader_id, character_id))
                    
                    conn.commit()
                    
                    return response(200, {
                        'success': True,
                        'message': 'Клан создан',
                        'clan': dict(clan)
                    })
                
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return response(400, {'error': 'Название или тег клана уже заняты'})
            
            elif action == 'join':
                clan_id = body.get('clan_id')
                user_id = body.get('user_id')
                character_id = body.get('character_id')
                
                if not clan_id or not user_id or not character_id:
                    return response(400, {'error': 'Все поля обязательны'})
                
                cur.execute("""
                    SELECT COUNT(*) as member_count, max_members
                    FROM clans c
                    LEFT JOIN clan_members cm ON c.id = cm.clan_id
                    WHERE c.id = %s
                    GROUP BY c.id, c.max_members
                """, (clan_id,))
                clan_info = cur.fetchone()
                
                if not clan_info:
                    return response(404, {'error': 'Клан не найден'})
                
                if clan_info['member_count'] >= clan_info['max_members']:
                    return response(400, {'error': 'Клан полон'})
                
                try:
                    cur.execute("""
                        INSERT INTO clan_members (clan_id, user_id, character_id, rank)
                        VALUES (%s, %s, %s, 'member')
                    """, (clan_id, user_id, character_id))
                    conn.commit()
                    
                    return response(200, {
                        'success': True,
                        'message': 'Вы вступили в клан'
                    })
                
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return response(400, {'error': 'Вы уже состоите в этом клане'})
        
        return response(405, {'error': 'Метод не поддерживается'})
        
    except Exception as e:
        if conn:
            conn.rollback()
        return response(500, {'error': f'Ошибка сервера: {str(e)}'})
    
    finally:
        if conn:
            cur.close()
            conn.close()

def response(status_code: int, body: dict) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body, ensure_ascii=False, default=str),
        'isBase64Encoded': False
    }
