import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../MenuItemPage.css";

function MenuPage() {
  const [itemsData, setItemsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getAllItems")
      .then((response) => {
        setItemsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  // Filter items based on the search 
  const filteredItems = itemsData.filter((item) =>
    item.ItemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shopping-page">
      <h2 className="shopping-title">All Items</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for an item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <br></br>
      <br></br>

      {/* Item grid */}
      <div className="shopping-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.ItemID} className="shopping-item">
              <Link to={`/menu-item/${item.ItemID}`} className="item-link">
                <img src={`/images/${item.Picture}`} alt={item.ItemName} />
                <h3>{item.ItemName}</h3>
                <p>${parseFloat(item.Price).toFixed(2)}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No items match your search.</p>
        )}
      </div>
    </div>
  );
}

export default MenuPage;
