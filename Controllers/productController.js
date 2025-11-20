const Products = require("../Model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const APIFeature = require("../utils/APIFeatures");

exports.getProducts = async (req, res, next) => {
  const resPerPage = 4;
  const buildQuery = () => {
    return new APIFeature(Products.find(), req.query).search().filter();
  };
  const totalProductCount = await Products.countDocuments({});
  const filterProductCount = await buildQuery().products.countDocuments({});
  let sendProductCount =
    totalProductCount == filterProductCount
      ? totalProductCount
      : filterProductCount;
  const products = await buildQuery().pageinte(resPerPage).products;
  res.status(200).json({
    success: true,
    count: sendProductCount,
    resPerPage,
    products,
  });
};

exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      images.push({
        image: `${req.protocol}://${req.host}/upload/products/${file.originalname}`,
      });
    });
  }
  req.body.user = req.user.id;
  req.body.images = images;
  const product = await Products.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getProduct = async (req, res, next) => {
  const product = await Products.findById(req.params.id).populate(
    "reviews.user",
    "name email"
  );
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }
  res.status(201).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res, next) => {
  let images = [];
  if (req.body.clearImages === "false") {
    const oldProduct = await Products.findById(req.params.id);
    images = oldProduct.images;
  }

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      images.push({
        image: `${req.protocol}://${req.host}/upload/products/${file.originalname}`,
      });
    });
  }

  req.body.images = images;

  const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(201).json({
    success: true,
    product: product,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await Products.findByIdAndDelete(req.params.id);
  res.status(201).json({
    success: true,
    message: "Deleted this product",
  });
};

exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = { user: req.user.id, rating, comment };
  const product = await Products.findById(productId);

  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, review) => {
      return Number(review.rating) + acc;
    }, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Review submit successfully",
  });
});

exports.getReview = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.query.productId).populate(
    "reviews.user",
    "name email"
  );
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Products.findById(req.query.productId);
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.reviewId.toString();
  });
  const numOfReviews = reviews.length;
  let ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;

  ratings = isNaN(ratings) ? 0 : ratings;

  await Products.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Products.find();
  res.status(200).json({
    success: true,
    products,
  });
});
