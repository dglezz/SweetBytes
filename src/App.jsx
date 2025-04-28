import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import SelectLocation from "./components/SelectLocation";
import MenuPage from "./components/Menu";
import MenuItemPage from "./components/MenuItemPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { OrderProvider } from "./components/OrderContext"; // <-- ADDED
import "./index.css";

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
    setCartItems((prevCartItems) =>
      prevCartItems
        .map((cartItem) =>
          cartItem.ItemID === itemId
            ? { ...cartItem, quantity: cartItem.quantity + delta }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  return (
    <OrderProvider> 
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/item/:id"
            element={<ItemPage itemsData={itemsData} addToCart={addToCart} />}
          />
          <Route path="/cart" element={<CartPage cartItems={cartItems} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/select-location" element={<SelectLocation />} />
          <Route
            path="/shopping"
            element={<ShoppingPage itemsData={itemsData} addToCart={addToCart} />}
          />
          <Route path="/menu-item/:id" element={<MenuItemPage />} />

          {/* Private Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShoppingPage itemsData={itemsData} addToCart={addToCart} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </OrderProvider>
  );
}

export default App;
