import express from "express";

import validateIdFromReqParams from "../middlewares/validate.id.middleware.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import Product from "./product.model.js";
import {
  addProductValidationSchema,
  listProductByUserValidationSchema,
  paginationValidationSchema
} from "./product.validation.js";
import { isAdmin, isUser } from "../middlewares/authentication.middleware.js";

const router = express.Router();

// add product
router.post(
  "/product/add",
  isAdmin,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;

    // extract loggedInUserId
    const loggedInUserId = req.loggedInUserId;
    newProduct.adminId = loggedInUserId;

    // create product
    await Product.create(newProduct);

    return res.status(200).send({ message: "Product is added successfully." });
  }
);

// get product details
router.get(
  "/product/details/:id",
  validateIdFromReqParams,
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // send res
    return res.status(200).send({ message: "success", productDetail: product });
  }
);

// delete a product
router.delete(
  "/product/delete/:id",
  isAdmin,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check product ownership

    // to be product owner: product adminId must be equal to logged in user id
    const adminId = product.adminId;
    const loggedInUserId = req.loggedInUserId;
    const isProductOwner = adminId.equals(loggedInUserId);

    // if not product owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // delete product
    await Product.deleteOne({ _id: productId });

    // send response
    return res
      .status(200)
      .send({ message: "Product is removed successfully." });
  }
);

// edit a product
router.put(
  "/product/edit/:id",
  isAdmin,
  validateIdFromReqParams,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product by id
    const product = await Product.findById(productId);

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check for product ownership
    // product's adminId must be same with loggedInUserId
    const productOwnerId = product.adminId;
    const loggedInUserId = req.loggedInUserId;

    const isProductOwner = productOwnerId.equals(loggedInUserId);

    // if not owner of product, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // extract newValues from req.body
    const newValues = req.body;

    // edit product
    await Product.updateOne(
      { _id: productId },
      {
        $set: {
          ...newValues
        }
      }
    );

    // send response
    return res
      .status(200)
      .send({ message: "Product is updated successfully." });
  }
);

// list product by user
router.post(
  "/product/list/user",
  isUser,
  validateReqBody(listProductByUserValidationSchema),
  async (req, res) => {
    // extract pagination data from req.body
    const { page, limit, searchText, category, minPrice, maxPrice } = req.body;

    console.log({ page, limit, searchText, category, minPrice, maxPrice });

    const skip = (page - 1) * limit;

    let match = {};

    if (searchText) {
      match = { name: { $regex: searchText, $options: "i" } };
    }

    if (category) {
      match = { ...match, category: category };
    }

    if (minPrice && maxPrice && maxPrice < minPrice) {
      return res
        .status(409)
        .send({ message: "Min price cannot be greater than max price." });
    }

    if (minPrice || maxPrice) {
      match = { ...match, price: { $gte: minPrice, $lte: maxPrice } };
    }

    console.log(match);
    const products = await Product.aggregate([
      {
        $match: match
      },
      {
        $skip: skip
      },
      { $limit: limit },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          availableQuantity: 1,
          description: { $substr: ["$description", 0, 200] },
          image: 1
        }
      }
    ]);

    // total products
    const totalProducts = await Product.find(match).countDocuments();

    // total pages
    const totalPage = Math.ceil(totalProducts / limit);

    return res
      .status(200)
      .send({ message: "success", productList: products, totalPage });
  }
);

// list product by admin
router.post(
  "/product/list/admin",
  isAdmin,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination data from req.body
    const { page, limit } = req.body;

    // calculate skip
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: {
          adminId: req.loggedInUserId
        }
      },

      { $skip: skip },

      { $limit: limit },

      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          availableQuantity: 1,
          description: { $substr: ["$description", 0, 200] },
          image: 1
        }
      }
    ]);

    // calculate page
    const totalProducts = await Product.find({
      adminId: req.loggedInUserId
    }).countDocuments();

    // total page
    const totalPage = Math.ceil(totalProducts / limit);

    return res
      .status(200)
      .send({ message: "success", productList: products, totalPage });
  }
);

router.post("/product/list", async (req, res) => {
  // extract pagination data from req.body
  const { page, limit, searchText, category, minPrice, maxPrice } = req.body;

  console.log({ page, limit, searchText, category, minPrice, maxPrice });

  const skip = (page - 1) * limit;

  let match = {};

  if (searchText) {
    match = { name: { $regex: searchText, $options: "i" } };
  }

  if (category) {
    match = { ...match, category: category };
  }

  if (minPrice && maxPrice && maxPrice < minPrice) {
    return res
      .status(409)
      .send({ message: "Min price cannot be greater than max price." });
  }

  if (minPrice || maxPrice) {
    match = { ...match, price: { $gte: minPrice, $lte: maxPrice } };
  }

  console.log(match);
  const products = await Product.aggregate([
    {
      $match: match
    },
    {
      $skip: skip
    },
    { $limit: limit },
    {
      $project: {
        name: 1,
        brand: 1,
        price: 1,
        category: 1,
        freeShipping: 1,
        availableQuantity: 1,
        description: { $substr: ["$description", 0, 200] },
        image: 1
      }
    }
  ]);

  // total products
  const totalProducts = await Product.find(match).countDocuments();

  // total pages
  const totalPage = Math.ceil(totalProducts / limit);
  return res
    .status(200)
    .send({ message: "success", productList: products, totalPage });
});
export default router;
