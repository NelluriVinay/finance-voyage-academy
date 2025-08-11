import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <>
      <SEO
        title="Your Dashboard | Finance Voyage Academy"
        description="Personalized finance learning: progress tracking, saved items, and enrolled courses."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Your Dashboard</h1>
        <div className="mb-6 rounded-lg border p-6">
          <p className="mb-3 text-muted-foreground">
            Sign in to unlock personalized recommendations and progress tracking.
          </p>
          <div className="flex gap-2">
            <Button variant="hero" asChild>
              <a href="/auth">Log in</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/auth?mode=signup">Create account</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Add interests to receive curated courses and articles.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saved Articles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">No saved items yet.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">You haven't enrolled in any courses.</CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
