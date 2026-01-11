import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface InventoryItem {
  id: number;
  name: string;
  type: 'weapon' | 'gear' | 'artifact' | 'item';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  damage?: number;
  defense?: number;
}

interface ProfileSectionProps {
  activeSection: string;
  inventory: InventoryItem[];
  getRarityColor: (rarity: string) => string;
}

export const ProfileSection = ({ activeSection, inventory, getRarityColor }: ProfileSectionProps) => {
  return (
    <>
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
    </>
  );
};
