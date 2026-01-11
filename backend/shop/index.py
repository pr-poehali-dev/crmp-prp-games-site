import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для магазина доната и покупок'''
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
            category = params.get('category')
            user_id = params.get('user_id')
            
            if user_id:
                cur.execute("""
                    SELECT p.*, si.name as item_name, si.description, si.category
                    FROM purchases p
                    LEFT JOIN shop_items si ON p.shop_item_id = si.id
                    WHERE p.user_id = %s
                    ORDER BY p.created_at DESC
                    LIMIT 50
                """, (user_id,))
                purchases = cur.fetchall()
                
                return response(200, {
                    'purchases': [dict(p) for p in purchases]
                })
            
            else:
                query = "SELECT * FROM shop_items WHERE in_stock = TRUE"
                params_list = []
                
                if category:
                    query += " AND category = %s"
                    params_list.append(category)
                
                query += " ORDER BY price ASC"
                
                cur.execute(query, params_list)
                items = cur.fetchall()
                
                return response(200, {
                    'items': [dict(item) for item in items]
                })
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'purchase':
                user_id = body.get('user_id')
                shop_item_id = body.get('shop_item_id')
                
                if not user_id or not shop_item_id:
                    return response(400, {'error': 'user_id и shop_item_id обязательны'})
                
                cur.execute("SELECT * FROM shop_items WHERE id = %s AND in_stock = TRUE", (shop_item_id,))
                item = cur.fetchone()
                
                if not item:
                    return response(404, {'error': 'Товар не найден или недоступен'})
                
                transaction_id = f"TXN_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user_id}"
                
                cur.execute("""
                    INSERT INTO purchases (user_id, shop_item_id, price, status, transaction_id)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *
                """, (user_id, shop_item_id, item['price'], 'pending', transaction_id))
                
                purchase = cur.fetchone()
                conn.commit()
                
                return response(200, {
                    'success': True,
                    'message': 'Покупка создана',
                    'purchase': dict(purchase),
                    'payment_url': f'https://payment.prpgames.com/pay/{transaction_id}'
                })
            
            elif action == 'complete_payment':
                transaction_id = body.get('transaction_id')
                
                if not transaction_id:
                    return response(400, {'error': 'transaction_id обязателен'})
                
                cur.execute("""
                    UPDATE purchases 
                    SET status = 'completed', completed_at = %s
                    WHERE transaction_id = %s
                    RETURNING *
                """, (datetime.now(), transaction_id))
                
                purchase = cur.fetchone()
                
                if not purchase:
                    return response(404, {'error': 'Покупка не найдена'})
                
                conn.commit()
                
                return response(200, {
                    'success': True,
                    'message': 'Оплата подтверждена',
                    'purchase': dict(purchase)
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
