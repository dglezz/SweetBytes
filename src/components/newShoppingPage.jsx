import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ShoppingPage({ addToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get("http://localhost:8080/api/getItemsInStock", {
          withCredentials: true,
        });

        if (response.data !== null) {
          setItems(response.data);
          console.log(response.data)
        } else {
          setItems([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items");
        setLoading(false); 
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Add to cart and update the order on the backend
  const handleAddToCart = async (item) => {
    const orderID = sessionStorage.getItem("orderID") || "default_order";

    try {
      const response = await axios.post("http://localhost:8080/api/updateOrder", {
        orderID: orderID,
        itemID: item.ItemID,
        quantity: 1,
      }, { withCredentials: true });

      console.log("Order updated:", response.data);
      addToCart(item);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  return (
    <div className="shopping-page">
      <h2 className="shopping-title">All Items</h2>
      <div className="shopping-grid">
        
        {items.length === 0 ? (
        <p>This store is sold out of everything!</p>
        ) : (items.map((item) => (
          <div key={item.ItemID} className="shopping-item">
            <Link to={`/item/${item.ItemID}`} className="item-link">
              <img src={`/images/${item.Picture}`} alt={item.ItemName} />
              <h3>{item.ItemName}</h3>
              <p>${parseFloat(item.Price).toFixed(2)}</p>
            </Link>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>)
        ))}
      </div>
    <br></br>
    <br></br>
    <div>
        <Link to='/select-location'>
        <button classname="add-to-cart-button">
            Pick a New Location
        </button>
        </Link>
    </div>
    </div>
  );
}

export default ShoppingPage;
