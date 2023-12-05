import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieSearch from "./MovieSearch";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await fetch(`${process.env.REACT_APP_API_URL}/movie-reviews/${movieId}`);
        const movieData = await movieResponse.json();
        setMovie(movieData);
        setReviews(movieData.reviews)

      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return (
    <div>
      <MovieSearch movie={movie }/>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>Content: {review.content}</p>
            <p>Created At: {new Date(review.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
