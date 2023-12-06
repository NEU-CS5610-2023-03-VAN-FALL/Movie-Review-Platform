import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect} = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const handleExploreMovies = () => {
    navigate("/movies");
  };
  const [latestReview, setLatestReview] = useState(null);

  useEffect(() => {
    const fetchLatestReview = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const reviews = await response.json();
 
        if (reviews.length > 0) {
          setLatestReview(reviews[0]);
        }
 
      } catch (error) {
        console.error("Error fetching latest review:", error);
      }
    };

    fetchLatestReview();


  }, [isAuthenticated]);

  return (
    <div className="home">
      <h1>Movie Reviews App</h1>
      {!isAuthenticated ? (
        <div className="auth-buttons">
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
          <button className="btn-secondary" onClick={signUp}>
            Create Account
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        </div>
      )}

      <div className="explore-movies-button">
        <button onClick={handleExploreMovies}>View All Movie Reviews</button>
      </div>

      {latestReview ? (
        <div className="latest-review">
          <h2>Latest Overall Movie Review</h2>
          <p>Movie: {latestReview.movie.title}</p>
          <p>{latestReview.content}</p>
          <p>Created at: {new Date(latestReview.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No overall reviews available. Be the first to write one!</p>
      )}
    </div>
  );
}



