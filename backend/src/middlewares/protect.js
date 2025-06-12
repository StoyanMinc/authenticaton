import User from "../models/User.js";
import { verifyToken } from "../utils/token.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, please login!' });
        }
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            return res.status(403).json({ message: 'Invalid token! Please login again!' });
        }
        const existUser = await User.findById(decodedToken.id).select('-password');
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        req.user = existUser;
        next();
    } catch (error) {
        console.log('ERROR PROTECT MIDDLEWARE:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

export const adminMiddleware = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only!' })
    }
    next();
};

export const creatorMiddleware = async (req, res, next) => {
    console.log(req.user)
    if (!req.user || (req.user.role !== 'creator' && req.user.role !== 'admin')) {
        return res.status(401).json({ message: 'Access denied: Creators or Admins only!' });
    }
    next();
};

export const verifiedMiddleware = async (req, res, next) => {
    if (!req.user || !req.user.isVerified) {
        return res.status(403).json({ message: 'Please verify your account!' });
    }
    next();
}