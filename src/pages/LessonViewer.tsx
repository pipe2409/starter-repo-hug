import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface LessonViewerProps {
  user: User;
}

export default function LessonViewer({ user }: LessonViewerProps) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", lessonId, user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const completeLesson = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_lesson_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId!,
          progress: 100,
          completed: true,
          last_accessed: new Date().toISOString(),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["user-lesson-progress"] });
      toast.success("¡Lección completada! 🎉", {
        description: "Has ganado 50 monedas",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "intermediate": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "advanced": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
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

  if (lessonLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Lección no encontrada</p>
            <Button onClick={() => navigate("/lessons")} className="mt-4 mx-auto block">
              Volver a Lecciones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = progress?.completed || false;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/lessons")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* Lesson Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-3">{lesson.title}</CardTitle>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>
            {isCompleted && (
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Completada
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
              {getDifficultyLabel(lesson.difficulty)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration_minutes} min
            </Badge>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {lesson.category}
            </Badge>
          </div>

          {progress && !isCompleted && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      {!isCompleted && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={() => completeLesson.mutate()}
              disabled={completeLesson.isPending}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              {completeLesson.isPending ? "Completando..." : "Marcar como Completada"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Gana 50 monedas al completar esta lección
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
