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
}