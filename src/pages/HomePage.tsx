import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

// HomePage component disabled - tables not configured
export default function HomePage({ user }: { user: User }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-2xl">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold font-fredoka">Bienvenido a LuckCash</h1>
          <p className="text-muted-foreground">
            El panel de administración está disponible para gestionar usuarios y planes.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Link to="/admin">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Panel de Admin
              </button>
            </Link>
            <Link to="/plans">
              <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Ver Planes
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
