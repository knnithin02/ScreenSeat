import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import type { Movie } from "@/hooks/useMovies";
import { Calendar, Clock, CreditCard, Loader2, Minus, Plus, Star, Ticket } from "lucide-react";
import { format, addDays } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onRequireAuth: () => void;
}

const showTimes = ["10:00 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"];

const BookingModal = ({ isOpen, onClose, movie, onRequireAuth }: BookingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();
  
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(showTimes[0]);
  const [seats, setSeats] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = seats * Number(movie.price);
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleProceedToPayment = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    setIsProcessing(true);
    
    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats,
        total_amount: totalAmount,
        show_date: format(selectedDate, "yyyy-MM-dd"),
        show_time: selectedTime,
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
    setStep("select");
    setSeats(1);
    setBookingId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {step === "select" && "Book Tickets"}
            {step === "payment" && "Payment"}
            {step === "success" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
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
                <p className="text-sm text-primary font-medium mt-2">
                  ₹{movie.price} per ticket
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

            {/* Time Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-foreground">
                <Clock className="w-4 h-4" />
                Select Time
              </Label>
              <div className="flex flex-wrap gap-2">
                {showTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === time
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {time}
                  </button>
                ))}
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
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-border">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {user ? "Proceed to Payment" : "Sign in to Book"}
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-secondary rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Order Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{movie.title}</span>
                <span className="text-foreground">{seats} ticket(s)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="text-foreground">
                  {format(selectedDate, "MMM d")} • {selectedTime}
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

        {step === "success" && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Ticket className="w-10 h-10 text-green-500" />
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
                <span className="text-muted-foreground">Date & Time</span>
                <span className="text-foreground">
                  {format(selectedDate, "MMM d, yyyy")} • {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{seats}</span>
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
