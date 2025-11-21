const express = require("express");
const path = require("path");
const app = express();
const productsRoute = require("./Router/productRoute");
const authRoute = require("./Router/authRoute");
const paymentRoute = require("./Router/paymentRoute");
const orderRouter = require("./Router/orderRoute");
const catchError = require("./Middleware/catchError");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://project-emarket.web.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // important!
  }

  next();
});

//MIDDLE WARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://project-emarket.web.app",
    credentials: true,
  })
);
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/api/products", productsRoute);
app.use("/api/auth", authRoute);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRoute);

app.use(catchError);

module.exports = app;
