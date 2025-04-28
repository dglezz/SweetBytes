import { useState, useEffect } from "react";
import axios from "axios";

function CartPage({ updateCartItem }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all items in the cart from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      const orderID = sessionStorage.getItem("orderID") || "default_order"; // Use the actual order ID from session/cookies

      try {
        setLoading(true);
        
        // Fetch items from backend API
        const response = await axios.get("http://localhost:8080/api/order/items", {
          params: { orderID },
          withCredentials: true, // To include session information (like orderID)
        });

        setCartItems(response.data); // Set fetched items to state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load items.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []); // This effect runs once when the component mounts

  // Function to handle quantity change
  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.Quantity + delta;
  
    if (newQuantity <= 0) return; // Prevent decreasing quantity below 1
  
    const orderID = sessionStorage.getItem("orderID") || "default_order"; // Retrieve the orderID from session or use a default
  
    try {
      setLoading(true);
  
      // Send the updated quantity to the backend API
      const response = await axios.post(
        "http://localhost:8080/api/updateOrder",
        {
          orderID: orderID,
          itemID: item.ItemID,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );
  
      console.log("Order updated:", response.data);
  
      // Re-fetch the cart items from the backend to get the latest data
      const cartResponse = await axios.get(
        "http://localhost:8080/api/order/items",
        { withCredentials: true }
      );
      
      setCartItems(cartResponse.data);  // Update the frontend cart state with the latest data
  
      setLoading(false);
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order.");
      setLoading(false);
    }
  };

  // Function to handle deleting an item from the cart
  const handleDeleteItem = async (itemID) => {
    const orderID = sessionStorage.getItem("orderID") || "default_order"; // Use the actual order ID

    try {
      setLoading(true);

      // Send a request to delete the item from the order
      const response = await axios.post(
        "http://localhost:8080/api/deleteItemInOrder",
        {
          orderID: orderID,
          itemID: itemID,
        },
        { withCredentials: true }
      );

      console.log("Item deleted:", response.data);

      // Call the updateCartItem function to remove the item from frontend state
      updateCartItem(itemID, 0);  // This should remove the item from the cart state

      // Re-fetch the cart items from the backend to get the latest data
      const cartResponse = await axios.get(
        "http://localhost:8080/api/order/items",
        { withCredentials: true }
      );
      
      setCartItems(cartResponse.data);  // Update the frontend cart state with the latest data
  
      setLoading(false);

      setLoading(false);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {loading && <p>Loading cart items...</p>}
      {error && <p>{error}</p>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={`/images/${item.Picture}`} alt={item.ItemName} />
            <div className="cart-item-info">
              <h3>{item.ItemName}</h3>
              <p>${parseFloat(item.Price).toFixed(2)}</p>
              <p>Quantity: {item.Quantity}</p>

              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item, -1)}  // Decrease quantity
                  disabled={loading}  // Disable button while loading
                >
                  -
                </button>
                <button
                  onClick={() => handleQuantityChange(item, 1)}  // Increase quantity
                  disabled={loading}  // Disable button while loading
                >
                  +
                </button>
              </div>

              {/* Delete Button */}
              <button
                className="delete-item-button"
                onClick={() => handleDeleteItem(item.ItemID)} // Call the handleDeleteItem function
                disabled={loading}  // Disable button while loading
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <button className="checkout-button">Proceed to Checkout</button>
      )}
    </div>
  );
}

export default CartPage;
