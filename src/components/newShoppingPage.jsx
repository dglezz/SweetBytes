import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SearchBar.css";

function ShoppingPage({ addToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch("http://localhost:8080/api/protected-data", {
          credentials: "include",
        });
  
        if (authResponse.status !== 200) {
          navigate("/login");
          return;
        }
  
        const response = await axios.get("http://localhost:8080/api/getItemsInStock", {
          withCredentials: true,
        });
  
        if (response.data !== null) {
          setItems(response.data);
          console.log(response.data);
        } else {
          setItems([]);
        }
  
        setLoading(false);
      } catch (err) {
        console.error("Error checking auth or fetching items:", err);
        setError("Failed to load items");
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);

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
      setAdding(true);
      const response = await axios.post("http://localhost:8080/api/updateOrder", {
        orderID: orderID,
        itemID: item.ItemID,
        quantity: 1,
      }, { withCredentials: true });

      console.log("Order updated:", response.data);
      addToCart(item);
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setAdding(false);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.ItemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shopping-page">
      <h2 className="shopping-title">All Items</h2>

    {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search for an item..."
          value={searchQuery}
          className = "search-bar"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <br></br>
      <br></br>

      <div className="shopping-grid">
        
      {items.length === 0 ? (
        <p>This store is sold out of everything!</p>
      ) : filteredItems.length === 0 ? (
          <p>No items match your search.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.ItemID} className="shopping-item">
              <Link to={`/item/${item.ItemID}`} className="item-link">
                <img src={`/images/${item.Picture}`} alt={item.ItemName} />
                <h3>{item.ItemName}</h3>
                <p>${parseFloat(item.Price).toFixed(2)}</p>
              </Link>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(item)}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))
        )}
      </div>
    <br></br>
    <br></br>
    <div>
        <Link to='/select-location'>
        <button className="add-to-cart-button">
            Pick a New Location
        </button>
        </Link>
    </div>
    </div>
  );
}

export default ShoppingPage;
