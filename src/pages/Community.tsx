import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOPICS = [
  { title: "Is SIP better than lumpsum for beginners?", replies: 42 },
  { title: "How to read a balance sheet quickly", replies: 18 },
  { title: "Best tax-saving strategies before March", replies: 27 },
];

const Community = () => {
  return (
    <>
      <SEO
        title="Community Forum | Finance Voyage Academy"
        description="Discuss finance topics, ask questions, and learn from experts and peers."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Community Forum</h1>
        <div className="space-y-4">
          {TOPICS.map((t) => (
            <Card key={t.title} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{t.replies} replies</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default Community;
