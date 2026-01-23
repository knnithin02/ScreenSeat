import { useState } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import GenreFilter from "@/components/GenreFilter";
import MovieListings from "@/components/MovieListings";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import BookingModal from "@/components/BookingModal";
import type { Movie } from "@/hooks/useMovies";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const handleBookClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsBookingModalOpen(true);
  };

  const handleRequireAuth = () => {
    setIsBookingModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      <main>
        <HeroCarousel onBookClick={handleBookClick} />
        <GenreFilter 
          selectedGenre={selectedGenre} 
          onGenreChange={setSelectedGenre} 
        />
        <MovieListings 
          onBookClick={handleBookClick} 
          selectedGenre={selectedGenre}
        />
      </main>
      <Footer />

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {selectedMovie && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedMovie(null);
          }}
          movie={selectedMovie}
          onRequireAuth={handleRequireAuth}
        />
      )}
    </div>
  );
};

export default Index;
