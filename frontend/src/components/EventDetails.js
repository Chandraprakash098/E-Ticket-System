// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getEventById } from "../services/api";

// function EventDetails() {
//   const [event, setEvent] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchEvent = async () => {
//       const data = await getEventById(id);
//       setEvent(data);
//     };
//     fetchEvent();
//   }, [id]);

//   if (!event) return <div className="text-center py-4">Loading...</div>;

//   return (
//     <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
//       <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-4">
//         {event.name}
//       </h1>
//       <p className="text-lg mb-2">
//         <span className="font-semibold">Date:</span>{" "}
//         {new Date(event.date).toLocaleDateString()}
//       </p>
//       <p className="text-lg mb-2">
//         <span className="font-semibold">Time:</span> {event.time}
//       </p>
//       <p className="text-lg mb-2">
//         <span className="font-semibold">Venue:</span> {event.venue}
//       </p>
//       <p className="text-lg mb-2">
//         <span className="font-semibold">Available Seats:</span>{" "}
//         {event.availableSeats}
//       </p>
//       <p className="text-lg mb-2">
//         <span className="font-semibold">Price:</span> ${event.price}
//       </p>
//       <p className="text-lg mb-4">
//         <span className="font-semibold">Genre:</span> {event.genre}
//       </p>
//       <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
//         Book Now
//       </button>
//     </div>
//   );
// }

// export default EventDetails;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../services/api";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getEventById(id);
      setEvent(data);
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text mb-6">
          {event.name}
        </h1>
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Time:</span> {event.time}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Venue:</span> {event.venue}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Available Seats:</span>{" "}
            {event.availableSeats}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Price:</span> ${event.price}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Genre:</span> {event.genre}
          </p>
        </div>
        <button className="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
}

export default EventDetails;


