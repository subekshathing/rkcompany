"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var validateIdFromReqParams = function validateIdFromReqParams(req, res, next) {
  // extract id from  req.params
  var id = req.params.id; // check for mongo id validity

  var isValidMongoId = _mongoose["default"].isValidObjectId(id); // if not valid mongo id, throw error


  if (!isValidMongoId) {
    return res.status(400).send({
      message: "Invalid mongo id."
    });
  } // call next function


  next();
};

var _default = validateIdFromReqParams;
exports["default"] = _default;