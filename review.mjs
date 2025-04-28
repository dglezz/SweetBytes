import db from "./db.js";

// creates an ReviewID - if its already in use, it will call itself and try to create another one
const generateReviewID = async () => {
  const curr_id = "R" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const dup_query = "SELECT * FROM Review WHERE ReviewID = ?";
  const [rows] = await db.query(dup_query, [curr_id]);
  if (rows.length === 0) {
    return curr_id;
  }
  return generateReviewID();
};

const addReview = async (itemID, customerID, content, starRating) => {
  const revID = await generateReviewID();
  const r_query = `INSERT INTO Review (ReviewID, ItemID, CustomerID, Content, StarRating)
    VALUES (?, ?, ?, ?, ?)`;
  try {
    await db.query(r_query, [revID, itemID, customerID, content, starRating]);
    console.log(customerID)
    return {
      message: "Review Added",
      reviewID: revID,
    };
  } catch (err) {
    console.log(err);
    throw {
      message: "error",
      error: err,
    };
  }
};

const deleteReview = async (revID, customerID) => {
  const r_query = `SELECT * FROM Review WHERE ReviewID = ?`;
  const [rows] = await db.query(r_query, [revID]);
  if (rows[0]["CustomerID"] !== customerID) {
    throw({message: "User is not authorized to delete this review"})
  }
  if (rows.length === 0) {
    throw ({ message: "Review does not exist" });
  }

  try {
    const d_query = `DELETE FROM Review WHERE ReviewID = ?`;
    await db.query(d_query, [revID]);
    return { message: `Review ${revID} was deleted` };
  } catch (err) {
    throw { message: err };
  }
};

const getReviewsByCustomer = async (customerID) => {
  const r_query = `SELECT r.*, i.ItemName FROM Review r
  INNER JOIN Item i
  ON r.ItemID = i.ItemID
  WHERE CustomerID = ?`;
  const [rows] = await db.query(r_query, [customerID]);
  return rows;
};

// gets reviews for an item
const getItemReviews = async (itemID) => {
  const r_query = "SELECT * FROM Review WHERE ItemID = ?";
  const [rows] = await db.query(r_query, [itemID]);
  return rows;
};

const getAllReviews = async () => {
  const [rows] = await db.query("SELECT * FROM Review");
  return rows;
};

export {
  getItemReviews,
  addReview,
  deleteReview,
  getReviewsByCustomer,
  getAllReviews,
};
