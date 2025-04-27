import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./components/HomePage";
import ShoppingPage from "./components/ShoppingPage";
import CartPage from "./components/CartPage";
import ItemPage from "./components/ItemPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import LocationsPage from "./components/LocationsPage";
import ProfilePage from "./components/ProfilePage";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getAllItems")
      .then((response) => {
        setItemsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find(
        (cartItem) => cartItem.ItemID === item.ItemID
      );
      if (existingItem) {
        return prevCartItems.map((cartItem) =>
          cartItem.ItemID === item.ItemID
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCartItems, { ...item, quantity: 1 }];
      }
    });
  };

  const updateCartItem = (itemId, delta) => {
    setCartItems(
      (prevCartItems) =>
        prevCartItems
          .map((cartItem) =>
            cartItem.ItemID === itemId
              ? { ...cartItem, quantity: cartItem.quantity + delta }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0) // remove if quantity becomes 0
    );
  };

  return (
    <Router>
      <Header /> {}
      <Routes>
        {/* Public Routes*/}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/item/:id"
          element={<ItemPage itemsData={itemsData} addToCart={addToCart} />}
        />
        <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/locations" element={<LocationsPage />} />

        {/* Private Routes: */}
        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
            <ProfilePage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            // <ProtectedRoute>
            <ShoppingPage itemsData={itemsData} addToCart={addToCart} />
            // </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import axios from 'axios';

// function App() {

//   // testing backend server connection to frontend
//   const [count, setCount] = useState(0);
//   const [itemsData, setItemsData] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8080/api/getAllItems')
//       .then(response => {
//         setItemsData(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching items data:', error);
//       });
//   }, []);

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>

//       <div>
//       <h1>All Items Data:</h1>
//       <ul>
//         {itemsData.map((items, index) => (
//           <li key={index}>
//             {JSON.stringify(items)}
//           </li>
//         ))}
//       </ul>
//     </div>
//     </>
//   )
// }

// export default App
