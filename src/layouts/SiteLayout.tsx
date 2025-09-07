import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Footer from "@/components/layout/Footer";
import FinanceChatbot from "@/components/FinanceChatbot";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SiteLayout = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setUserRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    setUserRoles(roles?.map(r => r.role) || []);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-primary-blue">WealthWise Academy</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Building Wealth for Middle Class India
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            <Outlet />
          </main>
          
          <Footer />
        </div>
        
        {/* Global Finance Chatbot */}
        <FinanceChatbot userRoles={userRoles} />
      </div>
    </SidebarProvider>
  );
};

export default SiteLayout;
