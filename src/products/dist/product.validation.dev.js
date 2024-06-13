"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listProductByUserValidationSchema = exports.paginationValidationSchema = exports.addProductValidationSchema = void 0;

var _yup = _interopRequireDefault(require("yup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var addProductValidationSchema = _yup["default"].object({
  name: _yup["default"].string().required("Name is required.").trim().max(60, "Name must be at max 60 characters."),
  brand: _yup["default"].string().required("Brand is required.").trim().max(60, "Brand must be at max 60 characters."),
  price: _yup["default"].number().min(0, "Price cannot be negative number.").required("Price is required."),
  category: _yup["default"].string().trim().required("Category is required.").oneOf(["feed", "medicine", "insectiside", "pestiside", "seed", "fertilizer", "vitamin", "mineral", "tools"]),
  freeShipping: _yup["default"]["boolean"](),
  availableQuantity: _yup["default"].number().min(1, "Available quantity must be at least 1.").integer("Available quantity cannot be float number."),
  description: _yup["default"].string().required("Description is required.").min(200, "Description must be at least 200 characters.").max(1000, "Description must be at max 1000 characters."),
  image: _yup["default"].string().nullable()
});

exports.addProductValidationSchema = addProductValidationSchema;

var paginationValidationSchema = _yup["default"].object({
  page: _yup["default"].number().min(1, "Page must be at least 1.").required("Page is required."),
  limit: _yup["default"].number().min(1, "Limit must be at least 1.").required("Limit is required.").max(100, "Limit must be at max 100."),
  searchText: _yup["default"].string().nullable()
});

exports.paginationValidationSchema = paginationValidationSchema;

var listProductByUserValidationSchema = _yup["default"].object({
  page: _yup["default"].number().min(1, "Page must be at least 1.").required("Page is required."),
  limit: _yup["default"].number().min(1, "Limit must be at least 1.").required("Limit is required.").max(100, "Limit must be at max 100."),
  searchText: _yup["default"].string().nullable(),
  category: _yup["default"].string().oneOf(["grocery", "electronics", "furniture", "electrical", "kitchen", "kids", "sports", "auto", "clothes", "shoes", "pharmaceuticals", "stationery", "cosmetics"]).nullable(),
  minPrice: _yup["default"].number().min(0).nullable(),
  maxPrice: _yup["default"].number().min(0).nullable()
});

exports.listProductByUserValidationSchema = listProductByUserValidationSchema;