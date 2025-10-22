# 💰 LuckCash - Plataforma Educativa Gamificada de Educación Financiera

**v1.0 FINAL | La mejor app para aprender finanzas jugando**

---

## 🎯 Propuesta de Valor Única (UVP)

**LuckCash** es la plataforma educativa gamificada más completa para enseñar educación financiera a niños.  
Incluye misiones diarias, rankings, rachas, logros, tienda de recompensas y perfil personalizable.  
Todo diseñado para convertir el aprendizaje financiero en una experiencia atractiva, divertida y significativa.  

---

## 🕹️ Características Implementadas

### 🎮 Sistema de Gamificación Completo
- 💰 **LuckCoins**: moneda virtual ganada al completar actividades.  
- ⭐ **Niveles y XP**: progresión basada en experiencia.  
- 🔥 **Rachas diarias**: recompensas por constancia.  
- 🏆 **Logros desbloqueables**: más de 8 logros con recompensas.  
- 🥇 **Ranking global**: competencia entre estudiantes.  
- 📅 **Misiones diarias**: 4 misiones que se renuevan cada día.  
- 🛍️ **Tienda de recompensas**: más de 13 artículos disponibles.  

---

## 📘 Contenido Educativo

### 8 Lecciones Completas:
1. ¿Qué es el dinero?  
2. Ahorro vs. Gasto  
3. Necesidades vs. Deseos  
4. Mi primera meta de ahorro  
5. El poder del interés compuesto  
6. Presupuesto personal  
7. Donaciones y generosidad  
8. Inversión para principiantes  

---

## 🚀 Misiones Diarias

| Misión | Recompensa |
|--------|-------------|
| Estudiante Tempranero | 30 coins, 60 XP |
| Maestro Diario (3 lecciones) | 50 coins, 100 XP |
| Ahorrador Activo (50 coins) | 40 coins, 80 XP |
| Coleccionista (desbloquear logro) | 60 coins, 120 XP |

---

## 🏅 Sistema de Logros

| Logro | Recompensa |
|--------|-------------|
| Primer Paso (1 lección) | +50 coins |
| Estudiante Dedicado (5 lecciones) | +100 coins |
| Maestro del Ahorro (10 lecciones) | +200 coins |
| Coleccionista (100 coins ganados) | +75 coins |
| Racha de Fuego (7 días consecutivos) | +150 coins |
| Rey de las Monedas (500 coins) | +100 coins |
| Inversor Junior (lecciones de inversión) | +200 coins |
| Nivel 5 alcanzado | +250 coins |

---

## 🛒 Tienda de Recompensas

**Avatares**
- Superhéroe, Astronauta (50 coins)
- Pirata, Mago (75 coins)
- Robot (100 coins)

**Descuentos Reales**
- Unicornio (100 coins), Dinosaurio (150 coins), Dragón (175 coins)

**Bonos Especiales**
- Doble XP 24h (200 coins)
- Triple XP 48h (300 coins)

**Temas y Cosméticos**
- Tema Oscuro (150 coins)
- Tema Arcoíris (200 coins)
- Pack de Stickers (50 coins)

---

## 👤 Perfil Personalizable

- Avatar seleccionable (6 opciones)  
- Color favorito personalizable  
- Biografía editable  
- Estadísticas completas (racha, nivel, coins, XP)  
- Barra de progreso visual  
- Historial de actividades  

---

## 🏆 Ranking y Competencia

- **Top LuckCoins**: los 10 usuarios con más monedas.  
- **Top Rachas**: los 10 usuarios más constantes.  
- **Medallas**: Oro 🥇, Plata 🥈, Bronce 🥉  
- Actualización en tiempo real.  

---

## 📊 Estadísticas Avanzadas

- Progreso diario  
- Lecciones completadas  
- Misiones completadas  
- Coins ganados  
- XP total  
- Logros desbloqueados  
- Gráficos visuales  

---

## 🎨 Diseño y UX

- **Fuentes:** Fredoka (títulos), Poppins (texto)  
- **Colores principales:** morado, dorado, naranja, verde  
- **Animaciones:** float, bounce, glow, wiggle  
- **Interfaz:** gradientes, mascota ilustrativa, responsive total  
- **Navegación:** sidebar con 7 secciones (Inicio, Lecciones, Misiones, Logros, Ranking, Tienda, Perfil)

---

## ⚙️ Stack Tecnológico

### 🧩 Frontend
- React 18 + TypeScript  
- Vite  
- Tailwind CSS  
- shadcn/ui  
- Lucide React  
- Google Fonts (Fredoka, Poppins)

### 🗄️ Backend
- Supabase  
- PostgreSQL  
- Row Level Security (RLS)  
- Auth (email/password)  
- Real-time enabled  

---

## 🧱 Base de Datos (11 Tablas)

| Tabla | Descripción |
|--------|-------------|
| `profiles` | Perfil completo del usuario |
| `lessons` | 8 lecciones educativas |
| `user_progress` | Progreso por lección |
| `achievements` | Logros disponibles |
| `user_achievements` | Logros desbloqueados |
| `rewards_store` | Items de tienda |
| `user_purchases` | Compras realizadas |
| `daily_missions` | Misiones diarias |
| `user_daily_missions` | Progreso de misiones |
| `stats_history` | Historial diario de estadísticas |

---

## 📈 KPIs Instrumentados

- ✅ Lecciones completadas (`user_progress`)  
- 💰 LuckCoins ganados (`profiles.total_coins`)  
- 🛍️ Canjes realizados (`user_purchases`)  
- 🎯 Misiones completadas (`user_daily_missions`)  
- 🔥 Racha actual (`profiles.current_streak`)  
- ⭐ Experiencia ganada (`profiles.experience_points`)  
- 🏆 Logros desbloqueados (`user_achievements`)  

---

## 💻 Instalación

```bash
git clone <repo>
cd luckcash
npm install
npm run dev
