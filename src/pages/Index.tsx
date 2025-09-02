import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Crown, BookOpen, Users, Award, Quote, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import heroImage from "@/assets/finance-hero.jpg";

const testimonials = [
  {
    quote: "WealthWise Academy transformed my understanding of investments. From zero knowledge to confidently managing my portfolio in just 6 months.",
    author: "Rahul Sharma",
    position: "Software Engineer, Mumbai",
    rating: 5
  },
  {
    quote: "The personalized guidance helped me plan my retirement effectively. I wish I had found them earlier in my career.",
    author: "Priya Patel",
    position: "Teacher, Pune",
    rating: 5
  },
  {
    quote: "Excellent courses that are practical and easy to understand. The SEBI-certified instructors make all the difference.",
    author: "Amit Kumar",
    position: "Bank Manager, Delhi",
    rating: 5
  }
];

const features = [
  {
    icon: Crown,
    title: "Premium Learning Experience",
    description: "Carefully curated content designed for middle-class Indians looking to build sustainable wealth."
  },
  {
    icon: Award,
    title: "SEBI Certified Experts",
    description: "Learn from industry professionals with decades of experience in financial planning and investment management."
  },
  {
    icon: Users,
    title: "Community of Learners",
    description: "Connect with like-minded individuals on their wealth-building journey and share experiences."
  }
];

const stats = [
  { number: "50,000+", label: "Students Transformed" },
  { number: "₹500Cr+", label: "Wealth Created" },
  { number: "25+", label: "Expert Mentors" },
  { number: "4.9/5", label: "Average Rating" }
];

const Index = () => {
  return (
    <>
      <SEO
        title="WealthWise Academy - Elite Financial Education for Modern India"
        description="Join India's most prestigious financial education platform. Learn wealth building from SEBI-certified experts with our exclusive courses and personalized guidance."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "WealthWise Academy",
          "description": "Premium financial education platform for India",
          "url": "https://wealthwise-academy.com"
        }}
      />

      {/* Classic Hero Section with Rich Typography */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">India's Premier Financial Education Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="block text-white">Master the Art of</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                Wealth Creation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-slate-200">
              Join India's most exclusive financial education community. Learn sophisticated investment strategies 
              from <span className="text-yellow-400 font-semibold">SEBI-certified masters</span> who have 
              guided thousands to financial independence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="h-16 px-10 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
              >
                Begin Your Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-bold text-lg rounded-xl backdrop-blur-md transition-all duration-300"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Explore Curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Stats Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-4xl font-bold text-slate-800 mb-2">{stat.number}</h3>
                  <p className="text-slate-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-800 mb-6">
              Why Choose <span className="text-yellow-600">WealthWise?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference that premium education and expert guidance can make in your financial journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border border-slate-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Rich Design */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Hear from our community of successful wealth builders who transformed their financial lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:-translate-y-2">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-yellow-400 mb-4" />
                  
                  <blockquote className="text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="font-bold text-yellow-400">{testimonial.author}</div>
                    <div className="text-sm text-slate-300">{testimonial.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sophisticated CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Join the Elite?
            </h2>
            <p className="text-xl mb-12 leading-relaxed text-black/80">
              Take the first step towards financial mastery. Join thousands of successful investors 
              who have transformed their wealth with our premium education.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-black" />
                <h3 className="font-bold mb-2">Lifetime Access</h3>
                <p className="text-sm text-black/70">Complete course library + future updates</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-black" />
                <h3 className="font-bold mb-2">Expert Mentorship</h3>
                <p className="text-sm text-black/70">Direct access to SEBI-certified advisors</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-black" />
                <h3 className="font-bold mb-2">Proven Results</h3>
                <p className="text-sm text-black/70">Track record of consistent wealth creation</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="h-16 px-10 bg-black text-white hover:bg-slate-800 font-bold text-lg rounded-xl shadow-2xl transition-all duration-300"
              >
                Start Your Transformation
                <Crown className="w-6 h-6 ml-3" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 border-2 border-black text-black hover:bg-black hover:text-white font-bold text-lg rounded-xl transition-all duration-300"
              >
                <Users className="w-6 h-6 mr-3" />
                Schedule Expert Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;