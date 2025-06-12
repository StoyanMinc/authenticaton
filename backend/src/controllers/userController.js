import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";


export const register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    try {
        const isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: 'User already exist!' });
        };
        const userData = await User.create({ email, username, password });
        const token = generateToken(userData._id);

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true
        })
        res.status(201).json({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            photo: userData.photo,
            bio: userData.bio,
            isVerified: userData.isVerified,
            token
        });

    } catch (error) {
        console.log('ERROR WITH SERVER CREATING USER:', error);
        return res.status(500).json({ message: 'Internal server error!' })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const token = generateToken(existingUser._id);

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true
        })
        res.status(200).json({
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            photo: existingUser.photo,
            bio: existingUser.bio,
            isVerified: existingUser.isVerified,
            token
        })

    } catch (error) {
        console.log('ERROR WITH SERVER LOGIN USER:', error);
        return res.status(500).json({ message: 'Internal server error!' })
    }

}

export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successfully!' });
};

export const getUser = async (req, res) => {
    try {
        const existUser = await User.findById(req.user._id).select('-password');
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json(existUser);
    } catch (error) {
        console.log('ERROR WITH SERVER GETTING USER:', error);
        return res.status(500).json({ message: 'Internal server error!' })
    }
};
}