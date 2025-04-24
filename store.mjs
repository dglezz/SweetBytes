import db from "./db.js"

const getAllStores = async () => {
    const l_query = `SELECT * FROM Store`
    const [rows] = db.query(l_query)
    return rows
}

const getStoreInfo = async (storeID) => {
    const l_query = `SELECT * FROM Store WHERE StoreID = ?`
    const [rows] = db.query(l_query, storeID)
    return rows
}

export {
    getAllStores,
    getStoreInfo
}