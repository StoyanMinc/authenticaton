import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import User from "../models/User.js";
import { generateToken, verifyToken } from "../utils/token.js";
import Token from '../models/Token.js';
import { hashToken } from '../utils/hashToken.js';
import sendEmail from '../utils/sendEmail.js';


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

};

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

export const updateUser = async (req, res) => {
    try {
        const { username, bio, photo } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, bio, photo }, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log('ERROR WITH SERVER UPDATE USER:', error);
        return res.status(500).json({ message: 'Internal server error!' })
    }
};

export const checkLoginStatus = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json(false);
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        return res.status(401).json(false);
    }
    res.status(200).json(true);
};

export const verifyEmail = async (req, res) => {
    try {
        const existUser = await User.findById(req.user._id);
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        if (existUser.isVerified) {
            return res.status(400).json({ message: 'User is already verified!' });
        }

        const token = await Token.findOne({ userId: existUser._id });
        // if token exists --> delete token
        if (token) {
            await token.deleteOne();
        }

        // create verification token with user id by node crypto
        const verificationToken = crypto.randomBytes(64).toString('hex') + existUser._id;
        // hash verification token
        const hashedToken = await hashToken(verificationToken);
        await Token.create({
            userId: existUser._id,
            verificationToken: hashedToken,
            createdAt: Date.now(),
            expireAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
        });

        // create verification link
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

        // send email
        const subject = 'Verify Email - SM Auth';
        const send_to = existUser.email;
        const reply_to = 'noreply@noreply.com';
        const template = 'emailVerification';
        const send_from = process.env.USER_EMAIL;
        const name = existUser.username;
        const link = verificationLink;

        await sendEmail(subject, send_to, reply_to, template, send_from, name, link);
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.log('ERROR SEND EMAIL:', error);
        res.status(400).json({ message: 'Error sending email!' });
    }
};

export const verifyUser = async (req, res) => {

    const { verificationToken } = req.params;
    if (!verificationToken) {
        return res.status(400).json({ message: 'Invalid verification token!' });
    }

    const hashedToken = hashToken(verificationToken);

    const existToken = await Token.findOne({
        verificationToken: hashedToken,
        expireAt: { $gt: Date.now() }
    });

    if (!existToken) {
        return res.status(400).json({ message: 'Invalid or expired token!' });
    };

    const existUser = await User.findById(existToken.userId);
    if (!existUser) {
        return res.status(400).json({ message: 'Not user found!' });
    }

    if (existUser.isVerified) {
        return res.status(400).json({ message: 'User is alredy verified!' });
    }

    existUser.isVerified = true;
    existUser.save();
    res.status(200).json({ message: 'User is verified successfully!' });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required!' });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const existToken = await Token.findOne({ userId: existUser._id });
    if (existToken) {
        await existToken.deleteOne();
    }

    const resetPasswordToken = crypto.randomBytes(64).toString('hex') + existUser._id;
    const hashedToken = hashToken(resetPasswordToken);

    await Token.create({
        userId: existUser._id,
        passwordResetToken: hashedToken,
        createdAt: Date.now(),
        expireAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    const subject = 'Reset Password SM';
    const send_from = process.env.USER_EMAIL;
    const send_to = existUser.email;
    const reply_to = 'noreply@noreply.com';
    const template = 'resetPassword';
    const name = existUser.username;
    const link = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

    try {
        await sendEmail(subject, send_to, reply_to, template, send_from, name, link);
        res.status(200).json({ message: 'Email sent!' });
    } catch (error) {
        console.log('EMAIL NOT SENT:', error);
        res.status(400).json({ message: 'Email not sent!', error });
    }

};

export const resetPassword = async (req, res) => {
    const { resetPasswordToken } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (!resetPasswordToken) {
        return res.status(400).json({ message: 'No token provided!' });
    }

    const hashedToken = hashToken(resetPasswordToken);

    try {
        const existToken = await Token.findOne({
            passwordResetToken: hashedToken,
            expireAt: { $gt: Date.now() }
        });
        if (!existToken) {
            return res.status(400).json({ message: 'Invalid or expired token!' });
        }
        const existUser = await User.findById(existToken.userId);
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        existUser.password = password;
        await existUser.save();
        res.status(200).json({ message: 'Change password successfully!' });
    } catch (error) {
        console.log('ERROR RESET PASSWORD:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }


};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword ||!newPassword) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    try {
        const existUser = await User.findById(req.user._id);
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, existUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password!' });
        };

        existUser.password = newPassword;
        await existUser.save();
        res.status(200).json({ message: 'Change password successfully!' });
    } catch (error) {
        console.log('ERROR CHANGE PASSWORD:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};