import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Props { children: ReactNode }

const ProtectedRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only sync state here; do not call Supabase queries
      if (!session) {
        toast({ title: "Please log in", description: "You need to sign in to continue." });
        navigate(`/auth?mode=login`, { replace: true, state: { from: location } });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({ title: "Please log in", description: "You need to sign in to continue." });
        navigate(`/auth?mode=login`, { replace: true, state: { from: location } });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location, toast]);

  if (loading) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
