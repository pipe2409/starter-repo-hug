import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface HomePageProps {
  user: User;
  profile: any;
}

export default function HomePage({ user, profile }: HomePageProps) {
  const completedLessons = 5; // Esto se puede obtener de la base de datos
  const totalLessons = 20;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold font-fredoka bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ¡Bienvenido, {profile?.display_name || 'Usuario'}!
        </h1>
        <p className="text-muted-foreground">
          Tu plan: <span className="font-semibold capitalize">{profile?.subscription_plan || 'Gratuito'}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lecciones</p>
              <p className="text-2xl font-bold font-fredoka">{completedLessons}/{totalLessons}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-full">
              <Trophy className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Racha</p>
              <p className="text-2xl font-bold font-fredoka">{profile?.streak || 0} días</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monedas</p>
              <p className="text-2xl font-bold font-fredoka">{profile?.coins || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
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

      {/* Progress Overview */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold font-fredoka mb-4">Tu Progreso</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lecciones completadas</span>
            <span className="font-semibold">{completedLessons} de {totalLessons}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-xl font-bold font-fredoka mb-2">Continúa Aprendiendo</h3>
          <p className="text-muted-foreground mb-4">
            Sigue con tus lecciones de educación financiera
          </p>
          <Link to="/lessons">
            <Button className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Ir a Lecciones
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold font-fredoka mb-2">Tabla de Posiciones</h3>
          <p className="text-muted-foreground mb-4">
            Compite con otros usuarios y sube de rango
          </p>
          <Link to="/leaderboard">
            <Button variant="secondary" className="w-full">
              <Trophy className="w-4 h-4 mr-2" />
              Ver Rankings
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
