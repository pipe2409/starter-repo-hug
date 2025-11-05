import { User } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  order_index: number;
  duration_minutes: number;
}

interface UserProgress {
  id: string;
  lesson_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
}

export default function Lessons({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data as Lesson[];
    },
  });

  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["user-lesson-progress", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data as UserProgress[];
    },
  });

  const startLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const existingProgress = userProgress?.find((p) => p.lesson_id === lessonId);
      
      if (existingProgress) {
        const { error } = await supabase
          .from("user_lesson_progress")
          .update({ 
            progress: Math.min(existingProgress.progress + 25, 100),
            completed: existingProgress.progress + 25 >= 100,
            last_accessed: new Date().toISOString()
          })
          .eq("id", existingProgress.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_lesson_progress")
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            progress: 25,
            completed: false,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-lesson-progress"] });
      toast({
        title: "¡Progreso actualizado!",
        description: "Has avanzado en la lección.",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "intermediate": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "advanced": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Principiante";
      case "intermediate": return "Intermedio";
      case "advanced": return "Avanzado";
      default: return difficulty;
    }
  };

  const getProgress = (lessonId: string) => {
    return userProgress?.find((p) => p.lesson_id === lessonId)?.progress || 0;
  };

  const isCompleted = (lessonId: string) => {
    return userProgress?.find((p) => p.lesson_id === lessonId)?.completed || false;
  };

  if (lessonsLoading || progressLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-fredoka bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Lecciones de Educación Financiera
          </h1>
          <p className="text-muted-foreground mt-2 font-poppins">
            Aprende sobre finanzas de manera divertida y práctica
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons?.map((lesson) => {
          const progress = getProgress(lesson.id);
          const completed = isCompleted(lesson.id);
          
          return (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                    {getDifficultyLabel(lesson.difficulty)}
                  </Badge>
                  {completed && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <CardTitle className="font-fredoka flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {lesson.title}
                </CardTitle>
                <CardDescription className="font-poppins">
                  {lesson.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration_minutes} minutos</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Button
                  onClick={() => startLessonMutation.mutate(lesson.id)}
                  disabled={startLessonMutation.isPending}
                  className="w-full"
                  variant={completed ? "secondary" : "default"}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {completed ? "Repasar" : progress > 0 ? "Continuar" : "Comenzar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
