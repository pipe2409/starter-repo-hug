import { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";

// DailyMissions component disabled - tables not configured
export default function DailyMissions({ user }: { user: User }) {
  return <Navigate to="/" replace />;
}
