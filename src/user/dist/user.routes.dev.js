"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _userValidation = require("./user.validation.js");

var _userModel = _interopRequireDefault(require("./user.model.js"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _validationMiddleware = _interopRequireDefault(require("../middlewares/validation.middleware.js"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // register user

router.post("/user/register", (0, _validationMiddleware["default"])(_userValidation.registerUserValidationSchema), function _callee(req, res) {
  var newUser, user, plainPassword, saltRound, hashedPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // extract new user from req.body
          newUser = req.body; //? check if user with provided email already exists in our system
          //  find user by email

          _context.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: newUser.email
          }));

        case 3:
          user = _context.sent;

          if (!user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(409).send({
            message: "Email already exists."
          }));

        case 6:
          // just before saving user, we need to create hash password
          plainPassword = newUser.password;
          saltRound = 10; // to add randomness

          _context.next = 10;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(plainPassword, saltRound));

        case 10:
          hashedPassword = _context.sent;
          // update new user password with hashedPassword
          newUser.password = hashedPassword;

          if (newUser.email == "admin@gmail.com") {
            newUser.role = "admin";
          } else {
            newUser.role = "user";
          } // save user


          _context.next = 15;
          return regeneratorRuntime.awrap(_userModel["default"].create(newUser));

        case 15:
          return _context.abrupt("return", res.status(201).send({
            message: "User is registered successfully."
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}); // login user

router.post("/user/login", (0, _validationMiddleware["default"])(_userValidation.loginUserValidationSchema), function _callee2(req, res) {
  var loginCredentials, user, plainPassword, hashedPassword, isPasswordMatch, payload, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // extract login credentials from req.body
          loginCredentials = req.body; // find user by using email from login credentials

          _context2.next = 3;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: loginCredentials.email
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).send({
            message: "Invalid credentials."
          }));

        case 6:
          // check for password match
          plainPassword = loginCredentials.password;
          hashedPassword = user.password;
          _context2.next = 10;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(plainPassword, hashedPassword));

        case 10:
          isPasswordMatch = _context2.sent;

          if (isPasswordMatch) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(404).send({
            message: "Invalid credentials."
          }));

        case 13:
          // generate access token
          payload = {
            email: user.email
          };
          token = _jsonwebtoken["default"].sign(payload, process.env.ACCESS_TOKEN_SIGNATURE); // to hide password

          user.password = undefined; // send response

          return _context2.abrupt("return", res.status(200).send({
            message: "success",
            userDetails: user,
            accessToken: token
          }));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var _default = router;
exports["default"] = _default;