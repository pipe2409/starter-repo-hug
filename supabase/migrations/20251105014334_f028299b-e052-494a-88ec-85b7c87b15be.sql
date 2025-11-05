-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user lesson progress table
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  last_accessed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Lessons policies (public read for all authenticated users)
CREATE POLICY "Anyone can view lessons"
ON public.lessons
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert lessons"
ON public.lessons
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update lessons"
ON public.lessons
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete lessons"
ON public.lessons
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- User progress policies
CREATE POLICY "Users can view their own progress"
ON public.user_lesson_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_lesson_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_lesson_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_lesson_progress_updated_at
BEFORE UPDATE ON public.user_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample financial education lessons
INSERT INTO public.lessons (title, description, content, category, difficulty, order_index, duration_minutes) VALUES
('¿Qué es el Dinero?', 'Aprende los conceptos básicos sobre el dinero y su importancia en nuestra vida diaria.', 'El dinero es un medio de intercambio que utilizamos para comprar bienes y servicios. Históricamente, el dinero ha evolucionado desde el trueque hasta las monedas digitales de hoy.', 'Conceptos Básicos', 'beginner', 1, 10),
('Ahorro: Tu Primera Meta', 'Descubre la importancia del ahorro y cómo empezar a ahorrar desde joven.', 'Ahorrar es guardar dinero para el futuro. Es importante tener metas de ahorro y crear un plan para alcanzarlas. Aprende sobre la regla del 50/30/20.', 'Ahorro', 'beginner', 2, 15),
('Presupuesto Personal', 'Aprende a crear y mantener un presupuesto personal efectivo.', 'Un presupuesto te ayuda a controlar tus gastos e ingresos. Aprende a categorizar gastos, identificar necesidades vs. deseos, y planificar tu futuro financiero.', 'Presupuesto', 'beginner', 3, 20),
('Conceptos de Inversión', 'Introducción al mundo de las inversiones y cómo hacer crecer tu dinero.', 'Las inversiones te permiten hacer crecer tu dinero a largo plazo. Conoce los diferentes tipos de inversiones: acciones, bonos, fondos de inversión y más.', 'Inversión', 'intermediate', 4, 25),
('Manejo de Deudas', 'Aprende a manejar deudas de manera responsable y evitar problemas financieros.', 'Las deudas pueden ser útiles si se manejan correctamente. Conoce la diferencia entre deuda buena y mala, y aprende estrategias para pagar deudas.', 'Deudas', 'intermediate', 5, 20),
('Planificación Financiera', 'Crea un plan financiero a largo plazo para alcanzar tus metas.', 'La planificación financiera te ayuda a establecer y alcanzar metas a corto, mediano y largo plazo. Aprende a crear tu plan financiero personal.', 'Planificación', 'advanced', 6, 30);