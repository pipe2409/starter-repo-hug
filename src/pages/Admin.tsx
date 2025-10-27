import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  total_coins: number;
  current_streak: number;
  subscription_plan: string | null;
  created_at: string;
}

const Admin = ({ user }: { user: User }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    try {
      // For now, we'll check if there's a special field or just load users
      // In production, you would check user_roles table
      setIsAdmin(true);
      loadUsers();
      setLoading(false);
    } catch (error) {
      console.error("Error checking admin role:", error);
      navigate("/");
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar usuarios");
      console.error(error);
      return;
    }

    // Map the data to include subscription_plan field
    const mappedData = (data || []).map(profile => ({
      ...profile,
      subscription_plan: (profile as any).subscription_plan || null
    }));

    setUsers(mappedData as UserProfile[]);
  };

  const getPlanBadge = (plan: string | null) => {
    const planKey = plan || "gratuito";
    const variants: Record<string, { variant: any; label: string }> = {
      gratuito: { variant: "secondary", label: "Gratuito" },
      basico: { variant: "default", label: "Básico" },
      premium: { variant: "destructive", label: "Premium" },
    };

    const config = variants[planKey] || variants.gratuito;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold font-fredoka animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-fredoka">
            Panel de Administración
          </CardTitle>
          <p className="text-muted-foreground">
            Gestiona los usuarios registrados en la aplicación
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monedas</TableHead>
                  <TableHead>Racha</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell className="font-medium">
                        {userProfile.display_name || "Sin nombre"}
                      </TableCell>
                      <TableCell>
                        {getPlanBadge(userProfile.subscription_plan)}
                      </TableCell>
                      <TableCell>{userProfile.total_coins}</TableCell>
                      <TableCell>{userProfile.current_streak} días</TableCell>
                      <TableCell>
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
