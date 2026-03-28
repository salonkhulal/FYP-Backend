import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (tokenName = "token") => {
  return (req, res, next) => {
    //setting req.user to null at first
    req.user = null;

    const token = req.cookies[tokenName];
    if (!token) return next();

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      //error showing 
      console.error("JWT verification failed:", err.message);
    }

    return next();
  };
};