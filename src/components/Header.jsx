import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/">SweetBytes</Link>
      </div>
      <div className="header-right">
        <Link to="/shop">Shop</Link>
        <Link to="/account">Account</Link>
      </div>
    </header>
  );
}

export default Header;
