const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "pleace enter the product name"],
    trim: true,
    maxLength: [100, "pleace enter only 100 characters"],
  },
  price: {
    type: Number,
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "plece enter the decription"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "pleace enter product category"],
    enum: {
      values: [
        "Electronics",
        "Mobile Phone",
        "Laptop",
        "Accessories",
        "Headphones",
        "Bike",
        "Food",
        "Books",
        "ClothesShoes",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "pleace select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "pleace enter seller"],
  },
  stock: {
    type: Number,
    required: [true, "pleace enter stock"],
    maxLength: [20, "pleace stock connot exceed 20"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: {
        type: String,
        required: [true, "pleace enter the rating"],
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let schema = mongoose.model("product", productSchema);

module.exports = schema;
