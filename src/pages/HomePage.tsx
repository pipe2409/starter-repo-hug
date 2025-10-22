import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coins,
  TrendingUp,
  Target,
  Trophy,
  Flame,
  Sparkles,
  BookOpen,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import mascotImage from "@/assets/mascot-transparent.png";
import coinsImage from "@/assets/coins.png";
import streakImage from "@/assets/streak.png";

interface Profile {
  display_name: string;
  total_coins: number;
  level: number;
  experience_points: number;
  current_streak: number;
}

interface Stats {
  lessonsCompleted: number;
  achievementsUnlocked: number;
  todayMissionsCompleted: number;
}

export default function HomePage({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    lessonsCompleted: 0,
    achievementsUnlocked: 0,
    todayMissionsCompleted: 0,
  });

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
    if (profileData) setProfile(profileData);

    // Load stats
    const { data: lessonsData } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", true);

    const { data: achievementsData } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", user.id);

    const { data: missionsData } = await supabase
      .from("user_daily_missions")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed", true)
      .eq("date", new Date().toISOString().split("T")[0]);

    setStats({
      lessonsCompleted: lessonsData?.length || 0,
      achievementsUnlocked: achievementsData?.length || 0,
      todayMissionsCompleted: missionsData?.length || 0,
    });
  };

  if (!profile) return <div className="p-8">Cargando...</div>;

  const xpForNextLevel = profile.level * 100;
  const xpProgress = (profile.experience_points / xpForNextLevel) * 100;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-poppins">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={mascotImage}
            alt="LuckCash"
            className="w-20 h-20 animate-float"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-fredoka">
              ¡Hola, {profile.display_name}!
            </h1>
            <p className="text-muted-foreground">
              Listo para aprender más sobre finanzas
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-secondary to-orange-400 text-white">
            <img src={coinsImage} alt="Coins" className="w-12 h-12 mb-2" />
            <p className="text-3xl font-bold">{profile.total_coins}</p>
            <p className="text-sm opacity-90">LuckCoins</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-primary to-purple-600 text-white">
            <Star className="w-12 h-12 mb-2" />
            <p className="text-3xl font-bold">Nivel {profile.level}</p>
            <p className="text-sm opacity-90">{profile.experience_points} XP</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <img src={streakImage} alt="Streak" className="w-12 h-12 mb-2" />
            <p className="text-3xl font-bold">{profile.current_streak}</p>
            <p className="text-sm opacity-90">Días de Racha</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-accent to-green-500 text-white">
            <Trophy className="w-12 h-12 mb-2" />
            <p className="text-3xl font-bold">{stats.achievementsUnlocked}</p>
            <p className="text-sm opacity-90">Logros</p>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progreso al Nivel {profile.level + 1}</span>
            <span className="text-sm text-muted-foreground">
              {profile.experience_points} / {xpForNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-gradient-to-r from-primary to-purple-600 h-4 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link to="/lessons">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <BookOpen className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-bold text-lg mb-1">Lecciones</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Aprende conceptos financieros
            </p>
            <Button className="w-full">Comenzar</Button>
          </Card>
        </Link>

        <Link to="/missions">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <Target className="w-10 h-10 text-accent mb-3" />
            <h3 className="font-bold text-lg mb-1">Misiones Diarias</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {stats.todayMissionsCompleted} / 4 completadas hoy
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90">
              Ver Misiones
            </Button>
          </Card>
        </Link>

        <Link to="/store">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
            <Sparkles className="w-10 h-10 text-secondary mb-3" />
            <h3 className="font-bold text-lg mb-1">Tienda</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Canjea tus LuckCoins
            </p>
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Explorar
            </Button>
          </Card>
        </Link>
      </div>

      {/* Daily Stats */}
      <Card className="p-6">
        <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Progreso de Hoy
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-primary">
              {stats.lessonsCompleted}
            </p>
            <p className="text-sm text-muted-foreground">
              Lecciones Completadas
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">
              {stats.todayMissionsCompleted}
            </p>
            <p className="text-sm text-muted-foreground">Misiones Diarias</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-secondary">
              {profile.total_coins}
            </p>
            <p className="text-sm text-muted-foreground">LuckCoins Totales</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
