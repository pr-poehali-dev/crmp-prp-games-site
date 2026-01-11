import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/api';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user: User | null;
  setAuthModalOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export const Navigation = ({ activeSection, setActiveSection, user, setAuthModalOpen, handleLogout }: NavigationProps) => {
  return (
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
  );
};
