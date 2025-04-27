import { Link } from "react-router-dom";

function HomeHeader() {
  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/">SweetBytes</Link>
      </div>
      <div className="header-right">
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      </div>
    </header>
  );
}

export default HomeHeader;
