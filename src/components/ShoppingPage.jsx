import { Link } from "react-router-dom";
import { useOrder } from "./OrderContext"; 

function ShoppingPage({ itemsData, addToCart }) {
  const { orderInfo } = useOrder(); 

  const handleAddToCart = async (item) => {
    addToCart(item); // 1. Add it to frontend cart

    // 2. Send update to backend
    if (orderInfo && orderInfo.orderId) {
      try {
        await fetch("http://localhost:8080/api/updateOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify({
            orderID: orderInfo.orderId,
            quantity: 1, // we need to figure out how to get this value 
          }),
        });
      } catch (err) {
        console.error("Failed to update order:", err);
      }
    } else {
      console.error("No orderID found - cannot update order");
    }
  };

  return (
    <div className="shopping-page">
      <h2 className="shopping-title">All Items</h2>
      <div className="shopping-grid">
        {itemsData.map((item) => (
          <div key={item.ItemID} className="shopping-item">
            <Link to={`/item/${item.ItemID}`} className="item-link">
              <img src={`/images/${item.Picture}`} alt={item.ItemName} />
              <h3>{item.ItemName}</h3>
              <p>${parseFloat(item.Price).toFixed(2)}</p>
            </Link>
            <button
              className="add-to-cart-button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAddToCart(item); 
              }}
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
