import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function MenuPage() {
    const [itemsData, setItemsData] = useState([]);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;