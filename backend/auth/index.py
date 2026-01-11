import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для регистрации и авторизации пользователей'''
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
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                username = body.get('username', '').strip()
                email = body.get('email', '').strip()
                password = body.get('password', '')
                
                if not username or not email or not password:
                    return response(400, {'error': 'Все поля обязательны'})
                
                if len(username) < 3 or len(username) > 50:
                    return response(400, {'error': 'Логин должен быть от 3 до 50 символов'})
                
                if len(password) < 6:
                    return response(400, {'error': 'Пароль должен быть минимум 6 символов'})
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                try:
                    cur.execute(
                        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, email, created_at",
                        (username, email, password_hash)
                    )
                    user = cur.fetchone()
                    
                    character_name = username
                    cur.execute(
                        "INSERT INTO characters (user_id, character_name) VALUES (%s, %s) RETURNING id",
                        (user['id'], character_name)
                    )
                    character = cur.fetchone()
                    
                    starter_items = [
                        ('Стартовый нож', 'weapon', 'common', 1, 15, None),
                        ('Простая одежда', 'gear', 'common', 1, None, 10),
                    ]
                    
                    for item_name, item_type, rarity, level, damage, defense in starter_items:
                        cur.execute(
                            "INSERT INTO inventory (character_id, item_name, item_type, rarity, level, damage, defense) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                            (character['id'], item_name, item_type, rarity, level, damage, defense)
                        )
                    
                    conn.commit()
                    
                    token = secrets.token_urlsafe(32)
                    
                    return response(200, {
                        'success': True,
                        'message': 'Регистрация успешна',
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email']
                        },
                        'token': token
                    })
                    
                except psycopg2.IntegrityError as e:
                    conn.rollback()
                    if 'username' in str(e):
                        return response(400, {'error': 'Логин уже занят'})
                    elif 'email' in str(e):
                        return response(400, {'error': 'Email уже используется'})
                    else:
                        return response(400, {'error': 'Ошибка регистрации'})
            
            elif action == 'login':
                username = body.get('username', '').strip()
                password = body.get('password', '')
                
                if not username or not password:
                    return response(400, {'error': 'Логин и пароль обязательны'})
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute(
                    "SELECT id, username, email, is_banned, ban_reason, role FROM users WHERE username = %s AND password_hash = %s",
                    (username, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return response(401, {'error': 'Неверный логин или пароль'})
                
                if user['is_banned']:
                    return response(403, {'error': f"Аккаунт заблокирован. Причина: {user['ban_reason']}"})
                
                cur.execute(
                    "UPDATE users SET last_login = %s WHERE id = %s",
                    (datetime.now(), user['id'])
                )
                conn.commit()
                
                token = secrets.token_urlsafe(32)
                
                return response(200, {
                    'success': True,
                    'message': 'Авторизация успешна',
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'role': user['role']
                    },
                    'token': token
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
        'body': json.dumps(body, ensure_ascii=False),
        'isBase64Encoded': False
    }
