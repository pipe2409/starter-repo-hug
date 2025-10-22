import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthPage } from "@/components/AuthPage";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import DailyMissions from "./pages/DailyMissions";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./components/Dashboard";
import coinsImage from "@/assets/coins.png";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-purple-50 to-blue-50">
        <div className="text-2xl font-bold font-fredoka animate-pulse">
          Cargando LuckCash...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthPage />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
              <AppSidebar
                onSignOut={handleSignOut}
                streak={profile?.current_streak || 0}
              />

              <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-16 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex items-center px-4 md:px-6">
                  <SidebarTrigger className="mr-4" />
                  <div className="flex-1" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-orange-400/20 px-4 py-2 rounded-full">
                      <img src={coinsImage} alt="Coins" className="w-6 h-6" />
                      <span className="font-bold font-fredoka text-lg">
                        {profile?.total_coins || 0}
                      </span>
                    </div>
                  </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<HomePage user={user} />} />
                    <Route path="/lessons" element={<Dashboard user={user} />} />
                    <Route
                      path="/missions"
                      element={<DailyMissions user={user} />}
                    />
                    <Route
                      path="/achievements"
                      element={<Dashboard user={user} />}
                    />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route
                      path="/store"
                      element={<Dashboard user={user} />}
                    />
                    <Route path="/profile" element={<Profile user={user} />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
