-- Add new columns to profiles for extended features
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_activity_date DATE,
ADD COLUMN IF NOT EXISTS selected_avatar TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS favorite_color TEXT DEFAULT 'purple';

-- Create daily_missions table
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  coins_reward INTEGER NOT NULL DEFAULT 25,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily missions"
  ON public.daily_missions FOR SELECT
  USING (true);

-- Create user_daily_missions table
CREATE TABLE IF NOT EXISTS public.user_daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.daily_missions(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  UNIQUE(user_id, mission_id, date)
);

ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily missions"
  ON public.user_daily_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily missions"
  ON public.user_daily_missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily missions"
  ON public.user_daily_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create stats_history table for tracking daily stats
CREATE TABLE IF NOT EXISTS public.stats_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  lessons_completed INTEGER DEFAULT 0 NOT NULL,
  coins_earned INTEGER DEFAULT 0 NOT NULL,
  xp_earned INTEGER DEFAULT 0 NOT NULL,
  missions_completed INTEGER DEFAULT 0 NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.stats_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats history"
  ON public.stats_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats history"
  ON public.stats_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats history"
  ON public.stats_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert daily missions
INSERT INTO public.daily_missions (title, description, mission_type, target_value, coins_reward, xp_reward, icon) VALUES
('Estudiante Tempranero', 'Completa una lección antes del mediodía', 'lesson_before_noon', 1, 30, 60, 'sunrise'),
('Maestro Diario', 'Completa 3 lecciones hoy', 'complete_lessons', 3, 50, 100, 'target'),
('Ahorrador Activo', 'Gana 50 monedas hoy', 'earn_coins', 50, 40, 80, 'piggy-bank'),
('Coleccionista', 'Desbloquea un nuevo logro', 'unlock_achievement', 1, 60, 120, 'trophy')
ON CONFLICT DO NOTHING;

-- Add more lessons with better content
INSERT INTO public.lessons (title, description, content, category, difficulty, coins_reward, order_index) VALUES
('El Poder del Interés Compuesto', 'Descubre cómo tu dinero puede crecer con el tiempo', '{"intro": "El interés compuesto es cuando ganas dinero sobre el dinero que ya ganaste. ¡Es magia financiera!", "example": "Si ahorras $100 y ganas 10% cada año, tendrás $110 el primer año, $121 el segundo año, ¡y así crece!", "quiz": [{"question": "¿Qué es el interés compuesto?", "options": ["Ganar dinero sobre tus ganancias", "Gastar todo el dinero", "Guardar dinero sin ganar nada"], "correct": 0}]}', 'inversion', 'intermediate', 30, 5),
('Presupuesto Personal', 'Aprende a planificar tus gastos', '{"intro": "Un presupuesto es un plan de cómo vas a usar tu dinero. Te ayuda a no gastar de más.", "example": "Si recibes $20 de mesada, puedes planear: $10 ahorrar, $7 gastar, $3 donar.", "quiz": [{"question": "¿Para qué sirve un presupuesto?", "options": ["Planear mis gastos", "Gastar sin pensar", "No usar dinero"], "correct": 0}]}', 'ahorro', 'intermediate', 35, 6),
('Donaciones y Generosidad', 'El valor de compartir con otros', '{"intro": "Donar es compartir parte de tu dinero para ayudar a otros. ¡Es importante ser generoso!", "example": "Puedes donar juguetes que ya no uses o dar monedas a causas benéficas.", "quiz": [{"question": "¿Por qué es bueno donar?", "options": ["Ayudamos a otros", "Perdemos dinero sin razón", "Es obligatorio"], "correct": 0}]}', 'valores', 'beginner', 25, 7),
('Inversión para Principiantes', 'Qué significa invertir tu dinero', '{"intro": "Invertir es usar tu dinero para ganar más dinero en el futuro. Como plantar una semilla para tener un árbol.", "example": "Puedes invertir en un negocio pequeño, en acciones de empresas, o en tu educación.", "quiz": [{"question": "¿Qué es invertir?", "options": ["Usar dinero para ganar más después", "Gastar en dulces", "Guardar debajo del colchón"], "correct": 0}]}', 'inversion', 'advanced', 40, 8)
ON CONFLICT DO NOTHING;

-- Add more achievements
INSERT INTO public.achievements (title, description, badge_icon, requirement_type, requirement_value, coins_reward) VALUES
('Racha de Fuego', 'Mantén una racha de 7 días', 'fire', 'streak_days', 7, 150),
('Rey de las Monedas', 'Acumula 500 FinCoins', 'crown', 'total_coins', 500, 100),
('Inversor Junior', 'Completa todas las lecciones de inversión', 'briefcase', 'category_complete', 1, 200),
('Nivel 5 Alcanzado', 'Sube al nivel 5', 'star', 'reach_level', 5, 250)
ON CONFLICT DO NOTHING;

-- Add more store items
INSERT INTO public.rewards_store (title, description, cost_coins, category, image_url) VALUES
('Avatar: Pirata', 'Avatar de pirata aventurero', 75, 'avatar', NULL),
('Avatar: Mago', 'Avatar de mago sabio', 75, 'avatar', NULL),
('Avatar: Robot', 'Avatar de robot futurista', 100, 'avatar', NULL),
('Tema: Oscuro', 'Desbloquea el tema oscuro', 150, 'tema', NULL),
('Tema: Arcoíris', 'Desbloquea colores arcoíris', 200, 'tema', NULL),
('Multiplicador 3x', 'Triple XP por 48 horas', 300, 'bono', NULL),
('Figura: Dragón', '20% descuento en figura de dragón', 175, 'descuento', NULL),
('Pack de Stickers', 'Stickers especiales para tu perfil', 50, 'cosmético', NULL)
ON CONFLICT DO NOTHING;