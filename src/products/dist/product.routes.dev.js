"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _validateIdMiddleware = _interopRequireDefault(require("../middlewares/validate.id.middleware.js"));

var _validationMiddleware = _interopRequireDefault(require("../middlewares/validation.middleware.js"));

var _productModel = _interopRequireDefault(require("./product.model.js"));

var _productValidation = require("./product.validation.js");

var _authenticationMiddleware = require("../middlewares/authentication.middleware.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = _express["default"].Router(); // add product


router.post("/product/add", _authenticationMiddleware.isAdmin, (0, _validationMiddleware["default"])(_productValidation.addProductValidationSchema), function _callee(req, res) {
  var newProduct, loggedInUserId;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // extract new product from req.body
          newProduct = req.body; // extract loggedInUserId

          loggedInUserId = req.loggedInUserId;
          newProduct.adminId = loggedInUserId; // create product

          _context.next = 5;
          return regeneratorRuntime.awrap(_productModel["default"].create(newProduct));

        case 5:
          return _context.abrupt("return", res.status(200).send({
            message: "Product is added successfully."
          }));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // get product details

router.get("/product/details/:id", _validateIdMiddleware["default"], function _callee2(req, res) {
  var productId, product;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // extract productId from req.params
          productId = req.params.id; // find product

          _context2.next = 3;
          return regeneratorRuntime.awrap(_productModel["default"].findOne({
            _id: productId
          }));

        case 3:
          product = _context2.sent;

          if (product) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).send({
            message: "Product does not exist."
          }));

        case 6:
          return _context2.abrupt("return", res.status(200).send({
            message: "success",
            productDetail: product
          }));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // delete a product

router["delete"]("/product/delete/:id", _authenticationMiddleware.isAdmin, _validateIdMiddleware["default"], function _callee3(req, res) {
  var productId, product, adminId, loggedInUserId, isProductOwner;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // extract product id from req.params
          productId = req.params.id; // find product

          _context3.next = 3;
          return regeneratorRuntime.awrap(_productModel["default"].findOne({
            _id: productId
          }));

        case 3:
          product = _context3.sent;

          if (product) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).send({
            message: "Product does not exist."
          }));

        case 6:
          // check product ownership
          // to be product owner: product adminId must be equal to logged in user id
          adminId = product.adminId;
          loggedInUserId = req.loggedInUserId;
          isProductOwner = adminId.equals(loggedInUserId); // if not product owner, throw error

          if (isProductOwner) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(403).send({
            message: "You are not owner of this product."
          }));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(_productModel["default"].deleteOne({
            _id: productId
          }));

        case 13:
          return _context3.abrupt("return", res.status(200).send({
            message: "Product is removed successfully."
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // edit a product

router.put("/product/edit/:id", _authenticationMiddleware.isAdmin, _validateIdMiddleware["default"], (0, _validationMiddleware["default"])(_productValidation.addProductValidationSchema), function _callee4(req, res) {
  var productId, product, productOwnerId, loggedInUserId, isProductOwner, newValues;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // extract product id from req.params
          productId = req.params.id; // find product by id

          _context4.next = 3;
          return regeneratorRuntime.awrap(_productModel["default"].findById(productId));

        case 3:
          product = _context4.sent;

          if (product) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).send({
            message: "Product does not exist."
          }));

        case 6:
          // check for product ownership
          // product's adminId must be same with loggedInUserId
          productOwnerId = product.adminId;
          loggedInUserId = req.loggedInUserId;
          isProductOwner = productOwnerId.equals(loggedInUserId); // if not owner of product, throw error

          if (isProductOwner) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(403).send({
            message: "You are not owner of this product."
          }));

        case 11:
          // extract newValues from req.body
          newValues = req.body; // edit product

          _context4.next = 14;
          return regeneratorRuntime.awrap(_productModel["default"].updateOne({
            _id: productId
          }, {
            $set: _objectSpread({}, newValues)
          }));

        case 14:
          return _context4.abrupt("return", res.status(200).send({
            message: "Product is updated successfully."
          }));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // list product by user

router.post("/product/list/user", _authenticationMiddleware.isUser, (0, _validationMiddleware["default"])(_productValidation.listProductByUserValidationSchema), function _callee5(req, res) {
  var _req$body, page, limit, searchText, category, minPrice, maxPrice, skip, match, products, totalProducts, totalPage;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // extract pagination data from req.body
          _req$body = req.body, page = _req$body.page, limit = _req$body.limit, searchText = _req$body.searchText, category = _req$body.category, minPrice = _req$body.minPrice, maxPrice = _req$body.maxPrice;
          console.log({
            page: page,
            limit: limit,
            searchText: searchText,
            category: category,
            minPrice: minPrice,
            maxPrice: maxPrice
          });
          skip = (page - 1) * limit;
          match = {};

          if (searchText) {
            match = {
              name: {
                $regex: searchText,
                $options: "i"
              }
            };
          }

          if (category) {
            match = _objectSpread({}, match, {
              category: category
            });
          }

          if (!(minPrice && maxPrice && maxPrice < minPrice)) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(409).send({
            message: "Min price cannot be greater than max price."
          }));

        case 8:
          if (minPrice || maxPrice) {
            match = _objectSpread({}, match, {
              price: {
                $gte: minPrice,
                $lte: maxPrice
              }
            });
          }

          console.log(match);
          _context5.next = 12;
          return regeneratorRuntime.awrap(_productModel["default"].aggregate([{
            $match: match
          }, {
            $skip: skip
          }, {
            $limit: limit
          }, {
            $project: {
              name: 1,
              brand: 1,
              price: 1,
              category: 1,
              freeShipping: 1,
              availableQuantity: 1,
              description: {
                $substr: ["$description", 0, 200]
              },
              image: 1
            }
          }]));

        case 12:
          products = _context5.sent;
          _context5.next = 15;
          return regeneratorRuntime.awrap(_productModel["default"].find(match).countDocuments());

        case 15:
          totalProducts = _context5.sent;
          // total pages
          totalPage = Math.ceil(totalProducts / limit);
          return _context5.abrupt("return", res.status(200).send({
            message: "success",
            productList: products,
            totalPage: totalPage
          }));

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // list product by admin

router.post("/product/list/admin", _authenticationMiddleware.isAdmin, (0, _validationMiddleware["default"])(_productValidation.paginationValidationSchema), function _callee6(req, res) {
  var _req$body2, page, limit, skip, products, totalProducts, totalPage;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // extract pagination data from req.body
          _req$body2 = req.body, page = _req$body2.page, limit = _req$body2.limit; // calculate skip

          skip = (page - 1) * limit;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_productModel["default"].aggregate([{
            $match: {
              adminId: req.loggedInUserId
            }
          }, {
            $skip: skip
          }, {
            $limit: limit
          }, {
            $project: {
              name: 1,
              brand: 1,
              price: 1,
              category: 1,
              freeShipping: 1,
              availableQuantity: 1,
              description: {
                $substr: ["$description", 0, 200]
              },
              image: 1
            }
          }]));

        case 4:
          products = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(_productModel["default"].find({
            adminId: req.loggedInUserId
          }).countDocuments());

        case 7:
          totalProducts = _context6.sent;
          // total page
          totalPage = Math.ceil(totalProducts / limit);
          return _context6.abrupt("return", res.status(200).send({
            message: "success",
            productList: products,
            totalPage: totalPage
          }));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router.post("/product/list", function _callee7(req, res) {
  var _req$body3, page, limit, searchText, category, minPrice, maxPrice, skip, match, products, totalProducts, totalPage;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          // extract pagination data from req.body
          _req$body3 = req.body, page = _req$body3.page, limit = _req$body3.limit, searchText = _req$body3.searchText, category = _req$body3.category, minPrice = _req$body3.minPrice, maxPrice = _req$body3.maxPrice;
          console.log({
            page: page,
            limit: limit,
            searchText: searchText,
            category: category,
            minPrice: minPrice,
            maxPrice: maxPrice
          });
          skip = (page - 1) * limit;
          match = {};

          if (searchText) {
            match = {
              name: {
                $regex: searchText,
                $options: "i"
              }
            };
          }

          if (category) {
            match = _objectSpread({}, match, {
              category: category
            });
          }

          if (!(minPrice && maxPrice && maxPrice < minPrice)) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(409).send({
            message: "Min price cannot be greater than max price."
          }));

        case 8:
          if (minPrice || maxPrice) {
            match = _objectSpread({}, match, {
              price: {
                $gte: minPrice,
                $lte: maxPrice
              }
            });
          }

          console.log(match);
          _context7.next = 12;
          return regeneratorRuntime.awrap(_productModel["default"].aggregate([{
            $match: match
          }, {
            $skip: skip
          }, {
            $limit: limit
          }, {
            $project: {
              name: 1,
              brand: 1,
              price: 1,
              category: 1,
              freeShipping: 1,
              availableQuantity: 1,
              description: {
                $substr: ["$description", 0, 200]
              },
              image: 1
            }
          }]));

        case 12:
          products = _context7.sent;
          _context7.next = 15;
          return regeneratorRuntime.awrap(_productModel["default"].find(match).countDocuments());

        case 15:
          totalProducts = _context7.sent;
          // total pages
          totalPage = Math.ceil(totalProducts / limit);
          return _context7.abrupt("return", res.status(200).send({
            message: "success",
            productList: products,
            totalPage: totalPage
          }));

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  });
});
var _default = router;
exports["default"] = _default;