import { useLocation, useNavigate } from "react-router-dom";

function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderID, price } = location.state || {};

  const handleNewOrder = () => {
    // Redirect to select-location page
    navigate("/select-location");
  };

  return (
    <div className="checkout-success-page">
      <h1>Thank You for Your Order!</h1>
      <p>Order Number: <strong>{orderID}</strong></p>
      <p>Total Paid: <strong>${parseFloat(price).toFixed(2)}</strong></p>

      <button className="new-order-button" onClick={handleNewOrder}>
        Place New Order
      </button>
    </div>
  );
}

export default CheckoutSuccessPage;