export interface Movie {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  rating: number;
  language: string;
  releaseDate: string;
  duration: string;
  votes: string;
  featured?: boolean;
  banner?: string;
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.8,
    language: "English",
    releaseDate: "2024",
    duration: "2h 46m",
    votes: "245K",
    featured: true,
    banner: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=800&fit=crop"
  },
  {
    id: "2",
    title: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    genres: ["Biography", "Drama", "History"],
    rating: 8.5,
    language: "English",
    releaseDate: "2024",
    duration: "3h 0m",
    votes: "890K",
    featured: true,
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=800&fit=crop"
  },
  {
    id: "3",
    title: "Godzilla x Kong",
    poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop",
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 7.2,
    language: "English",
    releaseDate: "2024",
    duration: "1h 55m",
    votes: "120K"
  },
  {
    id: "4",
    title: "Kung Fu Panda 4",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    genres: ["Animation", "Action", "Comedy"],
    rating: 7.0,
    language: "English",
    releaseDate: "2024",
    duration: "1h 34m",
    votes: "85K"
  },
  {
    id: "5",
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Action", "Fantasy"],
    rating: 8.2,
    language: "Telugu",
    releaseDate: "2024",
    duration: "2h 50m",
    votes: "350K",
    featured: true,
    banner: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=800&fit=crop"
  },
  {
    id: "6",
    title: "Deadpool & Wolverine",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    genres: ["Action", "Comedy", "Sci-Fi"],
    rating: 8.0,
    language: "English",
    releaseDate: "2024",
    duration: "2h 7m",
    votes: "420K"
  },
  {
    id: "7",
    title: "Inside Out 2",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    genres: ["Animation", "Comedy", "Family"],
    rating: 7.8,
    language: "English",
    releaseDate: "2024",
    duration: "1h 36m",
    votes: "180K"
  },
  {
    id: "8",
    title: "Bad Boys: Ride or Die",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    genres: ["Action", "Comedy", "Crime"],
    rating: 7.1,
    language: "English",
    releaseDate: "2024",
    duration: "1h 55m",
    votes: "95K"
  },
  {
    id: "9",
    title: "Fighter",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    genres: ["Action", "Drama", "Thriller"],
    rating: 7.5,
    language: "Hindi",
    releaseDate: "2024",
    duration: "2h 46m",
    votes: "210K"
  },
  {
    id: "10",
    title: "Furiosa",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 7.9,
    language: "English",
    releaseDate: "2024",
    duration: "2h 28m",
    votes: "165K"
  }
];

export const featuredMovies = movies.filter(movie => movie.featured);
