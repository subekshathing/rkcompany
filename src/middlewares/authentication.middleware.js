import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const isAdmin = async (req, res, next) => {
  //    extract authorization from req.headers
  const authorization = req?.headers?.authorization;

  // extract token from authorization
  const splittedValues = authorization?.split(" ");

  const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

  // if not token ,throw error
  if (!token) {
    return res.status(401).send({ message: "Unauthorized token." });
  }

  let payload;
  try {
    // verify token
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized payload." });
  }

  // find user by email from payload
  const user = await User.findOne({ email: payload.email });

  // if not user
  if (!user) {
    return res.status(401).send({ message: "Unauthorized admin." });
  }

  //    user role must be admin
  if (user.role !== "admin") {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //   add adminId to req
  req.loggedInUserId = user._id;

  // call next function
  next();
};

export const isUser = async (req, res, next) => {
  //    extract authorization from req.headers
  const authorization = req?.headers?.authorization;

  // extract token from authorization
  const splittedValues = authorization?.split(" ");

  const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

  // if not token ,throw error
  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  let payload;
  try {
    // verify token
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find user by email from payload
  const user = await User.findOne({ email: payload.email });

  // if not user
  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //    user role must be user
  if (user.role !== "user") {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //   add user id to req
  req.loggedInUserId = user._id;

  // call next function
  next();
};
