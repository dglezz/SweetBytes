import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Track route changes

  const [isAuth, setIsAuth] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/protected-data", {
          credentials: "include",
        });

        if (res.status === 200) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Error checking authentication", error);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [location.pathname]); // Re-run on every route change

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {}, {
        withCredentials: true,
      });

      setIsAuth(null);
      setLogoutMessage("You have been logged out.");
      setTimeout(() => {
        setLogoutMessage("");
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/">SweetBytes</Link>
      </div>
      <div className="header-right">
        <Link to="/menu">Menu</Link>
        <Link to="/shop">Shop</Link>
        {isAuth && <Link to="/cart">Cart</Link>}
        <Link to="/locations">Locations</Link>
        {isAuth === true && <Link to="/profile">Profile</Link>}
        {isAuth === false && <Link to="/login">Login</Link>}
        {isAuth === true && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
