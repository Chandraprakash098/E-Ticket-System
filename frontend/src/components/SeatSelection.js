import {React,useState} from "react";

function SeatSelection({ availableSeats, onSeatSelect, bookedSeats }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const confirmSelection = () => {
    onSeatSelect(selectedSeats);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Select Your Seats</h2>
      <div className="grid grid-cols-10 gap-2">
        {[...Array(availableSeats)].map((_, index) => {
          const seatNumber = index + 1;
          const isBooked = bookedSeats.includes(seatNumber); // Check if the seat is booked

          return (
            <button
              key={index}
              className={`p-2 rounded ${
                selectedSeats.includes(seatNumber)
                  ? "bg-blue-500 text-white"
                  : isBooked
                  ? "bg-red-500 text-white" // Style for booked seats
                  : "bg-gray-200"
              }`}
              onClick={() => {
                if (isBooked) {
                  alert("This seat is already booked.");
                  return;
                }
                handleSeatClick(seatNumber);
              }}
              disabled={isBooked} // Disable button for booked seats
            >
              {seatNumber}
            </button>
          );
        })}
      </div>
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={confirmSelection}
        disabled={selectedSeats.length === 0}
      >
        Confirm Selection
      </button>
    </div>
  );
}

export default SeatSelection;




