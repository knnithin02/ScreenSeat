import { ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { useMovies, type Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieListingsProps {
  onBookClick: (movie: Movie) => void;
  selectedGenre: string;
}

const MovieListings = ({ onBookClick, selectedGenre }: MovieListingsProps) => {
  const { data: movies, isLoading } = useMovies();

  const filteredMovies = movies?.filter((movie) => {
    if (selectedGenre === "All") return true;
    return movie.genres.includes(selectedGenre);
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 bg-muted mb-2" />
            <Skeleton className="h-5 w-96 bg-muted" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-xl bg-muted" />
                <Skeleton className="h-5 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {selectedGenre === "All" ? "Recommended Movies" : `${selectedGenre} Movies`}
            </h2>
            <p className="text-muted-foreground mt-1">
              {selectedGenre === "All" 
                ? "Top picks for you based on trending movies" 
                : `Browse ${selectedGenre.toLowerCase()} movies`}
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
            See All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Movie Grid */}
        {filteredMovies && filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MovieCard movie={movie} onBookClick={onBookClick} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found for this genre.</p>
          </div>
        )}

        {/* Mobile See All */}
        <div className="sm:hidden mt-8 text-center">
          <button className="inline-flex items-center gap-1 text-primary font-medium">
            See All Movies
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieListings;
