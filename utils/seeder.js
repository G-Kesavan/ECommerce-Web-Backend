const products = require("../data/products.json");
const Product = require("../Model/productModel");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("../Config/dataBase");

dotenv.config({ path: path.join(__dirname, "..", "Config", "config.env") });
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Delete all Products");
    await Product.insertMany(products);
    console.log("All Products is added");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();
