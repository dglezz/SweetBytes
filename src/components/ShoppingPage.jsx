import { Link } from "react-router-dom";

function ShoppingPage({ itemsData, addToCart }) {
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
                addToCart(item);
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
