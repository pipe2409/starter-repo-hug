import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Coins, BookOpen, Store, LogOut, Star } from "lucide-react";
import mascotImage from "@/assets/mascot-transparent.png";
import coinsImage from "@/assets/coins.png";
import { Navigate } from "react-router-dom";

interface Profile {
  display_name: string;
  total_coins: number;
  level: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  coins_reward: number;
  content: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  coins_reward: number;
}

interface StoreItem {
  id: string;
  title: string;
  description: string;
  cost_coins: number;
  category: string;
}

export const Dashboard = ({ user }: { user: User }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    setProfile(profileData);

    // Load lessons
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .order("order_index");
    setLessons(lessonsData || []);

    // Load achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*");
    setAchievements(achievementsData || []);

    // Load store items
    const { data: storeData } = await supabase
      .from("rewards_store")
      .select("*");
    setStoreItems(storeData || []);

    // Load completed lessons
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true);
    setCompletedLessons(progressData?.map((p) => p.lesson_id) || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const completeLesson = async (lesson: Lesson) => {
    try {
      // Mark lesson as complete
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
          score: 100,
        });

      if (progressError) throw progressError;

      // Update coins
      const newCoins = (profile?.total_coins || 0) + lesson.coins_reward;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ total_coins: newCoins })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      setCompletedLessons([...completedLessons, lesson.id]);
      setProfile({ ...profile!, total_coins: newCoins });

      toast({
        title: "¡Lección completada! 🎉",
        description: `Ganaste ${lesson.coins_reward} FinCoins`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const purchaseItem = async (item: StoreItem) => {
    if (!profile || profile.total_coins < item.cost_coins) {
      toast({
        title: "No tienes suficientes FinCoins",
        description: `Necesitas ${item.cost_coins} FinCoins`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Create purchase
      const { error: purchaseError } = await supabase
        .from("user_purchases")
        .insert({
          user_id: user.id,
          reward_id: item.id,
        });

      if (purchaseError) throw purchaseError;

      // Deduct coins
      const newCoins = profile.total_coins - item.cost_coins;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ total_coins: newCoins })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      setProfile({ ...profile, total_coins: newCoins });

      toast({
        title: "¡Compra exitosa! 🎁",
        description: `Compraste: ${item.title}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card className="p-6 bg-gradient-to-r from-primary to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={mascotImage}
                alt="Mascot"
                className="w-16 h-16 animate-float"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  ¡Hola, {profile.display_name}!
                </h2>
                <p className="opacity-90">Nivel {profile.level} · Seguí aprendiendo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <img src={coinsImage} alt="Coins" className="w-6 h-6" />
                <span className="font-bold text-xl">{profile.total_coins}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lecciones
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Tienda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <Card
                  key={lesson.id}
                  className="p-6 hover:shadow-lg transition-all animate-slide-up"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{lesson.title}</h3>
                        {isCompleted && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {lesson.category}
                        </span>
                        <span className="flex items-center gap-1 text-secondary font-bold">
                          <Coins className="w-4 h-4" />
                          +{lesson.coins_reward}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => completeLesson(lesson)}
                      disabled={isCompleted}
                      className="bg-gradient-to-r from-accent to-green-500"
                    >
                      {isCompleted ? "Completado" : "Comenzar"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="achievements" className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {achievement.badge_icon === "star" && "⭐"}
                    {achievement.badge_icon === "trophy" && "🏆"}
                    {achievement.badge_icon === "medal" && "🥇"}
                    {achievement.badge_icon === "coins" && "💰"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {achievement.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-secondary font-bold mt-2">
                      <Coins className="w-4 h-4" />
                      +{achievement.coins_reward}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="store" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {storeItems.map((item) => (
              <Card
                key={item.id}
                className="p-6 hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                    {item.category === "avatar" && "👤"}
                    {item.category === "descuento" && "🎁"}
                    {item.category === "bono" && "⚡"}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <Button
                    onClick={() => purchaseItem(item)}
                    disabled={profile.total_coins < item.cost_coins}
                    className="w-full bg-gradient-to-r from-secondary to-orange-400 text-secondary-foreground"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {item.cost_coins} Coins
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
