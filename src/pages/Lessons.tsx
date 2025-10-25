import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle2, Coins } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  coins_reward: number;
}

interface LessonsProps {
  user: User;
}

export default function Lessons({ user }: LessonsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLessons();
  }, [user.id]);

  const loadLessons = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: true });

      if (lessonsError) throw lessonsError;

      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (progressError) throw progressError;

      setLessons(lessonsData || []);
      setCompletedLessons(progressData?.map((p) => p.lesson_id) || []);
    } catch (error) {
      console.error("Error loading lessons:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las lecciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId: string, coinsReward: number) => {
    try {
      const { error: progressError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
        });

      if (progressError) throw progressError;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("total_coins")
        .eq("user_id", user.id)
        .single();

      const newTotal = (profileData?.total_coins || 0) + coinsReward;

      const { error: coinsError } = await supabase
        .from("profiles")
        .update({ total_coins: newTotal })
        .eq("user_id", user.id);

      if (coinsError) throw coinsError;

      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "¡Lección completada!",
        description: `Has ganado ${coinsReward} monedas`,
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast({
        title: "Error",
        description: "No se pudo completar la lección",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando lecciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-fredoka bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
          Lecciones
        </h1>
        <p className="text-muted-foreground">
          Completa lecciones para ganar monedas y mejorar tus habilidades financieras
        </p>
      </div>

      <div className="grid gap-4">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          return (
            <Card
              key={lesson.id}
              className={`p-6 transition-all hover:shadow-lg ${
                isCompleted ? "bg-muted/50 border-success" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isCompleted ? "bg-success/20" : "bg-primary/20"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-primary" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {lesson.title}
                      </h3>
                      <Badge variant="secondary" className="mb-2">
                        {lesson.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Coins className="w-5 h-5" />
                      <span>+{lesson.coins_reward}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {lesson.description}
                  </p>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-success font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      Completada
                    </div>
                  ) : (
                    <Button
                      onClick={() => completeLesson(lesson.id, lesson.coins_reward)}
                    >
                      Completar Lección
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
