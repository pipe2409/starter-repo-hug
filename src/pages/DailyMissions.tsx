import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  CheckCircle2,
  Coins,
  Zap,
  Sunrise,
  Trophy,
} from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string;
  mission_type: string;
  target_value: number;
  coins_reward: number;
  xp_reward: number;
  icon: string;
}

interface UserMission {
  mission_id: string;
  progress: number;
  completed: boolean;
}

export default function DailyMissions({ user }: { user: User }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMissions();
  }, [user]);

  const loadMissions = async () => {
    const { data: missionsData } = await supabase
      .from("daily_missions")
      .select("*");

    const { data: userMissionsData } = await supabase
      .from("user_daily_missions")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", new Date().toISOString().split("T")[0]);

    if (missionsData) setMissions(missionsData);
    if (userMissionsData) setUserMissions(userMissionsData);
  };

  const claimReward = async (mission: Mission, userMission: UserMission) => {
    try {
      // Update mission as completed
      const { error: missionError } = await supabase
        .from("user_daily_missions")
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("mission_id", mission.id);

      if (missionError) throw missionError;

      // Get current profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_coins, experience_points")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // Update coins and XP
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          total_coins: profile.total_coins + mission.coins_reward,
          experience_points:
            profile.experience_points + mission.xp_reward,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "¡Misión Completada! 🎉",
        description: `+${mission.coins_reward} LuckCoins, +${mission.xp_reward} XP`,
      });

      loadMissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case "sunrise":
        return <Sunrise className="w-8 h-8" />;
      case "target":
        return <Target className="w-8 h-8" />;
      case "piggy-bank":
        return <Coins className="w-8 h-8" />;
      case "trophy":
        return <Trophy className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-fredoka mb-2">
          Misiones Diarias
        </h1>
        <p className="text-muted-foreground">
          ¡Completa las misiones y gana recompensas increíbles!
        </p>
      </div>

      <div className="grid gap-4">
        {missions.map((mission) => {
          const userMission = userMissions.find(
            (um) => um.mission_id === mission.id
          );
          const progress = userMission
            ? (userMission.progress / mission.target_value) * 100
            : 0;
          const isCompleted = userMission?.completed || false;

          return (
            <Card
              key={mission.id}
              className={`p-6 transition-all ${
                isCompleted ? "bg-accent/20" : "hover:shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-gradient-to-br from-primary to-purple-600 text-white"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    getIcon(mission.icon)
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{mission.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mission.description}
                  </p>

                  {!isCompleted && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>
                          {userMission?.progress || 0} / {mission.target_value}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-secondary font-semibold">
                      <Coins className="w-4 h-4" />+{mission.coins_reward}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <Zap className="w-4 h-4" />+{mission.xp_reward} XP
                    </span>
                  </div>
                </div>

                {userMission && progress >= 100 && !isCompleted && (
                  <Button
                    onClick={() => claimReward(mission, userMission)}
                    className="bg-gradient-to-r from-accent to-green-500"
                  >
                    Reclamar
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
