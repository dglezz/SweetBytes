import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import db from "./db.js";
import { getAllReviews } from "./review.mjs";
import { getItemInfoAll } from "./item.mjs";
import { register, login } from "./auth.mjs";
import * as item from "./item.mjs";
import * as order from "./order.mjs";
import * as cust from "./customer.mjs";
import * as review from "./review.mjs";
import * as store from "./store.mjs";

// Initialize an Express app
const app = express();
app.use(express.json());

// Use session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

// Allow resource sharing (allow calls to backend from certain URLs)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); //Frontend URL

// Gets basic item info for all items
app.get("/api/getAllItems", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Item");
    console.log("Items:", rows);
    res.json(rows); // Sending response to frontend
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

app.get("/api/getReviews", async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// AUTH
// User signup
app.post("/api/signup", async (req, res) => {
  const { customerID, name, email, phone, password } = req.body;
  try {
    console.log("Received signup request:", req.body);

    await register(customerID, name, email, phone, password);

    res.json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({ message: "Signup failed." });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { customerID, password } = req.body;

  try {
    const loginResponse = await login(customerID, password);

    req.session.user = customerID;
    console.log(req.session.user)
    res.send("Logged in successfully");
  } catch (err) {
    res.status(401).send("Invalid credentials");
  }
});

// Check if the user is authenticated
app.get("/api/protected-data", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).send("User is authenticated");
  } else {
    res.status(401).send("User is not authenticated");
  }
});

// ITEMS:

// get info on an item
app.get("/api/items/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    const itemData = await getItemInfoAll(itemId);
    res.json(itemData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving item details");
  }
});

// get basic info for all items
app.get("api/allItems", async (req, res) => {
  try {
    const result = await item.getAllItems();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving items");
  }
});

// Gets items in stock
app.get("/api/getItemsInStock", async (req, res) => {
  const storeID = req.session.storeID;

  if (!storeID) {
    return res.status(401).json({ message: "No store selected" });
  }

  try {
    const items = await item.getItemsInStock(storeID);
    res.json(items);
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// ORDER:
// creates a new order
app.post("/api/createOrder", async (req, res) => {
  try {
    const result = await order.createOrder(
      req.session.user,
      req.session.storeID
    );
    req.session.orderID = result["orderID"];
    res.json({
      result: result,
    });
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// updates an order - pass in the current quantity of an item (not how it has changed)
app.post("/api/updateOrder", async (req, res) => {
  try {
    const { orderID, quantity } = req.body;
    const result = await order.updateOrder(orderID, req.session.user, quantity);
    res.json({ message: result });
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// delete an item in an order
app.post("/api/deleteItemInOrder", async (req, res) => {
  try {
    const { orderID, itemID } = req.body;
    const result = order.deleteItemInOrder(orderID, itemID);
    res.json({ result });
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// get all items in an order
app.get("/api/order/items", async (req, res) => {
  const orderID = req.session.orderID;

  try {
    const items = await order.getAllItemsInOrder(orderID);

    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this order." });
    }

    res.json(items);
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ message: "Error retrieving items for the order." });
  }
});

//get all orders by a user
app.get("api/user/orders", async (req, res) => {
  const customerID = req.session.user;

  try {
    const orders = await order.getOrdersByCustomer(customerID);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders", error);
    res.status(500).json({ message: "Error retrieving user orders" });
  }
});

// CUSTOMER
// Get customer info
app.get("/api/getUserInfo", async (req, res) => {
  const customerID = req.session.user;

  try {
    const result = cust.getCustomerInfo(customerID);

    res.json(result);
  } catch (error) {
    console.error("Error Fetching User Info", error);
    res.status(500).json({ message: "Error retrieving user info" });
  }
});

// Get all customer info
app.get("/api/getAllUserInfo", async (req, res) => {
  const customerID = req.session.user;

  try {
    const result = await cust.getAllCustomerInfo(customerID);

    res.json(result);
  } catch (error) {
    console.error("Error Fetching User Info All", error);
    res.status(500).json({ message: "Error retrieving user info all" });
  }
});

app.post("/api/updateUserInfo", async (req, res) => {
  const customerID = req.session.user;

  const { email, phone } = req.body;

  try {
    await cust.updateCustomerInfo(customerID, email, phone);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user info", error);
    res.status(500).json({ message: "Failed to update user info" });
  }
});

app.delete("/api/deleteUser", async (req, res) => {
  const customerID = req.session.user;

  try {
    await cust.deleteCustomer(customerID);
    req.session.destroy();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// REVIEW

// Add a review
app.post("/api/review", async (req, res) => {
  const { itemID, content, starRating } = req.body;
  const customerID = req.session.user;

  if (!itemID || !content || !starRating) {
    return res.status(400).json({
      message: "Missing required fields: itemID, content, starRating",
    });
  }

  try {
    const result = await review.addReview(
      itemID,
      customerID,
      content,
      starRating
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review" });
  }
});

// Delete a review
app.delete("/api/review/:revID", async (req, res) => {
  const { revID } = req.params;
  const customerID = req.session.user;

  try {
    const result = await review.deleteReview(revID, customerID);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

// STORE

// set a store location
app.post("/api/setStore", async (req, res) => {
  try {
    const {storeID} = req.params
    req.session.storeID = storeID
    res.json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Error setting store:", error)
    res.status(500).json({message: "Error setting store"})
  }
  
})

// get all the stores
app.get("/api/getAllStores", async (req, res) => {
  try {
    const result = await store.getAllStores();
    res.json(result);
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// get individual store info
app.get("/api/store/:storeID", async (req, res) => {
  const storeID = req.params.storeID;
  try {
    const storeInfo = await store.getStoreInfo(storeID);
    res.json(storeInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving item details");
  }
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
