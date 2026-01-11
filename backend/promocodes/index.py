import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для системы промокодов'''
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
            
            if action == 'use':
                code = body.get('code', '').strip().upper()
                user_id = body.get('user_id')
                
                if not code or not user_id:
                    return response(400, {'error': 'code и user_id обязательны'})
                
                cur.execute("""
                    SELECT * FROM promocodes 
                    WHERE UPPER(code) = %s AND is_active = TRUE
                """, (code,))
                promo = cur.fetchone()
                
                if not promo:
                    return response(404, {'error': 'Промокод не найден или неактивен'})
                
                if promo['expires_at'] and promo['expires_at'] < datetime.now():
                    return response(400, {'error': 'Промокод истек'})
                
                if promo['used_count'] >= promo['max_uses']:
                    return response(400, {'error': 'Промокод исчерпан'})
                
                cur.execute("""
                    SELECT * FROM promocode_usage 
                    WHERE promocode_id = %s AND user_id = %s
                """, (promo['id'], user_id))
                
                if cur.fetchone():
                    return response(400, {'error': 'Вы уже использовали этот промокод'})
                
                cur.execute("""
                    INSERT INTO promocode_usage (promocode_id, user_id)
                    VALUES (%s, %s)
                """, (promo['id'], user_id))
                
                cur.execute("""
                    UPDATE promocodes 
                    SET used_count = used_count + 1
                    WHERE id = %s
                """, (promo['id'],))
                
                rewards = {}
                if promo['bonus_money']:
                    cur.execute("""
                        UPDATE characters 
                        SET money = money + %s
                        WHERE user_id = %s
                    """, (promo['bonus_money'], user_id))
                    rewards['money'] = promo['bonus_money']
                
                conn.commit()
                
                return response(200, {
                    'success': True,
                    'message': 'Промокод активирован',
                    'rewards': rewards,
                    'discount_percent': promo['discount_percent']
                })
            
            elif action == 'create':
                code = body.get('code', '').strip().upper()
                discount_percent = body.get('discount_percent')
                bonus_money = body.get('bonus_money')
                max_uses = body.get('max_uses', 100)
                expires_at = body.get('expires_at')
                
                if not code:
                    return response(400, {'error': 'code обязателен'})
                
                try:
                    cur.execute("""
                        INSERT INTO promocodes (code, discount_percent, bonus_money, max_uses, expires_at)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING *
                    """, (code, discount_percent, bonus_money, max_uses, expires_at))
                    
                    promo = cur.fetchone()
                    conn.commit()
                    
                    return response(200, {
                        'success': True,
                        'promocode': dict(promo)
                    })
                
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return response(400, {'error': 'Промокод уже существует'})
        
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
