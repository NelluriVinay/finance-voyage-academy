import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SESSIONS = [
  { title: "Weekly Market Pulse", time: "Fri 6:00 PM", host: "R. Kapoor" },
  { title: "How to Analyse ETFs", time: "Sat 11:00 AM", host: "A. Sharma" },
  { title: "Crypto Risk Management", time: "Sun 5:00 PM", host: "V. Iyer" },
];

const Live = () => {
  return (
    <>
      <SEO
        title="Live Classes & Webinars | Finance Voyage Academy"
        description="Join live financial webinars and market analysis sessions with industry experts."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Live Classes & Webinars</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SESSIONS.map((s) => (
            <Card key={s.title} className="flex flex-col justify-between transition hover:shadow-lg">
              <div>
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Host: {s.host}</p>
                  <p>Time: {s.time}</p>
                </CardContent>
              </div>
              <div className="p-6 pt-0">
                <Button variant="hero" className="w-full">Join</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default Live;
