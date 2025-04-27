import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getReviews")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  return (
    <div className="home">
      <h1>Sweet Bytes</h1>
      <p>Sweeten your day, one byte at a time!</p>
      <img
        src="/images/donuts.jpeg"
        alt="Donuts Banner"
        className="home-banner"
      />
      <h2 style={{ marginTop: "40px" }}>Read what our customers had to say!</h2>

      <div className="review-grid">
        {reviews.slice(0, 6).map((review) => (
          <div key={review.ReviewID} className="review-card">
            <h3>
              ⭐ <span style={{ fontWeight: "bold" }}>{review.StarRating}</span>
            </h3>
            <p>{review.Content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
