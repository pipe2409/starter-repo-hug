import { User } from "@supabase/supabase-js";
import { Navigate } from "react-router-dom";

// Dashboard component disabled - tables not configured
export const Dashboard = ({ user }: { user: User }) => {
  return <Navigate to="/" replace />;
};
