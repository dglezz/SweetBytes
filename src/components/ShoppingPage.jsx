import { Link } from "react-router-dom";

function ShoppingPage({ itemsData }) {
  return (
    <div className="shopping-page">
      <h2>All Items</h2>
      <div className="items-grid">
        {itemsData.map((item) => (
          <div key={item.ItemID} className="item-card">
            <img src={`/images/${item.Picture}`} alt={item.ItemName} />
            <h3>{item.ItemName}</h3>
            <p>${parseFloat(item.Price).toFixed(2)}</p>
            <Link to={`/item/${item.ItemID}`}>
              <button>Add to Cart</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShoppingPage;
