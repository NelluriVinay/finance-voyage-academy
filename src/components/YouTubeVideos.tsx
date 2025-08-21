import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Clock, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string;
  published_at: string;
  view_count: number;
  duration_seconds: number;
  category: string;
  is_featured: boolean;
}

const YouTubeVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [...new Set(videos.map(v => v.category).filter(Boolean))];
  const filteredVideos = selectedCategory 
    ? videos.filter(v => v.category === selectedCategory)
    : videos;

  const featuredVideos = videos.filter(v => v.is_featured).slice(0, 3);
  const regularVideos = filteredVideos.filter(v => !v.is_featured || selectedCategory);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Learning Videos</h2>
            <p className="text-xl text-muted-foreground">Loading videos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-blue-light to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Learning Videos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expand your financial knowledge with our curated collection of educational videos
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All Videos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Featured Videos */}
        {featuredVideos.length > 0 && !selectedCategory && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Featured Videos</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="group hover:shadow-trust-large transition-all duration-300 hover:-translate-y-2 border-0 shadow-trust-medium overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        size="lg" 
                        className="bg-trust-green hover:bg-trust-green/90"
                        onClick={() => window.open(video.youtube_url, '_blank')}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Watch Now
                      </Button>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-trust-green/90 text-white">
                      Featured
                    </Badge>
                    {video.duration_seconds && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(video.duration_seconds)}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary-blue transition-colors">
                      {video.title}
                    </CardTitle>
                    {video.category && (
                      <Badge variant="outline" className="w-fit">
                        {video.category}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {formatViewCount(video.view_count)} views
                      </div>
                      {video.published_at && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(video.published_at)}
                        </div>
                      )}
                    </div>
                    {video.description && (
                      <CardDescription className="line-clamp-2">
                        {video.description}
                      </CardDescription>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Videos Grid */}
        {regularVideos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularVideos.map((video) => (
              <Card key={video.id} className="group hover:shadow-trust-large transition-all duration-300 hover:-translate-y-2 border-0 shadow-trust-medium overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      size="lg" 
                      className="bg-trust-green hover:bg-trust-green/90"
                      onClick={() => window.open(video.youtube_url, '_blank')}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                  {video.duration_seconds && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(video.duration_seconds)}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary-blue transition-colors">
                    {video.title}
                  </CardTitle>
                  {video.category && (
                    <Badge variant="outline" className="w-fit">
                      {video.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatViewCount(video.view_count)} views
                    </div>
                    {video.published_at && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(video.published_at)}
                      </div>
                    )}
                  </div>
                  {video.description && (
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No videos available at the moment.</p>
            <p className="text-muted-foreground mt-2">Check back soon for new educational content!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default YouTubeVideos;