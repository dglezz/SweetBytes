import React, { useState, useEffect } from "react";
import "../ProfilePage.css";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = () => {
    alert("Changes saved!");
  };

  const handleClear = () => {
    setEmail("");
    setPhone("");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      alert("Profile deleted!");
    }
  };

  return (
    <div className="profile-container">
      <h2>Account Page</h2>
      <div className="profile-box">
        <div className="profile-icon">👤</div>
        <h1 className="profile-name">{name || "Loading..."}</h1> {}
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
    </div>
  );
};

export default ProfilePage;
