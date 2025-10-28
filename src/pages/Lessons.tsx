import { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";

// Lessons component disabled - tables not configured
export default function Lessons({ user }: { user: User }) {
  return <Navigate to="/" replace />;
}
