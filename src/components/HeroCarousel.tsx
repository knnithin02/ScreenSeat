import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedMovies, type Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroCarouselProps {
  onBookClick: (movie: Movie) => void;
}

const HeroCarousel = ({ onBookClick }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: featuredMovies, isLoading } = useFeaturedMovies();

  useEffect(() => {
    if (!featuredMovies?.length) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMovies?.length]);

  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-secondary">
        <div className="container mx-auto px-4 h-full pt-28">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-8 w-32 bg-muted" />
            <Skeleton className="h-16 w-96 bg-muted" />
            <Skeleton className="h-6 w-64 bg-muted" />
            <Skeleton className="h-12 w-48 bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredMovies?.length) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const movie = featuredMovies[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${movie.banner_url || movie.poster_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex items-center h-full pt-28">
          <div className="max-w-2xl animate-fade-in" key={movie.id}>
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-foreground font-semibold">{movie.rating}/10</span>
                <span className="text-sm">({movie.votes} Votes)</span>
              </div>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.release_date}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={() => onBookClick(movie)}>
                Book Tickets
              </Button>
              <Button variant="glass" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background/80 transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background/80 transition-all z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
