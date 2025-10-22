import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Save, Sparkles } from "lucide-react";
import mascotImage from "@/assets/mascot-transparent.png";

interface Profile {
  display_name: string;
  bio: string | null;
  total_coins: number;
  level: number;
  experience_points: number;
  current_streak: number;
  longest_streak: number;
  selected_avatar: string;
  favorite_color: string;
}

const avatars = ["default", "superhero", "astronaut", "pirate", "wizard", "robot"];
const colors = ["purple", "blue", "green", "orange", "pink", "red"];

export default function Profile({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) setProfile(data);
  };

  const saveProfile = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        bio: profile.bio,
        selected_avatar: profile.selected_avatar,
        favorite_color: profile.favorite_color,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Perfil actualizado ✨" });
      setIsEditing(false);
    }
  };

  if (!profile) return <div className="p-8">Cargando...</div>;

  const xpForNextLevel = profile.level * 100;
  const xpProgress = (profile.experience_points / xpForNextLevel) * 100;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto font-poppins">
      <h1 className="text-3xl font-bold mb-6 font-fredoka">Mi Perfil</h1>

      {/* Header Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={mascotImage}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <Input
                value={profile.display_name}
                onChange={(e) =>
                  setProfile({ ...profile, display_name: e.target.value })
                }
                className="text-2xl font-bold bg-white/20 border-white/40 text-white mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold mb-2">{profile.display_name}</h2>
            )}
            <p className="opacity-90">Nivel {profile.level} · {profile.total_coins} LuckCoins</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Progreso al Nivel {profile.level + 1}</span>
                <span>{profile.experience_points} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-primary">{profile.current_streak}</p>
          <p className="text-sm text-muted-foreground">Racha Actual</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{profile.longest_streak}</p>
          <p className="text-sm text-muted-foreground">Mejor Racha</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-accent">{profile.total_coins}</p>
          <p className="text-sm text-muted-foreground">LuckCoins</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-secondary">{profile.level}</p>
          <p className="text-sm text-muted-foreground">Nivel</p>
        </Card>
      </div>

      {/* Bio Section */}
      <Card className="p-6 mb-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Sobre mí
        </h3>
        {isEditing ? (
          <Textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Cuéntanos sobre ti..."
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-muted-foreground">
            {profile.bio || "Aún no has escrito nada sobre ti."}
          </p>
        )}
      </Card>

      {/* Customization */}
      <Card className="p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Personalización</h3>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Avatar Favorito</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() =>
                  isEditing && setProfile({ ...profile, selected_avatar: avatar })
                }
                disabled={!isEditing}
                className={`p-3 rounded-lg border-2 transition-all capitalize ${
                  profile.selected_avatar === avatar
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                } ${!isEditing && "opacity-50"}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Color Favorito</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() =>
                  isEditing && setProfile({ ...profile, favorite_color: color })
                }
                disabled={!isEditing}
                className={`w-12 h-12 rounded-full transition-all ${
                  profile.favorite_color === color
                    ? "ring-4 ring-primary scale-110"
                    : "hover:scale-105"
                } ${!isEditing && "opacity-50"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <Button onClick={saveProfile} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                loadProfile();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="flex-1">
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
}
