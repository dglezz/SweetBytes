import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
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

  // If not authenticated, redirect to login page
  if (isAuth === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;