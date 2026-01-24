import { useMemo } from "react";
import { Monitor } from "lucide-react";

interface SeatMapProps {
  maxSeats: number;
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
  theaterId: string;
  showtime: string;
}

// Generate consistent "taken" seats based on theater and showtime
const generateTakenSeats = (theaterId: string, showtime: string): Set<string> => {
  const seed = `${theaterId}-${showtime}`;
  const takenSeats = new Set<string>();
  
  // Create a simple hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Generate 15-30 taken seats based on hash
  const numTaken = 15 + (Math.abs(hash) % 16);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  
  for (let i = 0; i < numTaken; i++) {
    const rowIndex = (Math.abs(hash + i * 7) % rows.length);
    const seatNum = (Math.abs(hash + i * 13) % seatsPerRow) + 1;
    takenSeats.add(`${rows[rowIndex]}${seatNum}`);
  }
  
  return takenSeats;
};

const SeatMap = ({ maxSeats, selectedSeats, onSeatToggle, theaterId, showtime }: SeatMapProps) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  
  const takenSeats = useMemo(() => 
    generateTakenSeats(theaterId, showtime), 
    [theaterId, showtime]
  );

  const handleSeatClick = (seatId: string) => {
    if (takenSeats.has(seatId)) return;
    
    // If already selected, allow deselection
    if (selectedSeats.includes(seatId)) {
      onSeatToggle(seatId);
      return;
    }
    
    // If max seats reached, don't allow more selection
    if (selectedSeats.length >= maxSeats) return;
    
    onSeatToggle(seatId);
  };

  const getSeatStyle = (seatId: string) => {
    const isTaken = takenSeats.has(seatId);
    const isSelected = selectedSeats.includes(seatId);
    
    if (isTaken) {
      return "bg-muted text-muted-foreground cursor-not-allowed opacity-50";
    }
    
    if (isSelected) {
      return "bg-primary text-primary-foreground border-primary cursor-pointer";
    }
    
    // Available seat - green border with green text
    return "bg-background border-2 border-emerald-500 text-emerald-500 cursor-pointer hover:bg-emerald-500/10 transition-all";
  };

  return (
    <div className="space-y-4">
      {/* Screen indicator */}
      <div className="relative">
        <div className="flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-primary/20 to-transparent rounded-t-xl">
          <Monitor className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">SCREEN</span>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-2 py-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            {/* Row label */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-center">
              {row}
            </span>
            
            {/* Seats */}
            <div className="flex gap-1">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatNum = i + 1;
                const seatId = `${row}${seatNum}`;
                const isTaken = takenSeats.has(seatId);
                
                // Add aisle gap after seat 4 and 8
                const hasGapAfter = seatNum === 4 || seatNum === 8;
                
                return (
                  <div key={seatId} className={`flex ${hasGapAfter ? 'mr-3' : ''}`}>
                    <button
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isTaken}
                      className={`w-7 h-7 rounded-t-lg text-xs font-medium flex items-center justify-center ${getSeatStyle(seatId)}`}
                      title={isTaken ? "Seat unavailable" : `Seat ${seatId}`}
                    >
                      {seatNum}
                    </button>
                  </div>
                );
              })}
            </div>
            
            {/* Row label (right side) */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-center">
              {row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md border-2 border-emerald-500 bg-background" />
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-primary" />
          <span className="text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-muted opacity-50" />
          <span className="text-xs text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection status */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="text-primary font-medium">{selectedSeats.length}</span> / {maxSeats} seats
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Seats: <span className="text-foreground font-medium">{selectedSeats.sort().join(", ")}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
