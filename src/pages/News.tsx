import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NEWS = [
  { title: "Markets close higher on banking stocks", author: "Newswire" },
  { title: "RBI policy highlights: inflation outlook steady", author: "Newswire" },
  { title: "Global crypto market cap rises 2.1%", author: "Newswire" },
];

const News = () => {
  return (
    <>
      <SEO
        title="News & Insights | Finance Voyage Academy"
        description="Daily financial news, stock market updates, and expert insights to keep you informed."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">News & Insights</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((n) => (
            <Card key={n.title} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle>{n.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">By {n.author}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default News;
