"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUserValidationSchema = exports.registerUserValidationSchema = void 0;

var _yup = _interopRequireDefault(require("yup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var registerUserValidationSchema = _yup["default"].object({
  firstName: _yup["default"].string().trim().max(30, "First name must be at max 30 characters.").required("First name is required."),
  lastName: _yup["default"].string().required("Last name is required.").trim().max(30, "Last name must be at max 30 characters."),
  email: _yup["default"].string().email("Must be a valid email.").required("Email is required.").trim().max(65, "Email must be at max 65 characters.").lowercase(),
  password: _yup["default"].string().min(6, "Password must be at least 6 characters.").max(20, "Password must be at max 20 characters.").required("Password is required."),
  number: _yup["default"].string().min(6, "Password must be at least 6 characters.").max(20, "Password must be at max 20 characters.").required("PhoneNumber is required."),
  role: _yup["default"].string().trim().oneOf(["admin", "user"], "Role must be either admin or user."),
  gender: _yup["default"].string().trim().oneOf(["male", "female", "preferNotToSay"], "Gender must be either male or female or preferNotToSay.")
});

exports.registerUserValidationSchema = registerUserValidationSchema;

var loginUserValidationSchema = _yup["default"].object({
  email: _yup["default"].string().required("Email is required.").trim().email("Must be a valid email address.").lowercase(),
  password: _yup["default"].string().required("Password is required.")
});

exports.loginUserValidationSchema = loginUserValidationSchema;