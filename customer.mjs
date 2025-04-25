import db from "./db.js"
import { getOrdersByCustomer } from "./order.mjs"
import { getReviewsByCustomer } from "./review.mjs"

// Basic Customer Info
const getCustomerInfo = async (customerID) => {
    const c_query = `SELECT * FROM Customer WHERE CustomerID = ?`
    const [rows] = await db.query(c_query, [customerID])
    if (rows.length === 0) {return null}
    return rows[0]
}

// Get CustomerInfo + Reviews + Orders
const getAllCustomerInfo = async (customerID) => {
    const custInfo = await getCustomerInfo(customerID)
    if (custInfo === null) {return null}
    const ords = await getOrdersByCustomer(customerID)
    const revs = await getReviewsByCustomer(customerID)
    return {
        ...custInfo,
        "orders": ords,
        "reviews": revs
    }
}

export {
    getCustomerInfo,
    getAllCustomerInfo
}
