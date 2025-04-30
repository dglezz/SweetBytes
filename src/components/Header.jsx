import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function Header() {
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState(""); 


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/protected-data", {
          credentials: "include",
        });

        if (res.status === 200) {
          setIsAuth(true); // User is authenticated
        } else {
          setIsAuth(false); // User is not authenticated
        }
      } catch (error) {
        console.error("Error checking authentication", error);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);


  // const handleLogout = async () => {
  //   try {
  //     await axios.post("http://localhost:8080/api/logout");
  //     setUser(null); // clear user from local state
  //     navigate("/login"); // redirect to login page
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {
        credentials: "include",
      });
      setIsAuth(null);
      setLogoutMessage("You have been logged out."); // show message
      setTimeout(() => {
        setLogoutMessage(""); // clear after a few seconds (optional)
        navigate("/login");   // redirect after message
      }, 1000); // 1 second delay
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
        {<Link to="/menu">Menu</Link>}
        {<Link to="/shop">Shop</Link>}
        {isAuth && <Link to="/cart">Cart</Link>}
        <Link to="/locations">Locations</Link>
        {isAuth==true && <Link to ="/profile">Profile</Link>}
        {isAuth==false && <Link to ="/login">Login</Link>}
        {isAuth==true && <button onClick={handleLogout} className="logout-button">
              Logout
          </button>}
      </div>
      
    </header>
  );
}

export default Header;
