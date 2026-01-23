interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const genres = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Romance",
  "Thriller",
  "Animation",
  "Adventure",
  "Biography",
  "Fantasy",
];

const GenreFilter = ({ selectedGenre, onGenreChange }: GenreFilterProps) => {
  return (
    <section className="py-6 bg-secondary/30 border-y border-border sticky top-28 z-30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedGenre === genre
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
