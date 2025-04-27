import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcrypt";
import db from "./db.js";
import { getAllReviews } from "./review.mjs";
import { getItemInfoAll } from "./item.mjs";
import { login } from "./auth.mjs";

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


// Login endpoint
app.post("/api/login", async (req, res) => {
  const { customerID, password } = req.body;

  try {
    const loginResponse = await login(customerID, password);

    req.session.user = customerID;
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
