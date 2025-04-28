import React, { useState, useEffect } from "react";
import "../ProfilePage.css";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/getAllUserInfo",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setName(data.Name);
        setEmail(data.Email);
        setPhone(data.Phone_Number);
        setReviews(data.reviews || []);
        console.log(data)
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
          alert(data.message || "Profile deleted successfully!");
          window.location.href = "/"; // Redirect to home after delete
        } else {
          alert(data.message || "Failed to delete profile.");
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
          <button onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>
      <div className="profile-extra-info">
        <h2>Your Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewID}>
                <strong>Product:</strong> {review.ItemName || "Unknown Product"}<br/>
                <strong>Rating:</strong> {review.StarRating}/5<br/>
                <strong>Comment:</strong> {review.Content}
              </li>
            ))}
          </ul>
        )}

        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.orderID}>
                <strong>Order ID:</strong> {order.OrderID}<br/>
                <strong>Order Date:</strong> {order.OrderDate.slice(0,10)}<br/>
                <strong>Total Price:</strong> ${order.Price}<br/>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    
  );
};

export default ProfilePage;
