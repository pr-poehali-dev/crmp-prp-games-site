import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для новостей проекта'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            news_id = params.get('id')
            category = params.get('category')
            limit = int(params.get('limit', 20))
            
            if news_id:
                cur.execute("""
                    SELECT n.*, u.username as author_name
                    FROM news n
                    LEFT JOIN users u ON n.author_id = u.id
                    WHERE n.id = %s
                """, (news_id,))
                article = cur.fetchone()
                
                if not article:
                    return response(404, {'error': 'Новость не найдена'})
                
                cur.execute("UPDATE news SET views = views + 1 WHERE id = %s", (news_id,))
                conn.commit()
                
                return response(200, {'article': dict(article)})
            
            else:
                query = """
                    SELECT n.*, u.username as author_name
                    FROM news n
                    LEFT JOIN users u ON n.author_id = u.id
                """
                params_list = []
                
                if category:
                    query += " WHERE n.category = %s"
                    params_list.append(category)
                
                query += " ORDER BY n.created_at DESC LIMIT %s"
                params_list.append(limit)
                
                cur.execute(query, params_list)
                articles = cur.fetchall()
                
                return response(200, {
                    'articles': [dict(a) for a in articles],
                    'total': len(articles)
                })
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            title = body.get('title')
            content = body.get('content')
            image_url = body.get('image_url')
            author_id = body.get('author_id')
            category = body.get('category', 'general')
            
            if not title or not content:
                return response(400, {'error': 'title и content обязательны'})
            
            cur.execute("""
                INSERT INTO news (title, content, image_url, author_id, category)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
            """, (title, content, image_url, author_id, category))
            
            article = cur.fetchone()
            conn.commit()
            
            return response(200, {
                'success': True,
                'article': dict(article)
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
