import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { AuthModal } from '@/components/AuthModal';
import { auth, User } from '@/lib/api';

interface InventoryItem {
  id: number;
  name: string;
  type: 'weapon' | 'gear' | 'artifact' | 'item';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  damage?: number;
  defense?: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Плазменный меч', type: 'weapon', rarity: 'legendary', level: 50, damage: 250 },
    { id: 2, name: 'Нано-броня', type: 'gear', rarity: 'epic', level: 45, defense: 180 },
    { id: 3, name: 'Кристалл силы', type: 'artifact', rarity: 'rare', level: 30 },
    { id: 4, name: 'Энергетический щит', type: 'gear', rarity: 'legendary', level: 48, defense: 220 },
    { id: 5, name: 'Огненный топор', type: 'weapon', rarity: 'epic', level: 42, damage: 190 },
    { id: 6, name: 'Амулет удачи', type: 'artifact', rarity: 'rare', level: 25 },
  ]);

  useEffect(() => {
    const savedUser = auth.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    toast({
      title: 'Выход выполнен',
      description: 'До скорых встреч!',
    });
    setActiveSection('home');
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
  };

  const handlePromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME2024') {
      toast({
        title: 'Промокод активирован!',
        description: 'Вы получили 10,000$ игровой валюты',
      });
      setPromoCode('');
    } else {
      toast({
        title: 'Ошибка',
        description: 'Промокод не найден',
        variant: 'destructive',
      });
    }
  };

  const addToCart = (itemId: number) => {
    setCart([...cart, itemId]);
    toast({
      title: 'Добавлено в корзину',
      description: 'Товар добавлен в корзину покупок',
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(id => id !== itemId));
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
    };
    return colors[rarity as keyof typeof colors];
  };

  const servers = [
    { name: 'Сервер Альфа', players: 487, maxPlayers: 500, status: 'online', ping: 15 },
    { name: 'Сервер Бета', players: 392, maxPlayers: 500, status: 'online', ping: 22 },
    { name: 'Сервер Гамма', players: 156, maxPlayers: 300, status: 'online', ping: 18 },
    { name: 'Сервер Дельта', players: 0, maxPlayers: 500, status: 'maintenance', ping: 0 },
  ];

  const topPlayers = [
    { rank: 1, name: 'CyberKnight', level: 89, points: 15420 },
    { rank: 2, name: 'NeonWarrior', level: 87, points: 14850 },
    { rank: 3, name: 'QuantumHero', level: 85, points: 14100 },
    { rank: 4, name: 'PlasmaGamer', level: 83, points: 13560 },
    { rank: 5, name: 'VoidMaster', level: 82, points: 13200 },
  ];

  const clans = [
    { name: 'Киберпанки', members: 145, level: 25, logo: '⚡' },
    { name: 'Неоновые Воины', members: 132, level: 23, logo: '🔥' },
    { name: 'Цифровые Легенды', members: 118, level: 22, logo: '💎' },
    { name: 'Плазменный Альянс', members: 95, level: 20, logo: '⚔️' },
  ];

  const gallery = [
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/7a187f9e-d063-4027-b2d2-10ebfabe0f66.jpg',
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/1f60aa3a-8e29-4ffa-a0d1-237f7e066d77.jpg',
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/96edd553-a7aa-47df-a384-c19c43f6a860.jpg',
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-glow bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PRP GAMES
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {['home', 'about', 'servers', 'ratings', 'news', 'gallery', 'clans', 'donate', 'profile', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'about' && 'Об игре'}
                  {section === 'servers' && 'Сервера'}
                  {section === 'ratings' && 'Рейтинги'}
                  {section === 'news' && 'Новости'}
                  {section === 'gallery' && 'Галерея'}
                  {section === 'clans' && 'Кланы'}
                  {section === 'donate' && 'Магазин'}
                  {section === 'profile' && 'Профиль'}
                  {section === 'contacts' && 'Контакты'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => setActiveSection('profile')}>
                    <Icon name="User" className="mr-2 h-4 w-4" />
                    {user.username}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <Icon name="LogOut" className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setAuthModalOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover-glow">
                  <Icon name="LogIn" className="mr-2 h-4 w-4" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative overflow-hidden rounded-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${gallery[0]})`,
                  filter: 'brightness(0.4)'
                }}
              />
              <div className="relative z-10 px-8 py-32 text-center">
                <h1 className="text-6xl font-bold mb-6 text-glow">
                  Добро пожаловать в PRP GAMES
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Погрузитесь в мир киберпанка и приключений. Создавайте кланы, сражайтесь с врагами и становитесь легендой!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover-glow text-lg px-8">
                    Начать играть
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                    Узнать больше
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="hover-glow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name="Users" className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1000+ Игроков</CardTitle>
                  <CardDescription>Активное игровое сообщество онлайн 24/7</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-glow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name="Sword" className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Эпические сражения</CardTitle>
                  <CardDescription>PvP и PvE режимы с уникальной системой боя</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-glow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name="Trophy" className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Турниры и награды</CardTitle>
                  <CardDescription>Еженедельные турниры с призовым фондом</CardDescription>
                </CardHeader>
              </Card>
            </section>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Об игре PRP GAMES</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg">
                  PRP GAMES — это уникальный киберпанк RPG проект, где каждый игрок может стать легендой. 
                  Создавайте своего персонажа, прокачивайте навыки, собирайте легендарное снаряжение и объединяйтесь в кланы.
                </p>
                <p className="text-lg">
                  В нашем мире вас ждут захватывающие сюжетные миссии, динамичные PvP сражения, 
                  сложные рейды на боссов и постоянно обновляемый контент.
                </p>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Система прокачки</h4>
                      <p className="text-sm text-muted-foreground">100+ уровней и уникальных навыков</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Кастомизация</h4>
                      <p className="text-sm text-muted-foreground">Тысячи вариантов персонализации</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Экономика</h4>
                      <p className="text-sm text-muted-foreground">Торговля, крафт и аукцион</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Обновления</h4>
                      <p className="text-sm text-muted-foreground">Новый контент каждую неделю</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'servers' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Игровые сервера</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {servers.map((server, idx) => (
                <Card key={idx} className="hover-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{server.name}</CardTitle>
                      <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                        {server.status === 'online' ? 'Онлайн' : 'Техработы'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Игроков онлайн</span>
                      <span className="font-semibold">{server.players} / {server.maxPlayers}</span>
                    </div>
                    <Progress value={(server.players / server.maxPlayers) * 100} className="h-2" />
                    {server.status === 'online' && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow" />
                          <span className="text-muted-foreground">Пинг: {server.ping}ms</span>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                          Подключиться
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'ratings' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Рейтинг игроков</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {topPlayers.map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        player.rank === 1 ? 'bg-yellow-500 text-black' :
                        player.rank === 2 ? 'bg-gray-400 text-black' :
                        player.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-muted text-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <Avatar>
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-muted-foreground">Уровень {player.level}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{player.points.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">очков</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Галерея</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {gallery.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden hover-glow cursor-pointer">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'clans' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Клан-система</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {clans.map((clan, idx) => (
                <Card key={idx} className="hover-glow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{clan.logo}</div>
                      <div>
                        <CardTitle>{clan.name}</CardTitle>
                        <CardDescription>Уровень клана: {clan.level}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{clan.members} участников</span>
                      </div>
                      <Button size="sm" variant="outline">Вступить</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'donate' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold text-glow">Магазин</h2>
              {cart.length > 0 && (
                <Button variant="outline" onClick={() => setActiveSection('cart')}>
                  <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                  Корзина ({cart.length})
                </Button>
              )}
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handlePromoCode}>Активировать</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Используйте промокод WELCOME2024 для бонуса</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 1, name: 'Стартовый пакет', price: 299, description: '100 кристаллов, уникальный скин, VIP чат' },
                { id: 2, name: 'Продвинутый пакет', price: 799, description: '500 кристаллов, 3 эпических скина, приоритет в очереди', featured: true },
                { id: 3, name: 'Легендарный пакет', price: 1999, description: '2000 кристаллов, 10 легендарных скинов, личный саппорт' },
                { id: 4, name: 'VIP статус (30 дней)', price: 399, description: 'Приоритет в очереди, уникальный цвет ника, +50% к опыту' },
                { id: 5, name: 'Смена ника', price: 199, description: 'Измените игровой никнейм один раз' },
                { id: 6, name: 'Легендарное оружие', price: 499, description: 'Плазменный меч с уроном 250 единиц' },
              ].map((item) => (
                <Card key={item.id} className={`hover-glow ${item.featured ? 'border-primary card-glow' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{item.price} ₽</div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      onClick={() => addToCart(item.id)}
                      disabled={cart.includes(item.id)}
                    >
                      {cart.includes(item.id) ? 'В корзине' : 'Купить'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Корзина покупок</h2>
            {cart.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Icon name="ShoppingCart" className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground mb-4">Корзина пуста</p>
                  <Button onClick={() => setActiveSection('donate')}>Перейти в магазин</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((itemId) => {
                    const items = [
                      { id: 1, name: 'Стартовый пакет', price: 299 },
                      { id: 2, name: 'Продвинутый пакет', price: 799 },
                      { id: 3, name: 'Легендарный пакет', price: 1999 },
                      { id: 4, name: 'VIP статус (30 дней)', price: 399 },
                      { id: 5, name: 'Смена ника', price: 199 },
                      { id: 6, name: 'Легендарное оружие', price: 499 },
                    ];
                    const item = items.find(i => i.id === itemId);
                    if (!item) return null;
                    
                    return (
                      <Card key={itemId}>
                        <CardContent className="pt-6 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(itemId)}>
                            <Icon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <Card className="border-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">
                        {cart.reduce((sum, itemId) => {
                          const prices: Record<number, number> = { 1: 299, 2: 799, 3: 1999, 4: 399, 5: 199, 6: 499 };
                          return sum + (prices[itemId] || 0);
                        }, 0)} ₽
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg">
                      Перейти к оплате
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-glow">Личный кабинет</h2>
              <Button variant="outline">
                <Icon name="Settings" className="mr-2 h-4 w-4" />
                Настройки
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl">CK</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">CyberKnight</h3>
                      <Badge className="mt-2">Уровень 89</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Опыт</span>
                      <span className="font-semibold">15420 / 20000</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Побед</span>
                      <span className="font-semibold">342</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Поражений</span>
                      <span className="font-semibold">128</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">K/D</span>
                      <span className="font-semibold text-primary">2.67</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Инвентарь</CardTitle>
                  <CardDescription>Управление предметами, оружием и артефактами</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">Все</TabsTrigger>
                      <TabsTrigger value="weapon">Оружие</TabsTrigger>
                      <TabsTrigger value="gear">Снаряжение</TabsTrigger>
                      <TabsTrigger value="artifact">Артефакты</TabsTrigger>
                      <TabsTrigger value="item">Предметы</TabsTrigger>
                    </TabsList>
                    {['all', 'weapon', 'gear', 'artifact', 'item'].map((type) => (
                      <TabsContent key={type} value={type} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {inventory
                            .filter((item) => type === 'all' || item.type === type)
                            .map((item) => (
                              <Card key={item.id} className="hover-glow cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm">{item.name}</h4>
                                      <Badge variant="outline" className={`${getRarityColor(item.rarity)} text-white mt-1`}>
                                        {item.rarity}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Ур. {item.level}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 text-xs mt-3">
                                    {item.damage && (
                                      <div className="flex items-center gap-1">
                                        <Icon name="Sword" className="h-3 w-3 text-primary" />
                                        <span>{item.damage}</span>
                                      </div>
                                    )}
                                    {item.defense && (
                                      <div className="flex items-center gap-1">
                                        <Icon name="Shield" className="h-3 w-3 text-secondary" />
                                        <span>{item.defense}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Контакты</h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Icon name="MessageCircle" className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Discord</h4>
                    <p className="text-sm text-muted-foreground">discord.gg/prpgames</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <Icon name="Send" className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Telegram</h4>
                    <p className="text-sm text-muted-foreground">@prpgames_official</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Icon name="AtSign" className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">support@prpgames.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Icon name="Youtube" className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">YouTube</h4>
                    <p className="text-sm text-muted-foreground">youtube.com/@prpgames</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeSection === 'news' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold text-glow mb-6">Новости проекта</h2>
            {[
              { 
                id: 1, 
                title: 'Добро пожаловать в PRP GAMES!', 
                content: 'Мы рады приветствовать вас на нашем новом сервере! Здесь вас ждут захватывающие приключения, динамичный геймплей и дружелюбное комьюнити.', 
                category: 'announcement',
                views: 1523,
                date: '11.01.2026'
              },
              { 
                id: 2, 
                title: 'Обновление 1.0: Новая клановая система', 
                content: 'В сегодняшнем обновлении мы представляем полностью переработанную систему кланов! Теперь вы можете участвовать в войнах, захватывать территории и зарабатывать уникальные награды.', 
                category: 'update',
                views: 892,
                date: '11.01.2026'
              },
              { 
                id: 3, 
                title: 'Турнир выходного дня', 
                content: 'Приглашаем всех игроков принять участие в турнире PvP! Призовой фонд: 500,000$ игровой валюты. Регистрация открыта!', 
                category: 'event',
                views: 645,
                date: '11.01.2026'
              },
            ].map((news) => (
              <Card key={news.id} className="hover-glow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{news.category === 'announcement' ? 'Объявление' : news.category === 'update' ? 'Обновление' : 'Событие'}</Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Eye" className="h-4 w-4" />
                        {news.views}
                      </div>
                      <span>{news.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{news.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onSuccess={handleAuthSuccess}
      />

      <footer className="mt-20 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 PRP GAMES. Все права защищены.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Правила
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;