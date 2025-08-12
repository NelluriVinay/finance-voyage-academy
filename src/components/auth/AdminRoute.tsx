import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Props { children: ReactNode }

const AdminRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only sync state here; defer queries
      if (!session?.user) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setTimeout(async () => {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user!.id)
          .eq("role", "admin")
          .maybeSingle();

        if (data?.role === "admin") {
          setLoading(false);
        } else {
          toast({ title: "Admin access required", variant: "destructive" });
          navigate("/admin/login", { replace: true });
        }
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (data?.role === "admin") {
        setLoading(false);
      } else {
        toast({ title: "Admin access required", variant: "destructive" });
        navigate("/admin/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (loading) return null;
  return <>{children}</>;
};

export default AdminRoute;
