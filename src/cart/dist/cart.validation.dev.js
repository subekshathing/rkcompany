"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCartQuantityValidationSchema = exports.addItemToCartValidationSchema = void 0;

var _yup = _interopRequireDefault(require("yup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var addItemToCartValidationSchema = _yup["default"].object({
  productId: _yup["default"].string().required("Product id is required.").trim(),
  orderedQuantity: _yup["default"].number().min(1, "Ordered quantity must be at least 1.").required("Ordered quantity is required.")
});

exports.addItemToCartValidationSchema = addItemToCartValidationSchema;

var updateCartQuantityValidationSchema = _yup["default"].object({
  action: _yup["default"].string().oneOf(["inc", "dec"]).required("Action is required.")
});

exports.updateCartQuantityValidationSchema = updateCartQuantityValidationSchema;