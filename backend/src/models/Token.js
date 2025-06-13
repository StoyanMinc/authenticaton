import { model, Schema, Types } from "mongoose";

const tokenSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    verificationToken: {
        type: String,
        default: ''
    },
    passwordResetToken: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
});

const Token = model('Token', tokenSchema);
export default Token