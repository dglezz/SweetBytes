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
