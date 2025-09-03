import SEO from "@/components/SEO";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, IndianRupee, Clock } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];

const CATEGORIES = [
  { value: "basics", label: "Basics" },
  { value: "stocks", label: "Stocks" },
  { value: "mutual_funds", label: "Mutual Funds" },
  { value: "insurance", label: "Insurance" },
  { value: "tax_planning", label: "Tax Planning" },
  { value: "retirement", label: "Retirement" },
];

const Courses = () => {
  const [active, setActive] = useState<string>("All");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    
    // Set up real-time subscription for course updates
    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses'
        },
        () => {
          fetchCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = active === "All" 
    ? courses 
    : courses.filter((c) => c.category === active);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <>
      <SEO
        title="Financial Courses & Resources | Finance Voyage Academy"
        description="Explore curated finance courses covering investing, markets, crypto, banking, and taxation."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Financial Courses & Resources</h1>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={active === "All" ? "premium" : "outline"}
            onClick={() => setActive("All")}
            className="rounded-full"
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={active === category.value ? "premium" : "outline"}
              onClick={() => setActive(category.value)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
              <span className="text-lg">Loading courses...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length > 0 ? (
              filtered.map((course) => (
                <Card key={course.id} className="group transition-all hover:shadow-xl hover:scale-[1.02] border-0 shadow-lg bg-gradient-to-br from-card via-card to-card/95">
                  <CardHeader className="pb-3">
                    {course.thumbnail_url ? (
                      <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                        <BookOpen className="w-16 h-16 text-primary/60" />
                      </div>
                    )}
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {course.price_inr === 0 ? "Free" : formatPrice(course.price_inr)}
                        </span>
                      </div>
                      {course.duration_hours && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration_hours}h</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs">
                          {CATEGORIES.find(c => c.value === course.category)?.label || course.category}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      )}
                    </div>
                    
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="pt-2">
                      <Button className="w-full">
                        {course.price_inr === 0 ? "Enroll Free" : "Enroll Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No courses found</h3>
                <p className="text-sm text-muted-foreground">
                  {active === "All" ? "No courses available yet." : `No courses in the ${CATEGORIES.find(c => c.value === active)?.label || active} category.`}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Courses;
