"use strict";

var _express = _interopRequireDefault(require("express"));

var _connectDb = _interopRequireDefault(require("./connect.db.js"));

var _userRoutes = _interopRequireDefault(require("./src/user/user.routes.js"));

var _productRoutes = _interopRequireDefault(require("./src/products/product.routes.js"));

var _cartRoutes = _interopRequireDefault(require("./src/cart/cart.routes.js"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // to make app understand json

app.use(_express["default"].json()); // enable cors
// Cross origin Resource Sharing

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};
app.use((0, _cors["default"])(corsOptions)); // connect database

(0, _connectDb["default"])(); // register routes

app.use(_userRoutes["default"]);
app.use(_productRoutes["default"]);
app.use(_cartRoutes["default"]); // network port and server

var PORT = process.env.API_PORT;
app.listen(PORT, function () {
  console.log("App is listening on port ".concat(PORT));
});