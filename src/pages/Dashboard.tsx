import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logged out successfully" });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Your Dashboard | Finance Voyage Academy"
        description="Personalized finance learning: progress tracking, saved items, and enrolled courses."
      />
      <section className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-success/20 bg-success/5 p-6">
          <h2 className="mb-2 text-lg font-semibold text-success">You're all set!</h2>
          <p className="text-muted-foreground">
            Welcome to Finance Voyage Academy. Start exploring courses, connect with SEBI-certified experts, 
            and track your financial learning journey.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">You haven't enrolled in any courses yet.</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expert Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">No upcoming sessions scheduled.</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/live">Book Expert Session</a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">Start your financial education journey.</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/news">Read Latest Articles</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/courses">📚 Browse All Courses</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/live">👨‍💼 Find SEBI Experts</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/community">💬 Join Community</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/membership">⭐ Upgrade Membership</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Your learning activity will appear here once you start taking courses or booking sessions.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
