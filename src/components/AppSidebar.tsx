import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Trophy,
  Store,
  User,
  TrendingUp,
  Target,
  LogOut,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import mascotImage from "@/assets/mascot-transparent.png";

const navItems = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Lecciones", url: "/lessons", icon: BookOpen },
  { title: "Misiones Diarias", url: "/missions", icon: Target },
  { title: "Logros", url: "/achievements", icon: Trophy },
  { title: "Mi Perfil", url: "/profile", icon: User },
];

interface AppSidebarProps {
  onSignOut: () => void;
  streak: number;
}

export function AppSidebar({ onSignOut, streak }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all font-poppins`}
      collapsible="icon"
    >
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
        <img
          src={mascotImage}
          alt="LuckCash"
          className={`${collapsed ? "w-10 h-10" : "w-16 h-16"} transition-all`}
        />
        {!collapsed && (
          <div className="ml-3">
            <h1 className="text-2xl font-bold font-fredoka bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              LuckCash
            </h1>
          </div>
        )}
      </div>

      {streak > 0 && !collapsed && (
        <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white mx-2 my-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 animate-pulse" />
            <div>
              <p className="text-xs opacity-90">Racha Actual</p>
              <p className="text-lg font-bold">{streak} días 🔥</p>
            </div>
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="p-4 mt-auto border-t border-sidebar-border">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 w-full p-2 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
