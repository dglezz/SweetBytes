import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ItemPage({ addToCart }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  const [reviewContent, setReviewContent] = useState("");
  const [starRating, setStarRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchItem = () => {
    axios
      .get(`http://localhost:8080/api/items/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
        setError("Failed to load item");
      });
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!reviewContent.trim()) {
      alert("Review cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`http://localhost:8080/api/review`, {
        itemID: id, // capital ID to match server
        content: reviewContent,
        starRating: starRating,
      });

      alert("Review submitted!");
      setReviewContent("");
      setStarRating(5);
      fetchItem(); // refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!item) return <h2>Loading...</h2>;

  return (
    <div className="item-page">
      <div className="item-top">
        <img src={`/images/${item.Picture}`} alt={item.ItemName} />
        <div className="item-info">
          <h2>{item.ItemName}</h2>

          <p>
            <strong>Price: ${parseFloat(item.Price).toFixed(2)}</strong>
          </p>
          <button
            className="add-to-cart-button"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>

          <h3>Nutritional Information</h3>
          {item.nutrInfo ? (
            <>
              <p>Calories: {item.nutrInfo.Calories}</p>
              <p>Fat: {item.nutrInfo.Fat}</p>
              <p>Carbs: {item.nutrInfo.Carbs}</p>
              <p>Protein: {item.nutrInfo.Protein}</p>
            </>
          ) : (
            <p>Nutrition info not available</p>
          )}

          <h4>Ingredients / Allergens</h4>
          {item.ingredients ? (
            <ul>
              {item.ingredients.map((ing, i) => (
                <li key={i}>{ing.Name || ing}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients info</p>
          )}
        </div>
      </div>

      <div className="reviews">
        <h3>Reviews</h3>
        {item.reviews && item.reviews.length > 0 ? (
          item.reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <p>
                <strong>{rev.CustomerID || "User"}</strong>
              </p>
              <p>{"★".repeat(Math.round(rev.StarRating))}</p> {/* safer now */}
              <p>{rev.Content}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* New Add Review Section */}
        <div className="add-review-section">
          <h4>Add a Review</h4>
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            cols={50}
          />
          <br />
          <label>
            Star Rating:
            <select
              value={starRating}
              onChange={(e) => setStarRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button
            onClick={handleReviewSubmit}
            className="submit-review-button"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemPage;
