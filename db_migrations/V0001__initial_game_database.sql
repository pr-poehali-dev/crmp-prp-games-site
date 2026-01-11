-- Создание таблиц для игрового проекта PRP GAMES

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'moderator', 'admin'))
);

-- Таблица игровых персонажей
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    character_name VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    money INTEGER DEFAULT 5000,
    bank_balance INTEGER DEFAULT 0,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    playtime_minutes INTEGER DEFAULT 0,
    last_server VARCHAR(50),
    last_position_x FLOAT,
    last_position_y FLOAT,
    last_position_z FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE
);

-- Таблица инвентаря
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id),
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(20) CHECK (item_type IN ('weapon', 'gear', 'artifact', 'item')),
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    level INTEGER DEFAULT 1,
    damage INTEGER,
    defense INTEGER,
    quantity INTEGER DEFAULT 1,
    equipped BOOLEAN DEFAULT FALSE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица кланов
CREATE TABLE IF NOT EXISTS clans (
    id SERIAL PRIMARY KEY,
    clan_name VARCHAR(50) UNIQUE NOT NULL,
    clan_tag VARCHAR(10) UNIQUE NOT NULL,
    logo_emoji VARCHAR(10) DEFAULT '⚔️',
    leader_id INTEGER REFERENCES users(id),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    treasury INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Таблица участников кланов
CREATE TABLE IF NOT EXISTS clan_members (
    id SERIAL PRIMARY KEY,
    clan_id INTEGER REFERENCES clans(id),
    user_id INTEGER REFERENCES users(id),
    character_id INTEGER REFERENCES characters(id),
    rank VARCHAR(20) DEFAULT 'member' CHECK (rank IN ('member', 'officer', 'leader')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution INTEGER DEFAULT 0,
    UNIQUE(clan_id, user_id)
);

-- Таблица войн кланов
CREATE TABLE IF NOT EXISTS clan_wars (
    id SERIAL PRIMARY KEY,
    clan1_id INTEGER REFERENCES clans(id),
    clan2_id INTEGER REFERENCES clans(id),
    clan1_kills INTEGER DEFAULT 0,
    clan2_kills INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    winner_id INTEGER REFERENCES clans(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'finished'))
);

-- Таблица достижений
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10),
    category VARCHAR(30),
    requirement_type VARCHAR(30),
    requirement_value INTEGER,
    reward_money INTEGER DEFAULT 0,
    reward_experience INTEGER DEFAULT 0
);

-- Таблица полученных достижений
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id),
    achievement_id INTEGER REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(character_id, achievement_id)
);

-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    category VARCHAR(30) DEFAULT 'general'
);

-- Таблица донат-товаров
CREATE TABLE IF NOT EXISTS shop_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(30),
    item_type VARCHAR(30),
    icon_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица покупок
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    shop_item_id INTEGER REFERENCES shop_items(id),
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Таблица промокодов
CREATE TABLE IF NOT EXISTS promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER,
    bonus_money INTEGER,
    bonus_items TEXT,
    max_uses INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Таблица использованных промокодов
CREATE TABLE IF NOT EXISTS promocode_usage (
    id SERIAL PRIMARY KEY,
    promocode_id INTEGER REFERENCES promocodes(id),
    user_id INTEGER REFERENCES users(id),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(promocode_id, user_id)
);

-- Таблица серверов
CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    port INTEGER,
    max_players INTEGER DEFAULT 500,
    current_players INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
    map_name VARCHAR(50),
    game_mode VARCHAR(50)
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_character_id ON inventory(character_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_clan_id ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_user_id ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_characters_online ON characters(is_online) WHERE is_online = TRUE;

-- Вставка тестовых данных для достижений
INSERT INTO achievements (name, description, icon_emoji, category, requirement_type, requirement_value, reward_money, reward_experience) VALUES
('Первая кровь', 'Совершите первое убийство', '🎯', 'combat', 'kills', 1, 1000, 500),
('Убийца', 'Убейте 50 игроков', '💀', 'combat', 'kills', 50, 10000, 5000),
('Легенда', 'Достигните 100 уровня', '👑', 'progression', 'level', 100, 50000, 25000),
('Богач', 'Накопите 1,000,000$', '💰', 'economy', 'money', 1000000, 0, 10000),
('Ветеран', 'Проведите 100 часов в игре', '⏰', 'time', 'playtime', 6000, 20000, 10000)
ON CONFLICT (name) DO NOTHING;

-- Вставка тестовых серверов
INSERT INTO servers (name, ip_address, port, max_players, current_players, status, map_name, game_mode) VALUES
('Сервер Альфа', '185.119.57.21', 7777, 500, 487, 'online', 'San Andreas', 'CRMP'),
('Сервер Бета', '185.119.57.22', 7777, 500, 392, 'online', 'San Andreas', 'CRMP'),
('Сервер Гамма', '185.119.57.23', 7777, 300, 156, 'online', 'San Andreas', 'RP'),
('Сервер Дельта', '185.119.57.24', 7777, 500, 0, 'maintenance', 'San Andreas', 'CRMP')
ON CONFLICT (name) DO NOTHING;

-- Вставка тестовых новостей
INSERT INTO news (title, content, category, views) VALUES
('Добро пожаловать в PRP GAMES!', 'Мы рады приветствовать вас на нашем новом сервере! Здесь вас ждут захватывающие приключения, динамичный геймплей и дружелюбное комьюнити.', 'announcement', 1523),
('Обновление 1.0: Новая клановая система', 'В сегодняшнем обновлении мы представляем полностью переработанную систему кланов! Теперь вы можете участвовать в войнах, захватывать территории и зарабатывать уникальные награды.', 'update', 892),
('Турнир выходного дня', 'Приглашаем всех игроков принять участие в турнире PvP! Призовой фонд: 500,000$ игровой валюты. Регистрация открыта!', 'event', 645);

-- Вставка товаров в магазин
INSERT INTO shop_items (name, description, price, category, item_type, in_stock) VALUES
('Стартовый пакет', 'Идеален для новичков: 100 кристаллов, уникальный скин и доступ к VIP чату', 299.00, 'packages', 'starter', TRUE),
('Продвинутый пакет', 'Для опытных игроков: 500 кристаллов, 3 эпических скина, приоритет в очереди и уникальный тег', 799.00, 'packages', 'advanced', TRUE),
('Легендарный пакет', 'Максимальный набор: 2000 кристаллов, 10 легендарных скинов, личный саппорт и эксклюзивные предметы', 1999.00, 'packages', 'legendary', TRUE),
('VIP статус (30 дней)', 'Приоритет в очереди, уникальный цвет ника, бонус к опыту +50%', 399.00, 'vip', 'monthly', TRUE),
('Смена ника', 'Измените игровой никнейм один раз', 199.00, 'services', 'rename', TRUE),
('Легендарное оружие', 'Плазменный меч с уроном 250 единиц', 499.00, 'items', 'weapon', TRUE);
