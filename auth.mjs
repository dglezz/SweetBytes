import bcrypt from 'bcryptjs';
import db from "./db.js";


// function to register
const register = async (customerID, name, email, phone, password) => {
  
    if (password.length <= 8) {
      throw({message: 'PASSWORD TOO SHORT'});
    }
  
    const dup_query = "SELECT * FROM Customer WHERE CustomerID = ?";
    try {
        const [rows] = await db.query(dup_query, [customerID])
        if (rows.length !== 0) {
            throw({message: 'USERNAME ALREADY EXISTS'});
        }

        // adds new user to database
        const hash = bcrypt.hashSync(password);
        const ins_query = `INSERT INTO 
        Customer (CustomerID, Name, Email, Phone_Number, Cust_Password)
        VALUES (?, ?, ?, ?, ?)`;
        await db.query(ins_query, [customerID, name, email, phone, hash]);
        const fullNameNoSpaces = name.replace(/\s+/g, '').toLowerCase();
        await db.query(`CREATE USER '${fullNameNoSpaces}'@'%' IDENTIFIED BY '${password}'`);
        await db.query(`GRANT ROLE customer_role TO '${fullNameNoSpaces}'@'%'`);
        const viewCustDetails = `
        CREATE VIEW \`${fullNameNoSpaces}_view_cust_details\` AS
        SELECT * FROM Customer
        WHERE CustomerID = ?
        `;
        await db.query(viewCustDetails, [customerID]);
        const viewReviews = `
        CREATE VIEW \`${fullNameNoSpaces}_view_review\` AS
        SELECT * FROM Review
        WHERE CustomerID = ?
        `;
        await db.query(viewReviews, [customerID]);
        const viewOrderDetails = `
        CREATE VIEW \`${fullNameNoSpaces}_view_order_details\` AS
        SELECT o.*, od.*, i.*
        FROM CustomerOrder o
        INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
        INNER JOIN Item i ON od.ItemID = i.ItemID
        WHERE o.CustomerID = ?
        `;
        await db.query(viewOrderDetails, [customerID]);
    }

    catch (err) {
        console.log(err)
        throw err;
    }

    return {message: "User created!"}
    
};


//function to login
const login = async (customerID, password) => {
    const log_query = "SELECT * FROM Customer WHERE CustomerID = ?"
    const [rows] = await db.query(log_query, [customerID])
    if (rows.length === 0 || !(bcrypt.compareSync(password, rows[0].Cust_Password))) {
        throw({message: "USERNAME OR PASSWORD IS NOT CORRECT"});
    }

    return {message: "login successful"}
}

export {
    register,
    login
}
