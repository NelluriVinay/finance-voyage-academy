import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Search, BookOpen, TrendingUp, Users, DollarSign, Star, PieChart, Shield, Play, CheckCircle, Award, Clock, User } from "lucide-react";
import heroImage from "@/assets/finance-hero.jpg";

const categories = [
  { name: "Stock Market Basics", Icon: TrendingUp, courses: "15+" },
  { name: "Mutual Funds", Icon: PieChart, courses: "12+" },
  { name: "Insurance Planning", Icon: Shield, courses: "8+" },
  { name: "Tax Optimization", Icon: DollarSign, courses: "10+" },
];

const featured = [
  { 
    title: "Complete Stock Market Mastery", 
    author: "Rajesh Kumar", 
    level: "Beginner",
    price: "₹2,999",
    originalPrice: "₹4,999",
    rating: 4.8,
    students: "2,340",
    duration: "6 weeks"
  },
  { 
    title: "Mutual Fund Investment Strategy", 
    author: "Priya Sharma", 
    level: "Intermediate",
    price: "₹3,999",
    originalPrice: "₹5,999",
    rating: 4.9,
    students: "1,890",
    duration: "4 weeks"
  },
  { 
    title: "Advanced Portfolio Management", 
    author: "Amit Patel", 
    level: "Advanced",
    price: "₹5,999",
    originalPrice: "₹8,999",
    rating: 4.7,
    students: "956",
    duration: "8 weeks"
  },
];

const experts = [
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Stock Market Expert",
    experience: "15+ years",
    rating: 4.9,
    sessions: "500+",
    sebiCertified: true
  },
  {
    name: "Priya Sharma",
    specialization: "Mutual Fund Advisor",
    experience: "12+ years", 
    rating: 4.8,
    sessions: "350+",
    sebiCertified: true
  },
  {
    name: "Amit Patel",
    specialization: "Tax Planning Specialist",
    experience: "10+ years",
    rating: 4.7,
    sessions: "280+",
    sebiCertified: true
  }
];

const Index = () => {
  return (
    <>
      <SEO
        title="WealthWise Academy - Learn Smart Investing for Middle Class India"
        description="Master finance and investing with SEBI-certified experts. Personalized guidance, live sessions, and courses designed for middle-class families."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "WealthWise Academy",
          "description": "Online finance education platform for middle-class Indians",
          "url": "https://wealthwise-academy.com"
        }}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Journey to 
              <span className="block text-gold">Financial Freedom</span>
              <span className="block">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
              Learn smart investing from <span className="text-gold font-semibold">SEBI-certified experts</span> who understand 
              middle-class challenges. Get personalized guidance to build wealth systematically.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-12 animate-slide-in-left">
            <div className="glass-effect rounded-2xl p-4">
              <div className="flex gap-3">
                <Input 
                  placeholder="What would you like to learn today? (e.g., mutual funds, stock market)" 
                  className="flex-1 h-14 text-foreground bg-background/90"
                />
                <Button size="lg" className="h-14 px-8 bg-trust-green hover:bg-trust-green/90">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in-right">
            {categories.map(({ name, Icon, courses }) => (
              <Badge key={name} className="sebi-badge text-base py-3 px-6 hover:scale-105 transition-transform cursor-pointer">
                <Icon className="w-5 h-5 mr-2" />
                {name} ({courses})
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
            <Button size="lg" className="h-14 px-8 bg-gold text-gold-foreground hover:bg-gold/90 text-lg font-semibold">
              <Play className="w-5 h-5 mr-3" />
              Watch Free Demo
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-foreground text-lg font-semibold">
              <BookOpen className="w-5 h-5 mr-3" />
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-primary-blue">50,000+</h3>
              <p className="text-muted-foreground">Students Trained</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-3xl font-bold text-trust-green">25+</h3>
              <p className="text-muted-foreground">SEBI Certified Experts</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl font-bold text-gold">4.9/5</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-3xl font-bold text-primary-blue">₹2.5Cr+</h3>
              <p className="text-muted-foreground">Wealth Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Most Popular Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked courses designed specifically for middle-class families to build wealth systematically
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((course, index) => (
              <Card key={index} className="hover:shadow-trust-large transition-all duration-300 hover:-translate-y-2 group border-0 shadow-trust-medium">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-primary-blue text-primary-blue">{course.level}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-blue transition-colors">{course.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <Award className="w-4 h-4 mr-1 text-trust-green" />
                    By {course.author} • SEBI Certified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {course.students} students
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-trust-green">{course.price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">{course.originalPrice}</span>
                      </div>
                      <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEBI Experts Section */}
      <section className="py-20 bg-gradient-to-br from-primary-blue-light to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our SEBI-Certified Experts</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn from professionals who have dedicated their careers to helping middle-class families achieve financial independence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <Card key={index} className="text-center hover:shadow-trust-large transition-all duration-300 hover:-translate-y-2 border-0 shadow-trust-medium">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-finance-gradient mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{expert.name}</CardTitle>
                  <CardDescription className="text-base">{expert.specialization}</CardDescription>
                  {expert.sebiCertified && (
                    <Badge className="sebi-badge mx-auto mt-2">
                      <Shield className="w-4 h-4 mr-1" />
                      SEBI Certified
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">{expert.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-gold text-gold mr-1" />
                        <span className="font-medium">{expert.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Sessions:</span>
                      <span className="font-medium">{expert.sessions}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-trust-green hover:bg-trust-green/90">
                    Book 1-on-1 Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Learn by Category</h2>
            <p className="text-xl text-muted-foreground">
              Structured learning paths for every aspect of personal finance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ name, Icon, courses }) => (
              <Card key={name} className="text-center hover:shadow-trust-large transition-all duration-300 hover:-translate-y-2 cursor-pointer group border-0 shadow-trust-soft">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-full bg-finance-gradient mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-blue transition-colors">{name}</h3>
                  <p className="text-muted-foreground text-sm">{courses} courses available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-finance-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Wealth?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of middle-class families who have transformed their financial lives 
            with our expert guidance and proven strategies.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="glass-effect rounded-xl p-6">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-gold" />
              <h3 className="font-semibold mb-2">Personalized Learning</h3>
              <p className="text-sm opacity-90">Tailored to your income and goals</p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-gold" />
              <h3 className="font-semibold mb-2">Live Expert Sessions</h3>
              <p className="text-sm opacity-90">Direct access to SEBI certified advisors</p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <CheckCircle className="w-8 h-8 mx-auto mb-3 text-gold" />
              <h3 className="font-semibold mb-2">Practical Strategies</h3>
              <p className="text-sm opacity-90">Real-world application, not just theory</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="h-14 px-8 bg-gold text-gold-foreground hover:bg-gold/90 text-lg font-semibold">
              <BookOpen className="w-5 h-5 mr-3" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-foreground text-lg font-semibold">
              <Users className="w-5 h-5 mr-3" />
              Book Expert Consultation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;