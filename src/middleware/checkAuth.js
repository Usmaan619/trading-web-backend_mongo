import jwt from "jsonwebtoken";
import config from "../../config.js";
import { User } from "../models/user.js";

export const decodeTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, config.SECRET);
  return decoded;
};

export const authMiddleware = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    res.statusCode = 401;
    res.json({ success: false, message: "Please login." });
    return;
  }
  try {
    const data = await decodeTokenAndGetUser(token);
    if (!data) {
      res.json({ success: false, message: "Please login again." }, 401);
      return;
    }
    req.user = await User.findById(data.id);

    next();
  } catch (error) {
    next(error);
  }
};

export const getToken = (id, email, rememberMe, role = "user") => {
  const expiresIn = rememberMe ? "90 days" : "60 days";
  return jwt.sign({ id, email, role }, config.SECRET, { expiresIn });
};
