import SEO from "@/components/SEO";
import YouTubeVideos from "@/components/YouTubeVideos";

const Videos = () => {
  return (
    <>
      <SEO
        title="Educational Videos - WealthWise Academy"
        description="Watch our comprehensive collection of financial education videos covering stock market, mutual funds, tax planning, and more."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "VideoGallery",
          "name": "WealthWise Academy Videos",
          "description": "Educational finance videos for middle-class Indians"
        }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-blue-light to-muted">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Educational <span className="text-primary-blue">Videos</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn from our comprehensive video library covering all aspects of personal finance, 
                investing, and wealth building designed specifically for middle-class families.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center bg-background/80 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-trust-green rounded-full mr-2"></span>
                  Stock Market Basics
                </div>
                <div className="flex items-center bg-background/80 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-primary-blue rounded-full mr-2"></span>
                  Mutual Fund Strategies
                </div>
                <div className="flex items-center bg-background/80 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                  Tax Planning
                </div>
                <div className="flex items-center bg-background/80 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-trust-green rounded-full mr-2"></span>
                  Investment Planning
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <YouTubeVideos />
      </div>
    </>
  );
};

export default Videos;