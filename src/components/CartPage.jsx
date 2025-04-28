import { useState, useEffect } from "react";
import axios from "axios";

function CartPage({ updateCartItem }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  // Fetch cart items and order info
  useEffect(() => {
    const fetchCartItemsAndOrderInfo = async () => {
      const orderID = sessionStorage.getItem("orderID") || "default_order";

      try {
        setLoading(true);
        
        // Fetch cart items
        const cartResponse = await axios.get("http://localhost:8080/api/order/items", {
          params: { orderID },
          withCredentials: true, 
        });
        setCartItems(cartResponse.data);

        // Fetch order info (total price etc.)
        const orderResponse = await axios.get("http://localhost:8080/api/orderInfo", {
          withCredentials: true,
        });
        console.log(orderResponse)
        setOrderInfo(orderResponse.data); // Save the order info

        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart items or order info:", err);
        setError("Failed to load cart data.");
        setLoading(false);
      }
    };

    fetchCartItemsAndOrderInfo();
  }, []);

  // Function to handle quantity change
  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.Quantity + delta;
  
    if (newQuantity <= 0) return;
  
    const orderID = sessionStorage.getItem("orderID") || "default_order";
  
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
  
      await refreshCartAndOrderInfo();
  
      setLoading(false);
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order.");
      setLoading(false);
    }
  };

  // Function to handle deleting an item from the cart
  const handleDeleteItem = async (itemID) => {
    const orderID = sessionStorage.getItem("orderID") || "default_order";

    try {
      setLoading(true);

     
      const response = await axios.post(
        "http://localhost:8080/api/deleteItemInOrder",
        {
          orderID: orderID,
          itemID: itemID,
        },
        { withCredentials: true }
      );

      console.log("Item deleted:", response.data);

      
      updateCartItem(itemID, 0);

      
      const cartResponse = await axios.get(
        "http://localhost:8080/api/order/items",
        { withCredentials: true }
      );

      await refreshCartAndOrderInfo();
      
      setCartItems(cartResponse.data); 
  
      setLoading(false);

      setLoading(false);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
      setLoading(false);
    }
  };

  // Helper function to refresh cart items and order info
  const refreshCartAndOrderInfo = async () => {
    const orderID = sessionStorage.getItem("orderID") || "default_order";

    try {
      const cartResponse = await axios.get("http://localhost:8080/api/order/items", {
        params: { orderID },
        withCredentials: true,
      });
      setCartItems(cartResponse.data);

      const orderResponse = await axios.get("http://localhost:8080/api/orderInfo", {
        withCredentials: true,
      });
      setOrderInfo(orderResponse.data);

    } catch (err) {
      console.error("Error refreshing cart/order info:", err);
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
                  disabled={loading}
                >
                  -
                </button>
                <button
                  onClick={() => handleQuantityChange(item, 1)}  // Increase quantity
                  disabled={loading} 
                >
                  +
                </button>
              </div>

              {/* Delete Button */}
              <button
                className="delete-item-button"
                onClick={() => handleDeleteItem(item.ItemID)} 
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {/* Show order total */}
      {orderInfo && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Total Price: ${cartItems.length === 0 ? "0.00" : parseFloat(orderInfo.Price).toFixed(2)}</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <button className="checkout-button">Proceed to Checkout</button>
      )}
    </div>
  );
}

export default CartPage;
