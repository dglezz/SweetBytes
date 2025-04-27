import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import db from "./db.js";
import { getAllReviews } from "./review.mjs";
import { getItemInfoAll } from "./item.mjs";
import { register, login } from "./auth.mjs";
import * as item from "./item.mjs"

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
app.use(cors({ origin: "http://localhost:5173" })); //Frontend URL

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
app.post("/api/signup", async (req, res) => {
  const { username, name, email, phone, password } = req.body;
  try {
    console.log("Received signup request:", req.body); // 👈 ADD THIS

    await register(username, name, email, phone, password);

    res.json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error); // 👈 ADD THIS

    res.status(500).json({ message: "Signup failed." });
  }
});

app.post("/api/login", async (req, res) => {
  const { customerID, password } = req.body;

  try {
    const result = await login(customerID, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

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

// // Login endpoint
// app.post("/api/login", async (req, res) => {
//   const { customerID, password } = req.body;

//   try {
//     const loginResponse = await login(customerID, password);

//     req.session.user = customerID;
//     res.send("Logged in successfully");
//   } catch (err) {
//     res.status(401).send("Invalid credentials");
//   }
// });

// Check if the user is authenticated
app.get("/api/protected-data", (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).send("User is authenticated");
  } else {
    res.status(401).send("User is not authenticated");
  }
});

// transferring functions from the mjs files (We can't use those anymore) to be routes

// ITEMS:

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

// Gets items in stock
app.get("/api/getItemsInStock", async (req, res) => {
  try {
    const query = `
    SELECT ItemID, Name, Price, Quantity
    FROM customer_view_items_per_store
    WHERE StoreID = ?`;
    const [rows] = await db.query(query, [sID]);
    if (rows.length == 0) {
      // return null;
      res.json(null);
    }
    // return rows;
    res.json(rows);
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// ORDER:
// creates an OrderID - if its already in use, it will call itself and try to create another one (idk if the logic for this will work)
app.get("/api/getCreateOrderID", async (req, res) => {
  try {
    const curr_id = "O" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const dup_query = "SELECT * FROM CustomerOrder WHERE OrderID = ?";
    const [rows] = await db.query(dup_query, [curr_id]);
    if (rows.length === 0) {
      // return curr_id
      res.json(curr_id);
    }
    // return generateOrderID();
    res.json(generateOrderID());
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// creates a new order
app.get("/api/getCreateOrder", async (req, res) => {
  try {
    const orderID = await generateOrderID();
    const date = new Date();
    const o_query = `INSERT INTO CustomerOrder (OrderID, OrderDate, CustomerID, Price, StoreID)
    VALUES (?, ?, ?, ?, ?)`;
    await db.query(o_query, [orderID, date, customerID, 0.0, storeID]);
    // return {
    //     "message": "Order Created",
    //     "orderID": orderID
    // }
    res.json({
      message: "Order Created",
      orderID: orderID,
    });
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// updates an order - pass in the current quantity of an item (not how it has changed)
app.get("/api/getUpdateOrder", async (req, res) => {
  try {
    const o_query = `SELECT * FROM CustomerOrder WHERE OrderID = ?`;
    const [rows] = await db.query(o_query, [orderID]);
    if (rows.length === 0) {
      throw { message: "Order does not exist" };
    }

    const od_query = `SELECT * FROM OrderDetails WHERE OrderID = ? AND ItemID = ?`;
    const [od_rows] = await db.query(od_query, [orderID, itemID]);

    try {
      // if this item is not already a part of the order
      if (od_rows.length === 0) {
        const item_query = `INSERT INTO OrderDetails (OrderID, ItemID, Quantity)
        VALUES (?, ?, ?)`;
        await db.query(item_query, [orderID, itemID, quantity]);
      }

      // if this item is already in order
      else {
        const item_query = `UPDATE OrderDetails SET Quantity = ?
            WHERE OrderID = ? AND ItemID = ?`;
        await db.query(item_query, [quantity, orderID, itemID]);
      }

      // return {message: `Order ${orderID} was updated`}
      res.json({ message: `Order ${orderID} was updated` });
    } catch (err) {
      console.log(err);

      if (err.errno === 3819) {
        throw { message: "Not enough inventory" };
      }

      throw { message: "Database Error" };
    }
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// delete an item in an order
app.get("/api/deleteItemInOrder", async (req, res) => {
  try {
    const o_query = `SELECT * FROM OrderDetails WHERE OrderID = ? AND ItemID = ?`;
    const [rows] = await db.query(o_query, [orderID, itemID]);
    if (rows.length === 0) {
      throw { message: "Order/Item does not exist" };
    }

    try {
      const d_query = `DELETE FROM OrderDetails WHERE OrderID = ? AND ItemID = ?`;
      await db.query(d_query, [orderID, itemID]);
      // return {message: `Item ${itemID} deleted from Order ${orderID}`}
      res.json({ message: `Item ${itemID} deleted from Order ${orderID}` });
    } catch (err) {
      console.log(err);
      throw { message: err };
    }
  } catch (err) {
    console.error("Query error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message }); // Sending error response to frontend
  }
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// async function checkUserExists(username, badge_number) {
//   const query = "SELECT * FROM users WHERE username = ? OR badge_number = ?";
//   const [results] = await connection
//     .promise()
//     .query(query, [username, badge_number]);
//   return results.length > 0;
// }

// async function isBadgeValid(badge_number) {
//   const query = "SELECT * FROM OFFICER WHERE badge_number = ?";
//   const [results] = await connection.promise().query(query, [badge_number]);
//   return results.length > 0;
// }

// async function hashPassword(password) {
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) return reject(err);
//       resolve(hashedPassword);
//     });
//   });
// }

// async function insertUser(username, hashedPassword, badge_number) {
//   const query =
//     "INSERT INTO users (username, password, badge_number) VALUES (?, ?, ?)";
//   await connection
//     .promise()
//     .query(query, [username, hashedPassword, badge_number]);
// }

// // Initialize database connection
// const connection = mysql.createConnection({
//   host: "127.0.0.1", // Localhost (running on current machine)
//   user: "root", // Running using default root user
//   password: "", // Default XAMPP has no password
//   database: "jail", // Database name
// });

// // Connect to MySQL database
// connection.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   } else {
//     console.log("Connected to MySQL database!");
//   }
// });

// // API endpoint to fetch crime data
// app.get("/crime", (request, response) => {
//   const query = "SELECT * FROM CRIME";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       response.status(500).send("Error executing query");
//       return;
//     }
//     response.send(results);
//   });
// });

// app.post("/register", async (request, response) => {
//   const { badge_number, username, password } = request.body;

//   try {
//     // Check if user or badge number already exists
//     const userExists = await checkUserExists(username, badge_number);
//     if (userExists) {
//       return response.send([false, "User already exists"]);
//     }

//     // Check if badge number is valid
//     const badgeIsValid = await isBadgeValid(badge_number);
//     if (!badgeIsValid) {
//       return response.send([false, "Invalid badge number"]);
//     }

//     // Hash the password
//     const hashedPassword = await hashPassword(password);

//     // Insert the new user into the database with the hashed password
//     await insertUser(username, hashedPassword, badge_number);

//     // Send a success response
//     response.send([true, ""]);
//   } catch (err) {
//     console.error("Error:", err);
//     response.status(500).send("Server error");
//   }
// });

// const port = 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
