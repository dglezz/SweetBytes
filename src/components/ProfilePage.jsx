import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfilePage.css";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const authResponse = await fetch("http://localhost:8080/api/protected-data", {
          credentials: "include",
        });
        console.log(authResponse)
        if (authResponse.status !== 200) {
          navigate("/login");
          return;
        }

        const profileResponse = await fetch("http://localhost:8080/api/getAllUserInfo", {
          credentials: "include",
        });
        const data = await profileResponse.json();
        setName(data.Name);
        setEmail(data.Email);
        setPhone(data.Phone_Number);
        setReviews(data.reviews || []);
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error checking auth or fetching profile:", error);
        navigate("/login");
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/updateUserInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Changes saved successfully!");
      } else {
        alert(data.message || "Failed to save changes.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  const handleClear = () => {
    setEmail("");
    setPhone("");
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("http://localhost:8080/api/deleteUser", {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message || "Account deleted successfully!");
          window.location.href = "/";
        } else {
          alert(data.message || "Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Error deleting profile.");
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Account Page</h2>
      <div className="profile-box">
        <div className="profile-icon">👤</div>
        <h1 className="profile-name">{name || "Loading..."}</h1>

        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="profile-buttons">
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={handleClear}>Clear All</button>
          <button onClick={handleDelete}>Delete Account</button>
        </div>
      </div>

      <div className="profile-extra-info">
        <div className="info-columns">
          <div className="reviews-section">
            <h2>Your Reviews</h2>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ul>
                {reviews.map((review) => (
                  <li key={review.reviewID}>
                    <strong>Product:</strong> {review.ItemName || "Unknown Product"}<br />
                    <strong>Rating:</strong> {review.StarRating}/5<br />
                    <strong>Comment:</strong> {review.Content}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="orders-section">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order.orderID}>
                    <strong>Order ID:</strong> {order.OrderID}<br />
                    <strong>Order Date:</strong> {order.OrderDate.slice(0, 10)}<br />
                    <strong>Total Price:</strong> ${order.Price}<br />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;