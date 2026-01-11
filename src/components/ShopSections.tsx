import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ShopSectionsProps {
  activeSection: string;
  cart: number[];
  promoCode: string;
  setPromoCode: (code: string) => void;
  setActiveSection: (section: string) => void;
  handlePromoCode: () => void;
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
}

export const ShopSections = ({ 
  activeSection, 
  cart, 
  promoCode, 
  setPromoCode, 
  setActiveSection, 
  handlePromoCode, 
  addToCart, 
  removeFromCart 
}: ShopSectionsProps) => {
  return (
    <>
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
              { id: 1, name: 'Стартовый пакет', price: 299, description: '500,000$, стартовая машина, VIP чат' },
              { id: 2, name: 'Продвинутый пакет', price: 799, description: '2,000,000$, дом, авто, приоритет в очереди', featured: true },
              { id: 3, name: 'Премиум пакет', price: 1999, description: '10,000,000$, элитный дом, люксовое авто, личный саппорт' },
              { id: 4, name: 'VIP статус (30 дней)', price: 399, description: 'Приоритет входа, цветной ник, +50% к зарплате' },
              { id: 5, name: 'Смена ника', price: 199, description: 'Измените игровой никнейм один раз' },
              { id: 6, name: 'Desert Eagle', price: 499, description: 'Легендарный пистолет с золотым покрытием' },
            ].map((item) => (
              <Card key={item.id} className={`hover-glow ${item.featured ? 'border-primary card-glow' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{item.price} ₽</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
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
                    { id: 3, name: 'Премиум пакет', price: 1999 },
                    { id: 4, name: 'VIP статус (30 дней)', price: 399 },
                    { id: 5, name: 'Смена ника', price: 199 },
                    { id: 6, name: 'Desert Eagle', price: 499 },
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
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Перейти к оплате
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
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
    </>
  );
};