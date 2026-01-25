import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import type { Movie } from "@/hooks/useMovies";
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2, MapPin, Minus, Plus, Star, Ticket } from "lucide-react";
import { format, addDays } from "date-fns";
import SeatMap from "./SeatMap";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onRequireAuth: () => void;
}

interface Theater {
  id: string;
  name: string;
  location: string;
  showtimes: string[];
  priceMultiplier: number;
}

// Mock theater data
const theaters: Theater[] = [
  {
    id: "1",
    name: "PVR Cinemas",
    location: "Phoenix Mall, Lower Parel",
    showtimes: ["10:00 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"],
    priceMultiplier: 1.2,
  },
  {
    id: "2",
    name: "INOX Megaplex",
    location: "Inorbit Mall, Malad",
    showtimes: ["11:00 AM", "2:15 PM", "5:30 PM", "8:45 PM"],
    priceMultiplier: 1.0,
  },
  {
    id: "3",
    name: "Cinepolis",
    location: "Viviana Mall, Thane",
    showtimes: ["9:30 AM", "12:45 PM", "4:00 PM", "7:15 PM", "10:30 PM"],
    priceMultiplier: 0.9,
  },
  {
    id: "4",
    name: "Carnival Cinemas",
    location: "Andheri West",
    showtimes: ["10:30 AM", "1:45 PM", "5:00 PM", "8:15 PM"],
    priceMultiplier: 0.8,
  },
];

const BookingModal = ({ isOpen, onClose, movie, onRequireAuth }: BookingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();
  
  const [step, setStep] = useState<"theater" | "select" | "seats" | "payment" | "success">("theater");
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [seats, setSeats] = useState(1);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const ticketPrice = selectedTheater 
    ? Math.round(Number(movie.price) * selectedTheater.priceMultiplier) 
    : Number(movie.price);
  const totalAmount = seats * ticketPrice;
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleSelectShowtime = (theater: Theater, time: string) => {
    setSelectedTheater(theater);
    setSelectedTime(time);
    setStep("select");
  };

  const handleBackToTheaters = () => {
    setSelectedTheater(null);
    setSelectedTime("");
    setSelectedSeatIds([]);
    setStep("theater");
  };

  const handleBackToSelect = () => {
    setSelectedSeatIds([]);
    setStep("select");
  };

  const handleProceedToSeats = () => {
    setSelectedSeatIds([]);
    setStep("seats");
  };

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!selectedTheater) return;
    if (selectedSeatIds.length !== seats) {
      toast({
        title: "Select Seats",
        description: `Please select exactly ${seats} seat(s) to continue.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats,
        total_amount: totalAmount,
        show_date: format(selectedDate, "yyyy-MM-dd"),
        show_time: `${selectedTime} @ ${selectedTheater.name} (${selectedSeatIds.sort().join(", ")})`,
        status: "pending",
      });

      setBookingId(booking.id);
      setStep("payment");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    if (!bookingId) return;

    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Generate mock payment ID
      const mockPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "paid",
        paymentId: mockPaymentId,
      });

      setStep("success");
      
      // Mock email notification via toast
      toast({
        title: "📧 Booking Confirmed!",
        description: `Confirmation email sent! Your booking ID: ${bookingId.slice(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Payment processing failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep("theater");
    setSelectedTheater(null);
    setSelectedTime("");
    setSeats(1);
    setSelectedSeatIds([]);
    setBookingId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {step === "theater" && "Book Tickets"}
            {step === "select" && "How Many Tickets?"}
            {step === "seats" && "Select Your Seats"}
            {step === "payment" && "Payment"}
            {step === "success" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "theater" && (
          <div className="space-y-6">
            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={movie.poster_url || "/placeholder.svg"}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-foreground">{movie.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{movie.rating}/10</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {movie.language} • {movie.duration}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {movie.genres?.join(", ")}
                </p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Calendar className="w-4 h-4" />
                Select Date
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center px-4 py-2 rounded-lg min-w-[70px] transition-all ${
                      format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <span className="text-xs">{format(date, "EEE")}</span>
                    <span className="text-lg font-semibold">{format(date, "d")}</span>
                    <span className="text-xs">{format(date, "MMM")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theaters Section */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Theaters Showing {movie.title}
              </h2>
              
              <div className="space-y-4">
                {theaters.map((theater) => (
                  <div
                    key={theater.id}
                    className="bg-secondary rounded-lg p-4 border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{theater.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {theater.location}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          ₹{Math.round(Number(movie.price) * theater.priceMultiplier)} per ticket
                        </p>
                      </div>
                    </div>
                    
                    {/* Showtimes */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Available Showtimes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {theater.showtimes.map((time) => (
                          <button
                            key={`${theater.id}-${time}`}
                            onClick={() => handleSelectShowtime(theater, time)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium bg-background border border-border text-foreground hover:border-primary hover:text-primary transition-all"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "select" && selectedTheater && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBackToTheaters}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to theaters
            </button>

            {/* Selected Theater & Time Info */}
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex gap-4">
                <img
                  src={movie.poster_url || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTheater.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTheater.location}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="text-primary font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(selectedDate, "MMM d, yyyy")}
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Ticket className="w-4 h-4" />
                Number of Seats
              </Label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-all"
                  disabled={seats <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-bold text-foreground w-8 text-center">{seats}</span>
                <button
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-all"
                  disabled={seats >= 10}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ₹{ticketPrice} × {seats} ticket(s)
              </p>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-border">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={handleProceedToSeats}
            >
              Select Seats
            </Button>
          </div>
        )}

        {step === "seats" && selectedTheater && (
          <div className="space-y-6 animate-fade-in">
            {/* Back Button */}
            <button
              onClick={handleBackToSelect}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to ticket count
            </button>

            {/* Booking Info Summary */}
            <div className="bg-secondary rounded-lg p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{movie.title}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{selectedTheater.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(selectedDate, "MMM d")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  {seats} ticket(s)
                </span>
              </div>
            </div>

            {/* Horizontal Date Selection Row */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Calendar className="w-4 h-4" />
                Select Date
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSeatIds([]); // Reset seats when date changes
                    }}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] transition-all flex-shrink-0 ${
                      format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    <span className="text-xs">{format(date, "EEE")}</span>
                    <span className="text-lg font-semibold">{format(date, "d")}</span>
                    <span className="text-xs">{format(date, "MMM")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Showtimes Row */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Clock className="w-4 h-4" />
                Select Showtime
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {selectedTheater.showtimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setSelectedSeatIds([]); // Reset seats when time changes
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Map */}
            <SeatMap
              maxSeats={seats}
              selectedSeats={selectedSeatIds}
              onSeatToggle={handleSeatToggle}
              theaterId={selectedTheater.id}
              showtime={`${format(selectedDate, "yyyy-MM-dd")}-${selectedTime}`}
            />

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-border">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={isProcessing || selectedSeatIds.length !== seats}
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {user 
                ? selectedSeatIds.length === seats 
                  ? "Proceed to Payment" 
                  : `Select ${seats - selectedSeatIds.length} more seat(s)`
                : "Sign in to Book"}
            </Button>
          </div>
        )}

        {step === "payment" && selectedTheater && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-secondary rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Order Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{movie.title}</span>
                <span className="text-foreground">{seats} ticket(s)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Theater</span>
                <span className="text-foreground">{selectedTheater.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="text-foreground">
                  {format(selectedDate, "MMM d")} • {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground font-mono">
                  {selectedSeatIds.sort().join(", ")}
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            </div>

            {/* Mock Payment Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Card Number</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  className="bg-secondary border-border text-foreground"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Expiry</Label>
                  <Input
                    placeholder="MM/YY"
                    className="bg-secondary border-border text-foreground"
                    defaultValue="12/28"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">CVC</Label>
                  <Input
                    placeholder="123"
                    className="bg-secondary border-border text-foreground"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              🔒 This is a mock payment. No real charges will be made.
            </p>

            <Button
              variant="hero"
              className="w-full"
              onClick={handleMockPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{totalAmount}
                </>
              )}
            </Button>
          </div>
        )}

        {step === "success" && selectedTheater && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Ticket className="w-10 h-10 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your booking for <span className="text-primary font-medium">{movie.title}</span> is confirmed.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="text-foreground font-mono">
                  {bookingId?.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Theater</span>
                <span className="text-foreground">{selectedTheater.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="text-foreground">
                  {format(selectedDate, "MMM d, yyyy")} • {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground font-mono">
                  {selectedSeatIds.sort().join(", ")}
                </span>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
