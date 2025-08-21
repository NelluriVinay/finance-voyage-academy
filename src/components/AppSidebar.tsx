import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Video,
  Play,
  BarChart3,
  Newspaper,
  Users,
  Crown,
  User,
  Shield,
  LogOut
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Videos", url: "/videos", icon: Play },
  { title: "Live Sessions", url: "/live", icon: Video },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "News", url: "/news", icon: Newspaper },
  { title: "Community", url: "/community", icon: Users },
];

const membershipItems = [
  { title: "Membership", url: "/membership", icon: Crown },
];

const authItems = [
  { title: "Login", url: "/auth", icon: User },
  { title: "Admin", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    cn(
      "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
      active 
        ? "bg-finance-gradient text-white font-medium hover:opacity-90" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    );

  return (
    <Sidebar className={cn("transition-all duration-300", isCollapsed ? "w-14" : "w-64")} collapsible="icon">
      <SidebarContent className="bg-background border-r border-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-finance-gradient flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary-blue">WealthWise</h2>
                <p className="text-xs text-muted-foreground">Academy</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-finance-gradient flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Membership Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Premium
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {membershipItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 text-gold" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{item.title}</span>
                          <Badge className="bg-gold text-gold-foreground text-xs">
                            Pro
                          </Badge>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {authItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}