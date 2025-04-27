function CartPage({ cartItems, updateCartItem }) {
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={`/images/${item.Picture}`} alt={item.ItemName} />
            <div className="cart-item-info">
              <h3>{item.ItemName}</h3>
              <p>${parseFloat(item.Price).toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>

              <div className="quantity-controls">
                <button onClick={() => updateCartItem(item.ItemID, -1)}>
                  -
                </button>
                <button onClick={() => updateCartItem(item.ItemID, 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <button className="checkout-button">Proceed to Checkout</button>
      )}
    </div>
  );
}

export default CartPage;
