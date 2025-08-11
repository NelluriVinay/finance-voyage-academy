import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import hero from "@/assets/hero-finance.jpg";
import { Search, TrendingUp, BookOpen, BarChart3, PiggyBank, Landmark, Coins, Receipt } from "lucide-react";

const categories = [
  { name: "Investing", Icon: TrendingUp },
  { name: "Stock Market", Icon: BarChart3 },
  { name: "Personal Finance", Icon: PiggyBank },
  { name: "Banking", Icon: Landmark },
  { name: "Crypto", Icon: Coins },
  { name: "Taxation", Icon: Receipt },
];

const featured = [
  { title: "Investing 101: Build Your Portfolio", author: "A. Sharma", level: "Beginner" },
  { title: "Decoding Stock Charts", author: "R. Kapoor", level: "Intermediate" },
  { title: "Personal Budgeting Mastery", author: "M. Verma", level: "All Levels" },
];

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finance Voyage Academy",
    url: typeof window !== "undefined" ? window.location.origin : "",
    sameAs: [],
  };

  return (
    <>
      <SEO
        title="Finance Voyage Academy | Master Your Money – Learn, Invest, Grow"
        description="Learn finance with expert-led courses, live webinars, and daily insights. Master your money with investing, markets, personal finance, and more."
        structuredData={structuredData}
      />

      <header className="relative overflow-hidden">
        <img
          src={hero}
          alt="Financial education hero banner with charts and gold accents"
          className="absolute inset-0 h-[520px] w-full object-cover"
          loading="eager"
        />
        <div className="relative">
          <section className="container mx-auto flex min-h-[520px] flex-col items-center justify-center text-center">
            <h1 className="mb-4 max-w-3xl text-4xl font-bold sm:text-5xl">
              Master Your Money – Learn, Invest, Grow
            </h1>
            <p className="mb-6 max-w-2xl text-muted-foreground">
              Professional financial education to help you build wealth and make confident decisions.
            </p>
            <div className="flex w-full max-w-xl items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search courses, topics, or authors" />
              </div>
              <Button variant="hero">Search</Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {categories.map(({ name, Icon }) => (
                <span key={name} className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-sm">
                  <Icon className="h-4 w-4 text-accent" />
                  {name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </header>

      <main>
        <section className="container mx-auto py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Courses & Articles</h2>
            <Button variant="link" asChild>
              <a href="/courses">View all</a>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <Card key={item.title} className="transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="line-clamp-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" /> {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>By {item.author}</p>
                  <p>Level: {item.level}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="mb-6 text-2xl font-semibold">Browse Categories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, Icon }) => (
              <Card key={name} className="transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-accent" /> {name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore curated lessons, resources, and expert insights in {name.toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto py-12">
          <div className="rounded-lg bg-gradient-to-r from-primary/5 via-accent/10 to-background p-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Join Live Classes & Webinars</h2>
            <p className="mb-6 text-muted-foreground">
              Stay ahead with weekly market analysis and expert Q&A sessions.
            </p>
            <Button variant="premium" asChild>
              <a href="/live">See schedule</a>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
