import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для получения данных игрока и его статистики'''
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
        
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')
        username = params.get('username')
        
        if method == 'GET':
            if user_id:
                cur.execute("""
                    SELECT c.*, u.username, u.email, u.role,
                           (SELECT COUNT(*) FROM inventory WHERE character_id = c.id) as total_items,
                           (SELECT COUNT(*) FROM user_achievements WHERE character_id = c.id) as total_achievements
                    FROM characters c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.user_id = %s
                """, (user_id,))
                character = cur.fetchone()
                
                if not character:
                    return response(404, {'error': 'Персонаж не найден'})
                
                cur.execute("""
                    SELECT * FROM inventory 
                    WHERE character_id = %s 
                    ORDER BY rarity DESC, level DESC
                """, (character['id'],))
                inventory = cur.fetchall()
                
                cur.execute("""
                    SELECT ua.*, a.name, a.description, a.icon_emoji, a.category
                    FROM user_achievements ua
                    JOIN achievements a ON ua.achievement_id = a.id
                    WHERE ua.character_id = %s
                    ORDER BY ua.unlocked_at DESC
                """, (character['id'],))
                achievements = cur.fetchall()
                
                cur.execute("""
                    SELECT cm.rank, c.clan_name, c.clan_tag, c.logo_emoji, c.level as clan_level
                    FROM clan_members cm
                    JOIN clans c ON cm.clan_id = c.id
                    WHERE cm.character_id = %s
                """, (character['id'],))
                clan_info = cur.fetchone()
                
                kd_ratio = round(character['kills'] / max(character['deaths'], 1), 2)
                hours_played = round(character['playtime_minutes'] / 60, 1)
                
                return response(200, {
                    'character': dict(character),
                    'inventory': [dict(item) for item in inventory],
                    'achievements': [dict(ach) for ach in achievements],
                    'clan': dict(clan_info) if clan_info else None,
                    'stats': {
                        'kd_ratio': kd_ratio,
                        'hours_played': hours_played,
                        'total_items': character['total_items'],
                        'total_achievements': character['total_achievements']
                    }
                })
            
            elif username:
                cur.execute("""
                    SELECT c.character_name, c.level, c.kills, c.deaths, c.is_online,
                           u.username, u.id as user_id
                    FROM characters c
                    JOIN users u ON c.user_id = u.id
                    WHERE u.username = %s
                """, (username,))
                character = cur.fetchone()
                
                if not character:
                    return response(404, {'error': 'Игрок не найден'})
                
                return response(200, {'character': dict(character)})
            
            else:
                cur.execute("""
                    SELECT c.character_name, c.level, c.kills, c.deaths, c.is_online,
                           u.username,
                           (SELECT COUNT(*) FROM user_achievements WHERE character_id = c.id) as achievements_count
                    FROM characters c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.is_online = TRUE
                    ORDER BY c.level DESC
                    LIMIT 50
                """)
                online_players = cur.fetchall()
                
                return response(200, {
                    'online_players': [dict(p) for p in online_players],
                    'total_online': len(online_players)
                })
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            character_id = body.get('character_id')
            updates = body.get('updates', {})
            
            if not character_id:
                return response(400, {'error': 'character_id обязателен'})
            
            allowed_fields = ['level', 'experience', 'money', 'bank_balance', 'kills', 
                            'deaths', 'playtime_minutes', 'last_server', 'is_online']
            
            set_clause = []
            values = []
            
            for field, value in updates.items():
                if field in allowed_fields:
                    set_clause.append(f"{field} = %s")
                    values.append(value)
            
            if not set_clause:
                return response(400, {'error': 'Нет допустимых полей для обновления'})
            
            values.append(character_id)
            query = f"UPDATE characters SET {', '.join(set_clause)} WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            updated_character = cur.fetchone()
            conn.commit()
            
            return response(200, {
                'success': True,
                'character': dict(updated_character)
            })
        
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
