import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieSearch from "./MovieSearch";
import "../style/moviedetail.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await fetch(`${process.env.REACT_APP_API_URL}/movie-reviews/${movieId}`);
        const movieData = await movieResponse.json();
        setMovie(movieData);
        setReviews(movieData.reviews);
        setLoading(false);  // 请求完成后设置 loading 为 false

      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);  // 请求失败也需要设置 loading 为 false
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return (
    <div className="movie-reviews-container">
      <div className="movie-search-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <MovieSearch movie={movie} />
        )}
      </div>
      <h2>Reviews</h2>
      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review-item">
            <p className="content">Content: {review.content}</p>
            <p className="created-at">
              Created At: {new Date(review.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
