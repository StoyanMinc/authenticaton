import mongoose from "mongoose";
import User from "../models/User.js";

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'User not found!' });
    }
    try {
        const existUser = await User.findById(id);
        if (!existUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({ message: `Successfully deleting user with email: ${deletedUser.email}!` });
    } catch (error) {
        console.log('ERROR DELETING USER:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        if (!allUsers) {
            return res.status(200).json({ message: 'Not users found!' });
        }
        res.status(200).json(allUsers);
    } catch (error) {
        console.log('ERROR GETTING ALL USERS:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
}