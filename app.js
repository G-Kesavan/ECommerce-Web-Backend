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

//MIDDLE WARES
app.use(express.json());
app.use(cookieParser());
app.use(cors());
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
