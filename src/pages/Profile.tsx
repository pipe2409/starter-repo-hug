import { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";

// Profile component disabled - tables not configured
export default function Profile({ user }: { user: User }) {
  return <Navigate to="/" replace />;
}
