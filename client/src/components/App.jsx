import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/app.css";

const App = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userLatestReview, setUserLatestReview] = useState(null);

  useEffect(() => {
    const fetchUserLatestReview = async () => {
      try {
        if (isAuthenticated) {
          const accessToken = await getAccessTokenSilently();

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/user-reviews`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const userReviews = await response.json();
            if (userReviews.length > 0) {
              setUserLatestReview(userReviews[0]);
            }
          } else {
            console.error("Error fetching user's latest review:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching user's latest review:", error);
      }
    };

    fetchUserLatestReview();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="app-container">
      <h1>Your Latest Movie Review</h1>
      {isAuthenticated && userLatestReview ? (
        <div className="review-container">
          <p>Movie: {userLatestReview.movie.title}</p>
          <p>Review: {userLatestReview.content}</p>
          <p>
            Created at:{" "}
            {new Date(userLatestReview.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No reviews by you yet. Start writing now!</p>
      )}
    </div>
  );
};

export default App;
