import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface ContentSectionsProps {
  activeSection: string;
  gallery: string[];
  servers: Array<{ name: string; players: number; maxPlayers: number; status: string; ping: number }>;
  topPlayers: Array<{ rank: number; name: string; level: number; points: number }>;
  clans: Array<{ name: string; members: number; level: number; logo: string }>;
}

export const ContentSections = ({ activeSection, gallery, servers, topPlayers, clans }: any) => {
  return (
    <>
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
                Погрузитесь в мир криминальной России. Стройте бизнес, вступайте в банды и становитесь авторитетом!
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Скачать лаунчер
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                  Правила сервера
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
                <CardDescription>Активное комьюнити онлайн круглосуточно</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-glow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name="Sword" className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Криминальные разборки</CardTitle>
                <CardDescription>Захват территорий, войны банд и уличные гонки</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-glow cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name="Trophy" className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Реалистичная экономика</CardTitle>
                <CardDescription>Заработок, бизнес и нелегальные схемы обогащения</CardDescription>
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
                PRP GAMES — это российский CRMP проект с уникальной ролевой системой. 
                Создавайте своего персонажа, устраивайтесь на работу, открывайте бизнес или вступайте в преступные группировки.
              </p>
              <p className="text-lg">
                В нашем мире действуют реалистичные законы: работайте в полиции, медицине, армии, или выбирайте криминальный путь.
                Покупайте дома, машины, оружие. Участвуйте в войнах банд и захватывайте территории.
              </p>
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Система уровней</h4>
                    <p className="text-sm text-muted-foreground">Прокачка персонажа и профессий</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Реалистичная РП</h4>
                    <p className="text-sm text-muted-foreground">Строгие правила и адекватная администрация</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Экономика</h4>
                    <p className="text-sm text-muted-foreground">Работа, бизнес, банковская система</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Check" className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Транспорт</h4>
                    <p className="text-sm text-muted-foreground">Более 200 автомобилей и мотоциклов</p>
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
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
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
    </>
  );
};