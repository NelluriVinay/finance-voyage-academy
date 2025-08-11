import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Membership = () => {
  return (
    <>
      <SEO
        title="Membership & Pricing | Finance Voyage Academy"
        description="Choose between Free access and Premium membership for advanced courses and live sessions."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Membership & Pricing</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="mb-6 list-disc pl-5 text-muted-foreground">
                <li>Introductory courses</li>
                <li>Selected community access</li>
                <li>Limited articles</li>
              </ul>
              <Button variant="outline">Get started</Button>
            </CardContent>
          </Card>

          <Card className="border-accent">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="mb-6 list-disc pl-5 text-muted-foreground">
                <li>All courses & premium articles</li>
                <li>Weekly live webinars</li>
                <li>Priority community support</li>
              </ul>
              <Button variant="premium">Go Premium</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Membership;
