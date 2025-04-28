import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ShoppingPage({ addToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch items from the backend when the component is mounted
  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get("http://localhost:8080/api/getItemsInStock", {
          withCredentials: true, // To include session information (like storeID)
        });

        if (response.data !== null) {
          setItems(response.data);  // Set fetched items to state
        } else {
          setItems([]);
        }
        setLoading(false);  // Set loading to false
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items");  // Set error if the request fails
        setLoading(false);  // Stop loading even if there's an error
      }
    }

    fetchItems();
  }, []); // This effect runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Add to cart and update the order on the backend
  const handleAddToCart = async (item) => {
    // Assuming you have a way to track the order ID (perhaps from the session)
    const orderID = sessionStorage.getItem("orderID") || "default_order";  // You may want to store this in session/cookies

    // Update the order in the backend
    try {
      const response = await axios.post("http://localhost:8080/api/updateOrder", {
        orderID: orderID,  // Use the actual order ID from the session or elsewhere
        itemID: item.ItemID,
        quantity: 1,  // Add 1 item to the cart for now (this can be dynamic)
      }, { withCredentials: true });

      console.log("Order updated:", response.data);
      addToCart(item);  // Update the cart in frontend state as well
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  return (
    <div className="shopping-page">
      <h2 className="shopping-title">All Items</h2>
      <div className="shopping-grid">
        {items.map((item) => (
          <div key={item.ItemID} className="shopping-item">
            <Link to={`/item/${item.ItemID}`} className="item-link">
              <img src={`/images/${item.Picture}`} alt={item.ItemName} />
              <h3>{item.ItemName}</h3>
              <p>${parseFloat(item.Price).toFixed(2)}</p>
            </Link>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(item)}  // Add to cart and update order
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShoppingPage;
