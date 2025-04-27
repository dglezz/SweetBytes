import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [user, setUser] = useState(null);

  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/">SweetBytes</Link>
      </div>
      <div className="header-right">
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>

        {user ? <span>Hi, {user.name}!</span> : <Link to="/login">Login</Link>}
        <Link to="/locations">Locations</Link>
      </div>
    </header>
  );
}

export default Header;
