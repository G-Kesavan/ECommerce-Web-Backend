const catchAsyncError = require("../Middleware/catchAsyncError");
const Order = require("../Model/orderModel");
const Product = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return new ErrorHandler(`order not found with id : ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (orderStatus === "shipped") {
    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
    });

    return;
  }

  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("order all ready deliver"));
  }

  order.orderItems.forEach(async (orderItem) => {
    await updateStack(orderItem.product, orderItem.quantity);
  });

  order.orderStatus = orderStatus;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStack(productId, quantity) {
  const product = await Product.findById(String(productId));
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return new ErrorHandler(`order not found with id : ${req.params.id}`, 404);
  }

  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
  });
});
