import { ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/data/movies";

const MovieListings = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recommended Movies
            </h2>
            <p className="text-muted-foreground mt-1">
              Top picks for you based on trending movies
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
            See All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

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
