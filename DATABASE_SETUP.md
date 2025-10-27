# Configuración de Base de Datos para Panel de Admin

Para que el panel de administración funcione correctamente, necesitas ejecutar los siguientes comandos SQL en tu base de datos de Supabase.

## Paso 1: Agregar el campo subscription_plan a la tabla profiles

```sql
-- Add subscription_plan column to profiles
ALTER TABLE public.profiles 
ADD COLUMN subscription_plan text DEFAULT 'gratuito' 
CHECK (subscription_plan IN ('gratuito', 'basico', 'premium'));
```

## Paso 2: Crear sistema de roles (Opcional pero Recomendado)

Este sistema es opcional para la funcionalidad básica, pero recomendado para seguridad:

```sql
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles RLS policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

## Paso 3: Asignar rol de admin a tu usuario

Después de crear el sistema de roles, asigna el rol de admin a tu usuario:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

Para encontrar tu user_id, puedes ejecutar:
```sql
SELECT id, email FROM auth.users;
```

## Cómo ejecutar estos comandos

1. Ve a tu proyecto en Supabase
2. Haz clic en "SQL Editor" en el menú lateral
3. Copia y pega cada bloque de SQL
4. Haz clic en "Run" para ejecutar

## Notas Importantes

- **subscription_plan**: Este campo es necesario para que funcione la selección de planes
- **Sistema de roles**: Por ahora la página de admin está accesible para todos los usuarios. Una vez que implementes el sistema de roles, solo los usuarios con rol 'admin' podrán acceder
- **Seguridad**: Asegúrate de asignar el rol de admin solo a usuarios de confianza
