import React, { useState, useEffect,useCallback  } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import "../style/profile.css";

export default function Profile() {
  const { user } = useAuth0();
  const [movieName, setMovieName] = useState("");
  const [movieReview, setMovieReview] = useState("");
  const [userMovies, setUserMovies] = useState([]);
  const { accessToken } = useAuthToken();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewContent, setEditedReviewContent] = useState("");
  const [createReviewError, setCreateReviewError] = useState("");
  const [editReviewError, setEditReviewError] = useState("");

  const fetchUserMovies = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/my-movies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const movies = await response.json();
      setUserMovies(movies);
    } catch (error) {
      console.error("Error fetching user's movies:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    
    fetchUserMovies();
  }, [user,fetchUserMovies]);

  const handleEditReview = (reviewId, currentContent) => {
    setEditingReviewId(reviewId);
    setEditedReviewContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedReviewContent("");
    setEditReviewError("");
  };

  const handleSaveEdit = async () => {
    if (!editedReviewContent.trim()) {
      setEditReviewError("Review content cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/review/${editingReviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: editedReviewContent,
        }),
      });

      if (response.ok) {
        fetchUserMovies();
        setEditingReviewId(null);
        setEditedReviewContent("");
        setEditReviewError("");
      } else {
        console.error("Failed to save edited review");
      }
    } catch (error) {
      console.error("Error saving edited review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchUserMovies();
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleCreateReview = async () => {
    if (!movieName.trim() || !movieReview.trim()) {
      setCreateReviewError("Movie name and review content cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          movieTitle: movieName,
          content: movieReview,
        }),
      });

      if (response.ok) {
    
        fetchUserMovies();
        setMovieName("");
        setMovieReview("");
        setCreateReviewError("");
      } else {
        console.error("Failed to create review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <div className="review-container">
      <div className="review-form">
        <h2>Create a New Review</h2>
        {createReviewError && <p className="error-message">{createReviewError}</p>}
        <label>
          Movie Name:
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
        </label>
        <label>
          Review:
          <textarea
            value={movieReview}
            onChange={(e) => setMovieReview(e.target.value)}
          />
        </label>
        <button onClick={handleCreateReview}>Create Review</button>
      </div>

      <div className="user-info">
        <p>Name: {user.nickname}</p>
        <p>Email: {user.email}</p>
        <p>Auth0Id: {user.sub}</p>
        <p>Email Verified: {user.email_verified?.toString()}</p>
      </div>

      <div className="movie-reviews">
        <h2>Your Movie Reviews</h2>

        {userMovies.length > 0 ? (
          <ul>
            {userMovies.map((movie) => (
              <div className="review-item" key={movie.id}>
                <h3>{movie.title}</h3>
                {movie.reviews.map((review) => (
                  <div key={review.id}>
                    {editingReviewId === review.id ? (
                      <div>
                        <textarea
                          value={editedReviewContent}
                          onChange={(e) => setEditedReviewContent(e.target.value)}
                        />
                        {editReviewError && <p className="error-message">{editReviewError}</p>}
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <p>{review.content}</p>
                        <button onClick={() => handleEditReview(review.id, review.content)}>
                          Edit Review
                        </button>
                        <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </ul>
        ) : (
          <p>No movies available.</p>
        )}
      </div>
    </div>
  );
}
