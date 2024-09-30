import React from "react";
import UserProfile from "../components/UserProfile";
import BookingHistory from "../components/BookingHistory";

function ProfilePage() {
  return (
    <div>
      <UserProfile />
      <BookingHistory />
    </div>
  );
}

export default ProfilePage;
