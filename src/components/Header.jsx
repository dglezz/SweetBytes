import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


function Header() {
  // const [user, setUser] = useState(null);

  const [isAuth, setIsAuth] = useState(null);

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
        {<Link to ="/profile">Profile</Link>}
      </div>
      
    </header>
  );
}

export default Header;
