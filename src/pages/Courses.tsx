import SEO from "@/components/SEO";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TAGS = [
  "Investing",
  "Stock Market",
  "Personal Finance",
  "Crypto",
  "Banking",
  "Taxation",
];

const COURSES = [
  { title: "ETF Basics", tag: "Investing", author: "A. Sharma" },
  { title: "Options Primer", tag: "Stock Market", author: "S. Patel" },
  { title: "Debt-Free Blueprint", tag: "Personal Finance", author: "K. Rao" },
  { title: "Crypto Wallets 101", tag: "Crypto", author: "V. Iyer" },
  { title: "Retail Banking Explained", tag: "Banking", author: "N. Gupta" },
  { title: "Tax Planning FY25", tag: "Taxation", author: "M. Nair" },
];

const Courses = () => {
  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? COURSES : COURSES.filter((c) => c.tag === active);

  return (
    <>
      <SEO
        title="Financial Courses & Resources | Finance Voyage Academy"
        description="Explore curated finance courses covering investing, markets, crypto, banking, and taxation."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Financial Courses & Resources</h1>
        <div className="mb-6 flex flex-wrap gap-2">
          {(["All", ...TAGS] as const).map((tag) => (
            <Button
              key={tag}
              variant={active === tag ? "premium" : "outline"}
              onClick={() => setActive(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.title} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Topic: {c.tag}</p>
                <p>By {c.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default Courses;
