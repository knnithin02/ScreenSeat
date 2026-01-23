import { Search, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-foreground">
              Book<span className="text-primary">My</span>Show
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Location */}
            <button className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="w-4 h-4" />
              <span>Mumbai</span>
            </button>

            {/* Sign In Button */}
            <Button variant="hero" size="sm" className="hidden sm:flex">
              Sign In
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for Movies..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Mumbai</span>
              </button>
              <Button variant="hero" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="hidden md:block bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 h-12 text-sm">
            <li>
              <a href="#" className="text-primary font-medium">Movies</a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Stream</a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Events</a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Plays</a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sports</a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Activities</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
