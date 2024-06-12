"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// set rule
var cartSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].ObjectId,
    ref: "users",
    required: true
  },
  productId: {
    type: _mongoose["default"].ObjectId,
    ref: "products",
    required: true
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1
  }
}); // create table

var Cart = _mongoose["default"].model("Cart", cartSchema);

var _default = Cart;
exports["default"] = _default;