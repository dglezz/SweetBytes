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

        setIsAuth(res.status === 200);
      } catch (error) {
        console.error("Error checking authentication", error);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Show a loading spinner or blank screen while checking
  if (isAuth === null) {
    return <div>Loading...</div>; // or a custom loading spinner
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default ProtectedRoute;