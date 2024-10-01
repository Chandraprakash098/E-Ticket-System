// import React from "react";
// import EventList from "../components/EventList";

// function HomePage() {
//   return (
//     <div className="container mx-auto mt-8">
//       <EventList />
//     </div>
//   );
// }

// export default HomePage;


import React from "react";
import EventList from "../components/EventList";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 lg:p-14">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6 lg:mb-10">
            Welcome to Your E-Ticketing Platform
          </h1>
          <p className="text-lg text-center text-gray-700 mb-8 lg:mb-12">
            Browse and book tickets for your favorite events seamlessly.
          </p>
          <EventList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;


