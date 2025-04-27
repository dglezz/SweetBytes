import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/item/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
        setError("Failed to load item");
      });
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!item) return <h2>Loading...</h2>;

  return (
    <div className="item-page">
      <div className="item-top">
        <img src={`/images/${item.Picture}`} alt={item.ItemName} />
        <div className="item-info">
          <h2>{item.ItemName}</h2>
          <p>Stock: {item.Stock ?? "N/A"}</p>
          <p>
            <strong>Price: ${parseFloat(item.Price).toFixed(2)}</strong>
          </p>
          <button>Add to Cart</button>

          <h3>Nutritional Information</h3>
          {item.nutrInfo ? (
            <>
              <p>Calories: {item.nutrInfo.Calories}</p>
              <p>Fat: {item.nutrInfo.Fat}g</p>
              <p>Carbs: {item.nutrInfo.Carbs}g</p>
              <p>Protein: {item.nutrInfo.Protein}g</p>
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
        {item.reviews.length > 0 ? (
          item.reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <p>
                <strong>{rev.CustomerID || "User"}</strong>
              </p>
              <p>{"★".repeat(rev.StarRating)}</p>
              <p>{rev.Content}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ItemPage;
