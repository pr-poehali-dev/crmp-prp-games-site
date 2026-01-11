import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthModal } from '@/components/AuthModal';
import { Navigation } from '@/components/Navigation';
import { ContentSections } from '@/components/ContentSections';
import { ShopSections } from '@/components/ShopSections';
import { ProfileSection } from '@/components/ProfileSection';
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
    { id: 1, name: 'AK-47', type: 'weapon', rarity: 'legendary', level: 50, damage: 250 },
    { id: 2, name: 'Бронежилет', type: 'gear', rarity: 'epic', level: 45, defense: 180 },
    { id: 3, name: 'Золотая цепь', type: 'artifact', rarity: 'rare', level: 30 },
    { id: 4, name: 'Desert Eagle', type: 'weapon', rarity: 'legendary', level: 48, damage: 220 },
    { id: 5, name: 'Бита', type: 'weapon', rarity: 'common', level: 5, damage: 30 },
    { id: 6, name: 'Аптечка', type: 'item', rarity: 'common', level: 1 },
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
    { name: 'Москва | RolePlay', players: 487, maxPlayers: 500, status: 'online', ping: 15 },
    { name: 'Санкт-Петербург | RolePlay', players: 392, maxPlayers: 500, status: 'online', ping: 22 },
    { name: 'Краснодар | RolePlay', players: 156, maxPlayers: 300, status: 'online', ping: 18 },
    { name: 'Новосибирск | RolePlay', players: 0, maxPlayers: 500, status: 'maintenance', ping: 0 },
  ];

  const topPlayers = [
    { rank: 1, name: 'Pakhan_Sergey', level: 89, points: 15420 },
    { rank: 2, name: 'Vor_Vladimir', level: 87, points: 14850 },
    { rank: 3, name: 'Bratva_Boss', level: 85, points: 14100 },
    { rank: 4, name: 'Bandit_Alexey', level: 83, points: 13560 },
    { rank: 5, name: 'Avtoritet_Ivan', level: 82, points: 13200 },
  ];

  const clans = [
    { name: 'Кавказская Мафия', members: 145, level: 25, logo: '🔫' },
    { name: 'Братва 90-х', members: 132, level: 23, logo: '🚗' },
    { name: 'Черные Волки', members: 118, level: 22, logo: '🐺' },
    { name: 'Сибирские Львы', members: 95, level: 20, logo: '🦁' },
  ];

  const gallery = [
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/7a187f9e-d063-4027-b2d2-10ebfabe0f66.jpg',
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/1f60aa3a-8e29-4ffa-a0d1-237f7e066d77.jpg',
    'https://cdn.poehali.dev/projects/3d4af3ba-1670-4f5c-b2c6-0aa1fdeaf08b/files/96edd553-a7aa-47df-a384-c19c43f6a860.jpg',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        setAuthModalOpen={setAuthModalOpen}
        handleLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <ContentSections
          activeSection={activeSection}
          gallery={gallery}
          servers={servers}
          topPlayers={topPlayers}
          clans={clans}
        />

        <ShopSections
          activeSection={activeSection}
          cart={cart}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          setActiveSection={setActiveSection}
          handlePromoCode={handlePromoCode}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />

        <ProfileSection
          activeSection={activeSection}
          inventory={inventory}
          getRarityColor={getRarityColor}
        />
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