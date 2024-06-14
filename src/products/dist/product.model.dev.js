"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// set rule
var productSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    trim: true,
    "enum": ["feed", "medicine", "insectiside", "pestiside", "seed", "fertilizer", "vitamin", "mineral", "tools"]
  },
  freeShipping: {
    type: Boolean,
    "default": false
  },
  adminId: {
    type: _mongoose["default"].ObjectId,
    required: true,
    ref: "users"
  },
  availableQuantity: {
    type: Number,
    min: 1,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 1000,
    minlength: 200
  },
  image: {
    type: String,
    "default": null,
    required: false
  }
}, {
  timestamps: true
}); // TODO: convert paisa to rs
// productSchema.methods.toJSON = function () {
//   var obj = this.toObject(); //or var obj = this;
//   obj.price = obj.price / 100;
//   return obj;
// };
// create collection

var Product = _mongoose["default"].model("Product", productSchema);

var _default = Product;
exports["default"] = _default;