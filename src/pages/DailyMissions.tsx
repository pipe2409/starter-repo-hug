import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Zap, CheckCircle2, Clock, Coins } from "lucide-react";
import { useState } from "react";

interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  icon: any;
}

export default function DailyMissions({ user }: { user: User }) {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "1",
      title: "Completa 3 lecciones",
      description: "Termina 3 lecciones hoy para mejorar tus habilidades",
      progress: 1,
      target: 3,
      reward: 50,
      completed: false,
      icon: Target,
    },
    {
      id: "2",
      title: "Racha de 5 días",
      description: "Mantén tu racha activa durante 5 días consecutivos",
      progress: 3,
      target: 5,
      reward: 100,
      completed: false,
      icon: Zap,
    },
    {
      id: "3",
      title: "Gana 100 monedas",
      description: "Acumula 100 monedas completando actividades",
      progress: 65,
      target: 100,
      reward: 25,
      completed: false,
      icon: Coins,
    },
    {
      id: "4",
      title: "Primera lección del día",
      description: "Completa tu primera lección hoy",
      progress: 1,
      target: 1,
      reward: 30,
      completed: true,
      icon: CheckCircle2,
    },
  ]);

  const completedMissions = missions.filter(m => m.completed).length;
  const totalRewards = missions.filter(m => m.completed).reduce((sum, m) => sum + m.reward, 0);

  const handleClaimReward = (missionId: string) => {
    setMissions(missions.map(m => 
      m.id === missionId && m.progress >= m.target 
        ? { ...m, completed: true } 
        : m
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Misiones Diarias
        </h1>
        <p className="text-muted-foreground">
          Completa misiones para ganar monedas y mejorar tu progreso
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Misiones Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedMissions}/{missions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monedas Ganadas Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              {totalRewards}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tiempo Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              8h 32m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tus Misiones</h2>
        <div className="grid gap-4">
          {missions.map((mission) => {
            const Icon = mission.icon;
            const progressPercentage = (mission.progress / mission.target) * 100;
            const canClaim = mission.progress >= mission.target && !mission.completed;

            return (
              <Card key={mission.id} className={mission.completed ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {mission.title}
                          {mission.completed && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Completada
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{mission.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1 whitespace-nowrap">
                      <Coins className="h-3 w-3" />
                      +{mission.reward}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  {canClaim && (
                    <Button 
                      onClick={() => handleClaimReward(mission.id)}
                      className="w-full"
                    >
                      Reclamar Recompensa
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
