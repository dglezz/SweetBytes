import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RemoveButton.css";


function CartPage({ updateCartItem }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await axios.get("http://localhost:8080/api/protected-data", {
          withCredentials: true,
        });

        if (authRes.status !== 200) {
          setIsAuth(false);
          return;
        }

        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
        return;
      }

      const orderID = sessionStorage.getItem("orderID") || "default_order";

      try {
        setLoading(true);

        const cartResponse = await axios.get("http://localhost:8080/api/order/items", {
          params: { orderID },
          withCredentials: true,
        });
        setCartItems(cartResponse.data);

        const orderResponse = await axios.get("http://localhost:8080/api/orderInfo", {
          withCredentials: true,
        });
        setOrderInfo(orderResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart items or order info:", err);
        setError("Failed to load cart data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.Quantity + delta;
    if (newQuantity <= 0) return;

    const orderID = sessionStorage.getItem("orderID") || "default_order";

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/updateOrder",
        {
          orderID: orderID,
          itemID: item.ItemID,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      await refreshCartAndOrderInfo();
      setLoading(false);
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order.");
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemID) => {
    const orderID = sessionStorage.getItem("orderID") || "default_order";

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/deleteItemInOrder",
        {
          orderID: orderID,
          itemID: itemID,
        },
        { withCredentials: true }
      );

      updateCartItem(itemID, 0);
      await refreshCartAndOrderInfo();

      setLoading(false);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
      setLoading(false);
    }
  };

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

  const handleProceedToCheckout = () => {
    navigate("/checkout-success", {
      state: {
        orderID: orderInfo?.OrderID || "Unknown Order",
        price: orderInfo?.Price || 0,
      },
    });
  };

  if (isAuth === null || loading) {
    return <div>Loading cart items...</div>;
  }

  if (isAuth === false) {
    navigate("/login");
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
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
                <button onClick={() => handleQuantityChange(item, -1)} disabled={loading}>
                  -
                </button>
                <button onClick={() => handleQuantityChange(item, 1)} disabled={loading}>
                  +
                </button>
              </div>

              <button
                className="remove-button"
                onClick={() => handleDeleteItem(item.ItemID)}
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {orderInfo && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Total Price: ${cartItems.length === 0 ? "0.00" : parseFloat(orderInfo.Price).toFixed(2)}</p>
        </div>
      )}

      {cartItems.length > 0 && (
        <button className="checkout-button" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}

export default CartPage;
