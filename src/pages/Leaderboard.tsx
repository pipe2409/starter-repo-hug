import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Crown, Flame } from "lucide-react";
import trophiesImage from "@/assets/trophies.png";

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  total_coins: number;
  level: number;
  current_streak: number;
}

export default function Leaderboard() {
  const [topCoins, setTopCoins] = useState<LeaderboardUser[]>([]);
  const [topStreaks, setTopStreaks] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    // Top by coins
    const { data: coinsData } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_coins, level, current_streak")
      .order("total_coins", { ascending: false })
      .limit(10);
    if (coinsData) setTopCoins(coinsData);

    // Top by streaks
    const { data: streaksData } = await supabase
      .from("profiles")
      .select("user_id, display_name, total_coins, level, current_streak")
      .order("current_streak", { ascending: false })
      .limit(10);
    if (streaksData) setTopStreaks(streaksData);
  };

  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (index === 1)
      return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (index === 2)
      return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
    return <span className="w-6 h-6 text-center font-bold">#{index + 1}</span>;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-poppins">
      <div className="text-center mb-8">
        <img
          src={trophiesImage}
          alt="Trophies"
          className="w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold font-fredoka bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Tabla de Líderes
        </h1>
        <p className="text-muted-foreground mt-2">
          ¡Compite con otros estudiantes!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top LuckCoins */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-bold">Top LuckCoins</h2>
          </div>
          <div className="space-y-3">
            {topCoins.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index < 3
                    ? "bg-gradient-to-r from-primary/10 to-purple-500/10"
                    : "bg-muted/50"
                }`}
              >
                <div className="w-8">{getRankIcon(index)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{user.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Nivel {user.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary">{user.total_coins}</p>
                  <p className="text-xs text-muted-foreground">LuckCoins</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Rachas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold">Top Rachas</h2>
          </div>
          <div className="space-y-3">
            {topStreaks.map((user, index) => (
              <div
                key={user.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index < 3
                    ? "bg-gradient-to-r from-orange-500/10 to-red-500/10"
                    : "bg-muted/50"
                }`}
              >
                <div className="w-8">{getRankIcon(index)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{user.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Nivel {user.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">
                    {user.current_streak}
                  </p>
                  <p className="text-xs text-muted-foreground">días</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
