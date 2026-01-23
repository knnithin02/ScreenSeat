import { Star, Heart } from "lucide-react";
import type { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group relative animate-fade-in">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Like Button */}
          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/50 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:border-primary">
            <Heart className="w-4 h-4 text-foreground" />
          </button>

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-md">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-foreground">{movie.rating}</span>
          </div>

          {/* Votes */}
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-md">
            <span className="text-xs text-muted-foreground">{movie.votes} Votes</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate mb-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs text-muted-foreground"
              >
                {genre}
                {movie.genres.indexOf(genre) < Math.min(movie.genres.length - 1, 1) && (
                  <span className="mx-1">•</span>
                )}
              </span>
            ))}
          </div>

          {/* Language & Duration */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{movie.language}</span>
            <span>{movie.duration}</span>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="card-shine absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
};

export default MovieCard;
