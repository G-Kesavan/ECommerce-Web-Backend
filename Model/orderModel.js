const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phonNo: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "prodect",
      },
    },
  ],
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paidAt: {
    type: Date,
  },
  delivereAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paymentInfo: {
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
});

let orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
