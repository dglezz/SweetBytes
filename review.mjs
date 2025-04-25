import db from "./db.mjs"

// creates an ReviewID - if its already in use, it will call itself and try to create another one
const generateReviewID = async() => {
    const curr_id = "R" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const dup_query = "SELECT * FROM Review WHERE ReviewID = ?";
    const [rows] = await db.query(dup_query, [curr_id])
    if (rows.length === 0) {
        return curr_id
    }
    return generateReviewID()
}

const addReview = async (itemID, customerID, content, starRating) => {
    const revID = await generateReviewID()
    const r_query = `INSERT INTO Review (ReviewID, ItemID, CustomerID, Content, StarRating)
    VALUES (?, ?, ?, ?, ?)`
    try {
        await db.query(r_query, [revID, itemID, customerID, content, starRating])
        return {
            "message": "Review Added",
            "reviewID": revID
        }
    }
    catch (err) {
        console.log(err)
        throw {
            "message": "error",
            "error": err
        }
    }
}

const getReviewsByCustomer = async (customerID) => {
    const r_query = "SELECT * FROM Review WHERE CustomerID = ?"
    const [rows] = await db.query(r_query, [customerID])
    return rows
}

// gets reviews for an item
const getItemReviews = async (itemID) => {
    const r_query = "SELECT * FROM Review WHERE ItemID = ?"
    const [rows] = await db.query(r_query, [itemID])
    return rows
}

export {
    getItemReviews,
    addReview,
    getReviewsByCustomer
}