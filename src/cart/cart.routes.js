import express from "express";
import { isUser } from "../middlewares/authentication.middleware.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import {
  addItemToCartValidationSchema,
  updateCartQuantityValidationSchema
} from "./cart.validation.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import validateIdFromReqParams from "../middlewares/validate.id.middleware.js";

const router = express.Router();

// add item to cart
router.post(
  "/cart/item/add",
  isUser,
  validateReqBody(addItemToCartValidationSchema),
  async (req, res) => {
    // extract cart data from req.body
    const cartData = req.body;

    // check product id from mongo id validity
    const isValidMongoId = mongoose.isValidObjectId(cartData.productId);

    // if not valid mongo id, throw error
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    // find product using product id
    const product = await Product.findOne({ _id: cartData.productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check if ordered quantity is less than or equal to product available quantity
    if (cartData.orderedQuantity > product.availableQuantity) {
      return res.status(409).send({
        message: "Ordered quantity is greater than available quantity."
      });
    }

    // find cart using productId and userId
    const cartItem = await Cart.findOne({
      userId: req.loggedInUserId,
      productId: cartData.productId
    });

    // if cart item is present
    if (cartItem) {
      return res.status(409).send({
        message:
          "Item is already added to cart. Try updating quantity from cart."
      });
    }

    // add item to cart
    await Cart.create({
      userId: req.loggedInUserId,
      productId: cartData.productId,
      orderedQuantity: cartData.orderedQuantity
    });

    return res
      .status(200)
      .send({ message: "Item is added to cart successfully." });
  }
);

// clear/flush cart
router.delete("/cart/clear", isUser, async (req, res) => {
  const loggedInUserId = req.loggedInUserId;

  // remove cart items for logged in user
  await Cart.deleteMany({ userId: loggedInUserId });

  return res.status(200).send({ message: "Cart is cleared successfully." });
});

// remove single product from cart
router.delete(
  "/cart/item/remove/:id",
  isUser,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product by id
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // remove product for this user from cart
    await Cart.deleteOne({ userId: req.loggedInUserId, productId: productId });

    // send res
    return res
      .status(200)
      .send({ message: "Item is removed from cart successfully." });
  }
);

// update quantity in cart
router.put(
  "/cart/item/update/quantity/:id",
  isUser,
  validateIdFromReqParams,
  validateReqBody(updateCartQuantityValidationSchema),
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // extract userId from req.loggedInUserId
    const userId = req.loggedInUserId;

    // extract action from req.body
    const actionData = req.body;

    // find product using product id
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    //product's available quantity
    const productAvailableQuantity = product?.availableQuantity;

    // find cart
    const cartItem = await Cart.findOne({
      userId: userId,
      productId: productId
    });

    // if not cart item, throw error
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item does not exist." });
    }

    // previous ordered quantity from cart item
    let previousOrderedQuantity = cartItem.orderedQuantity;

    let newOrderedQuantity;

    if (actionData.action === "inc") {
      newOrderedQuantity = previousOrderedQuantity + 1;
    } else {
      newOrderedQuantity = previousOrderedQuantity - 1;
    }

    if (newOrderedQuantity < 1) {
      return res
        .status(403)
        .send({ message: "Ordered quantity cannot be zero." });
    }

    if (newOrderedQuantity > productAvailableQuantity) {
      return res
        .status(403)
        .send({ message: "Product reached available quantity." });
    }

    // update cart item with new ordered quantity
    await Cart.updateOne(
      { userId: userId, productId: productId },
      {
        $set: {
          orderedQuantity: newOrderedQuantity
        }
      }
    );

    return res
      .status(200)
      .send({ message: "Cart item quantity is updated successfully." });
  }
);

// list cart items
router.get("/cart/item/list", isUser, async (req, res) => {
  // extract userId from req.loggedInUserId
  const userId = req.loggedInUserId;

  const cartData = await Cart.aggregate([
    {
      $match: {
        userId: userId
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $project: {
        name: { $first: "$productDetails.name" },
        brand: { $first: "$productDetails.brand" },
        unitPrice: { $first: "$productDetails.price" },
        image: { $first: "$productDetails.image" },
        orderedQuantity: 1,
        productId: 1
      }
    },
    {
      $project: {
        name: 1,
        brand: 1,
        unitPrice: 1,
        image: 1,
        orderedQuantity: 1,
        productId: 1,
        subTotal: { $multiply: ["$unitPrice", "$orderedQuantity"] }
      }
    }
  ]);

  let allProductSubTotal = 0;
  let discountPercent = 7;
  let discountAmount = 0;
  let grandTotal = 0;

  cartData.forEach((item) => {
    allProductSubTotal = allProductSubTotal + item.subTotal;
  });

  discountAmount = (discountPercent / 100) * allProductSubTotal;

  grandTotal = allProductSubTotal - discountAmount;

  return res.status(200).send({
    message: "success",
    cartData: cartData,
    orderSummary: {
      allProductSubTotal,
      discountAmount: discountAmount.toFixed(2),
      grandTotal
    }
  });
});

// get cart item count
router.get("/cart/item/count", isUser, async (req, res) => {
  const loggedInUserId = req.loggedInUserId;

  const cartItemCount = await Cart.find({
    userId: loggedInUserId
  }).countDocuments();
  return res
    .status(200)
    .send({ message: "success", cartItemCount: cartItemCount });
});
export default router;
