import db from "./db.js";
import { getItemReviews } from "./review.mjs";

// Functions that help with item information

// Gets ingredient Info
const ingredientInfo = async (itemID) => {
  const ing_query = "call itemIngredients(?)";
  const [rows] = await db.query(ing_query, [itemID]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

// Gets Nutritional Info
const nutrInfo = async (itemID) => {
  const nutr_query = "SELECT * FROM NutritionalInfo WHERE ItemID = ?";
  const [rows] = await db.query(nutr_query, [itemID]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

// Gets basic item info - Name and Price
const getItemInfo = async (itemID) => {
  const i_query = "SELECT * FROM Item WHERE ItemID = ?";
  const [rows] = await db.query(i_query, [itemID]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

// Gets item info + ingredients + nutrional info + reviews
const getItemInfoAll = async (itemID) => {
  const itemInfo = await getItemInfo(itemID);
  if (!itemInfo) {
    return null;
  }

  const ingredients = await ingredientInfo(itemID);
  const nutr = await nutrInfo(itemID);
  const rev = await getItemReviews(itemID);
  return {
    ...itemInfo,
    ingredients: ingredients,
    nutrInfo: nutr,
    reviews: rev,
  };
};

// Gets basic item info for all items
const getAllItems = async () => {
  const [rows] = await db.query("SELECT * FROM Item");
  return rows;
};

const getItemsInStock = async () => {
  const [rows] = await db.query("SELECT * FROM customer_view");
  if (rows.length == 0) {
    return null;
  }
  return rows;
};

export { getItemInfo, getItemInfoAll, getItemsInStock, getAllItems };
