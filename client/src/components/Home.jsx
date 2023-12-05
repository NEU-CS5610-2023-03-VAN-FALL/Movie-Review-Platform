import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const handleExploreMovies = () => {
    navigate("/movies");
  };
  // const [latestReview, setLatestReview] = useState(null);
  // const [userLatestReview, setUserLatestReview] = useState(null);

  // useEffect(() => {
  //   const fetchLatestReview = async () => {
  //     try {
  //       const response = await fetch("/reviews");
  //       const reviews = await response.json();
  //       if (reviews.length > 0) {
  //         setLatestReview(reviews[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching latest review:", error);
  //     }
  //   };

  //   const fetchUserLatestReview = async () => {
  //     try {
  //       const response = await fetch("/user-reviews");
  //       const userReviews = await response.json();
  //       if (userReviews.length > 0) {
  //         setUserLatestReview(userReviews[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user's latest review:", error);
  //     }
  //   };

  //   fetchLatestReview();

  //   if (isAuthenticated) {
  //     fetchUserLatestReview();
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="home">
      <h1>Movie Reviews App</h1>      
      {!isAuthenticated ? (
        <div>
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
          <button className="btn-secondary" onClick={signUp}>
            Create Account
          </button>
        </div>
      ) : (
        <div>
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        </div>
      )}

    <div>
      <button onClick={handleExploreMovies}>Explore Movies</button>
    </div> 
      
     {/* {latestReview ? (
      <div>
        <h2>Latest Overall Review</h2>
        <p>{latestReview.content}</p>
        <p>By: {latestReview.user.username}</p>
        {latestReview.movie && (
          <p>Movie: {latestReview.movie.title}</p>
        )}
      </div>
    ) : (
      <p>No overall reviews available. Be the first to write one!</p>
    )}

    {isAuthenticated && userLatestReview ? (
      <div>
        <h2>Your Latest Review</h2>
        <p>{userLatestReview.content}</p>
        <p>By: {userLatestReview.user.username}</p>
        {userLatestReview.movie && (
          <p>Movie: {userLatestReview.movie.title}</p>
        )}
      </div>
    ) : (
      isAuthenticated && <p>No reviews by you yet. Start writing now!</p>
    )} */}
  </div>
  );
}



