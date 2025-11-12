import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Coins, Flame, CheckCircle2, Clock, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile({ user }: { user: User }) {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lessonsProgress, isLoading: lessonsLoading } = useQuery({
    queryKey: ["user-lesson-progress", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: totalLessons } = useQuery({
    queryKey: ["lessons-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  if (profileLoading || lessonsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const completedLessons = lessonsProgress?.filter(p => p.completed).length || 0;
  const inProgressLessons = lessonsProgress?.filter(p => p.progress > 0 && !p.completed).length || 0;
  const progressPercentage = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Misiones - datos estáticos por ahora
  const totalMissions = 5;
  const completedMissions = 2;
  const missionsProgress = Math.round((completedMissions / totalMissions) * 100);

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "premium": return "default";
      case "pro": return "secondary";
      default: return "outline";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "premium": return "👑";
      case "pro": return "⭐";
      default: return "🆓";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            {profile?.display_name || user.email}
          </p>
        </div>
        <Badge variant={getPlanBadgeVariant(profile?.subscription_plan || "gratuito")} className="text-lg px-4 py-2">
          {getPlanIcon(profile?.subscription_plan || "gratuito")} {profile?.subscription_plan?.toUpperCase() || "GRATUITO"}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monedas</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.coins || 0}</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.streak || 0}</div>
            <p className="text-xs text-muted-foreground">Días consecutivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Misiones</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMissions}/{totalMissions}</div>
            <p className="text-xs text-muted-foreground">Hoy completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resumen de Lecciones
          </CardTitle>
          <CardDescription>Tu progreso en el aprendizaje financiero</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso General</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedLessons}</p>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressLessons}</p>
                <p className="text-xs text-muted-foreground">En Progreso</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Missions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Misiones Diarias
          </CardTitle>
          <CardDescription>Tu progreso en las misiones de hoy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Misiones Completadas</span>
              <span className="font-medium">{completedMissions}/{totalMissions}</span>
            </div>
            <Progress value={missionsProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedMissions}</p>
                <p className="text-xs text-muted-foreground">Completadas Hoy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-yellow-500/10">
                <Coins className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedMissions * 50}</p>
                <p className="text-xs text-muted-foreground">Monedas Ganadas Hoy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
