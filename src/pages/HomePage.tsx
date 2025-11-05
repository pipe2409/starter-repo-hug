import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, TrendingUp, Flame, Award, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface HomePageProps {
  user: User;
  profile: any;
}

export default function HomePage({ user, profile }: HomePageProps) {
  // Fetch user's lesson progress
  const { data: lessonsProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['user-lessons-progress', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*, lessons(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch total lessons count
  const { data: totalLessons } = useQuery({
    queryKey: ['total-lessons'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const completedLessons = lessonsProgress?.filter(p => p.completed).length || 0;
  const totalLessonsCount = totalLessons || 0;
  const progressPercentage = totalLessonsCount > 0 ? (completedLessons / totalLessonsCount) * 100 : 0;
  const inProgressLessons = lessonsProgress?.filter(p => !p.completed && p.progress > 0) || [];

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'premium': return 'default';
      case 'básico': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'premium': return '👑';
      case 'básico': return '⭐';
      default: return '🆓';
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-3 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-6 rounded-xl border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold font-fredoka bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ¡Hola, {profile?.display_name || 'Usuario'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Continúa tu viaje de aprendizaje financiero
            </p>
          </div>
          <Badge variant={getPlanBadgeVariant(profile?.subscription_plan)} className="text-lg px-4 py-2">
            {getPlanIcon(profile?.subscription_plan)} {profile?.subscription_plan?.toUpperCase() || 'GRATUITO'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lecciones</p>
              <p className="text-2xl font-bold font-fredoka">{completedLessons}/{totalLessonsCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Racha</p>
              <p className="text-2xl font-bold font-fredoka">{profile?.streak || 0} días</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-full">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monedas</p>
              <p className="text-2xl font-bold font-fredoka">{profile?.coins || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progreso</p>
              <p className="text-2xl font-bold font-fredoka">{progressPercentage.toFixed(0)}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Progress */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold font-fredoka mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Tu Progreso General
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Lecciones completadas</span>
                <span className="font-semibold">{completedLessons} de {totalLessonsCount}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {totalLessonsCount - completedLessons > 0 
                  ? `¡Solo ${totalLessonsCount - completedLessons} lecciones más para completar todo!`
                  : '¡Has completado todas las lecciones! 🎉'}
              </p>
            </div>
          </Card>

          {/* Continue Learning */}
          {inProgressLessons.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold font-fredoka mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-accent" />
                Continúa Donde lo Dejaste
              </h2>
              <div className="space-y-4">
                {inProgressLessons.slice(0, 3).map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{lesson.lessons?.title}</h3>
                      <Progress value={lesson.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{lesson.progress}% completado</p>
                    </div>
                    <Link to="/lessons">
                      <Button size="sm">Continuar</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-fredoka mb-2">Lecciones</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Aprende sobre finanzas de manera divertida
                  </p>
                  <Link to="/lessons">
                    <Button className="w-full">
                      Ir a Lecciones
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-fredoka mb-2">Rankings</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Compite con otros estudiantes
                  </p>
                  <Link to="/leaderboard">
                    <Button variant="secondary" className="w-full">
                      Ver Rankings
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          {/* Streak Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <h3 className="text-xl font-bold font-fredoka mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Racha Actual
            </h3>
            <div className="text-center py-6">
              <div className="text-6xl mb-2">🔥</div>
              <p className="text-4xl font-bold font-fredoka text-orange-500">{profile?.streak || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">días consecutivos</p>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              ¡Mantén tu racha completando lecciones diariamente!
            </p>
          </Card>

          {/* Achievements Preview */}
          <Card className="p-6">
            <h3 className="text-xl font-bold font-fredoka mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Logros Recientes
            </h3>
            <div className="space-y-3">
              {completedLessons >= 1 && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">🎓</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Primera Lección</p>
                    <p className="text-xs text-muted-foreground">Completaste tu primera lección</p>
                  </div>
                </div>
              )}
              {completedLessons >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">⭐</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">5 Lecciones</p>
                    <p className="text-xs text-muted-foreground">Has completado 5 lecciones</p>
                  </div>
                </div>
              )}
              {(profile?.streak || 0) >= 7 && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">🔥</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Semana de Fuego</p>
                    <p className="text-xs text-muted-foreground">7 días de racha</p>
                  </div>
                </div>
              )}
              {completedLessons === 0 && (profile?.streak || 0) === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  ¡Completa lecciones para desbloquear logros!
                </p>
              )}
            </div>
          </Card>

          {/* Daily Goal */}
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <h3 className="text-xl font-bold font-fredoka mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Meta Diaria
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Completa al menos 1 lección hoy</p>
              <Progress value={inProgressLessons.length > 0 ? 50 : 0} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {inProgressLessons.length > 0 
                  ? '¡Sigue así! Estás haciendo progreso' 
                  : 'Comienza una lección para avanzar'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
