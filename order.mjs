import db from "./db.js"

// creates an OrderID - if its already in use, it will call itself and try to create another one
const generateOrderID = async() => {
    const curr_id = "O" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const dup_query = "SELECT * FROM CustomerOrder WHERE OrderID = ?";
    const [rows] = await db.query(dup_query, [curr_id])
    if (rows.length === 0) {
        return curr_id
    }
    return generateOrderID()
}

// creates a new order
const createOrder = async (customerID, storeID) => {
    const orderID = await generateOrderID();
    const date = new Date();
    const o_query = `INSERT INTO CustomerOrder (OrderID, OrderDate, CustomerID, Price, StoreID)
    VALUES (?, ?, ?, ?, ?)`
    await db.query(o_query, [orderID, date, customerID, 0.00, storeID]);
    return {
        "message": "Order Created",
        "orderID": orderID
    }
}

// updates an order - pass in the current quantity of an item (not how it has changed)
const updateOrder = async (orderID, itemID, quantity) => {
    const o_query = `SELECT * FROM CustomerOrder WHERE OrderID = ?`
    const [rows] = await db.query(o_query, [orderID])
    if (rows.length === 0) {
        throw({message: "Order does not exist"});
    }

    const od_query = `SELECT * FROM OrderDetails WHERE OrderID = ? AND ItemID = ?`
    const [od_rows] = await db.query(od_query, [orderID, itemID])

    try {

        // if this item is not already a part of the order
        if (od_rows.length === 0) {
        const item_query = `INSERT INTO OrderDetails (OrderID, ItemID, Quantity)
        VALUES (?, ?, ?)`
        await db.query(item_query, [orderID, itemID, quantity])
        }

        // if this item is already in order
        else {
            const item_query = `UPDATE OrderDetails SET Quantity = ?
            WHERE OrderID = ? AND ItemID = ?`
            await db.query(item_query, [quantity, orderID, itemID])
        }

        return {message: `Order ${orderID} was updated`}
    } 
    
    catch (err) {
        
        console.log(err)

        if (err.errno === 3819) {
            throw {message: "Not enough inventory"}
        }

        throw {message: "Database Error"}
    }
    

}

// returns all items in an order
const getAllItemsInOrder = async (orderID) => {
    const o_query = `SELECT i.ItemID, i.ItemName, i.Price, od.Quantity FROM CustomerOrder o
    INNER JOIN OrderDetails od
    ON o.OrderID = od.OrderID
    INNER JOIN Item i
    ON od.ItemID = i.ItemID
    WHERE o.OrderID = ?`
    const [rows] = await db.query(o_query, [orderID])
    return rows
}

const getOrdersByCustomer = async (customerID) => {
    const c_query = `SELECT * FROM CustomerOrder WHERE CustomerID = ?`
    const [rows] = await db.query(c_query, [customerID])
    if (rows.length === 0) {return null}
    return rows
}

export {
    createOrder,
    updateOrder,
    getAllItemsInOrder,
    getOrdersByCustomer
}