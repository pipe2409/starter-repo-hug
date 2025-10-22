-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_coins INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  coins_reward INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  USING (true);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  coins_reward INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create rewards_store table
CREATE TABLE public.rewards_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cost_coins INTEGER NOT NULL,
  stock INTEGER,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.rewards_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view store items"
  ON public.rewards_store FOR SELECT
  USING (true);

-- Create user_purchases table
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards_store(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  redeemed BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases"
  ON public.user_purchases FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample lessons
INSERT INTO public.lessons (title, description, content, category, difficulty, coins_reward, order_index) VALUES
('¿Qué es el dinero?', 'Aprende qué es el dinero y para qué sirve', '{"intro": "El dinero es algo que usamos para comprar cosas que necesitamos o queremos.", "quiz": [{"question": "¿Para qué usamos el dinero?", "options": ["Para comprar cosas", "Para jugar", "Para dormir"], "correct": 0}]}', 'basico', 'beginner', 10, 1),
('Ahorro vs. Gasto', 'Descubre la diferencia entre ahorrar y gastar', '{"intro": "Ahorrar es guardar dinero para el futuro. Gastar es usar el dinero ahora.", "quiz": [{"question": "¿Qué es ahorrar?", "options": ["Guardar dinero", "Gastar todo", "Regalar dinero"], "correct": 0}]}', 'ahorro', 'beginner', 15, 2),
('Necesidades vs. Deseos', 'Aprende a diferenciar lo que necesitas de lo que quieres', '{"intro": "Las necesidades son cosas que debemos tener, como comida. Los deseos son cosas que queremos, como juguetes.", "quiz": [{"question": "¿Cuál es una necesidad?", "options": ["Comida", "Videojuego", "Dulces"], "correct": 0}]}', 'basico', 'beginner', 20, 3),
('Mi primera meta de ahorro', 'Establece tu primera meta financiera', '{"intro": "Una meta de ahorro es algo que quieres comprar en el futuro. ¡Ahorra poco a poco!", "quiz": [{"question": "¿Qué es una meta de ahorro?", "options": ["Algo que quiero comprar ahorrando", "Gastar todo ya", "No ahorrar nada"], "correct": 0}]}', 'ahorro', 'intermediate', 25, 4);

-- Insert sample achievements
INSERT INTO public.achievements (title, description, badge_icon, requirement_type, requirement_value, coins_reward) VALUES
('Primer Paso', '¡Completaste tu primera lección!', 'star', 'lessons_completed', 1, 50),
('Estudiante Dedicado', 'Completaste 5 lecciones', 'trophy', 'lessons_completed', 5, 100),
('Maestro del Ahorro', 'Completaste 10 lecciones', 'medal', 'lessons_completed', 10, 200),
('Coleccionista', 'Ganaste 100 FinCoins', 'coins', 'total_coins', 100, 75);

-- Insert sample store items
INSERT INTO public.rewards_store (title, description, cost_coins, category) VALUES
('Avatar: Superhéroe', 'Un avatar de superhéroe para tu perfil', 50, 'avatar'),
('Avatar: Astronauta', 'Un avatar de astronauta espacial', 50, 'avatar'),
('Figura: Unicornio', '10% descuento en figura de unicornio', 100, 'descuento'),
('Figura: Dinosaurio', '15% descuento en figura de dinosaurio', 150, 'descuento'),
('Bono: Doble XP', 'Duplica tus monedas por 24 horas', 200, 'bono');