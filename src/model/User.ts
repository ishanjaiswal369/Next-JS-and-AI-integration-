import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface Message extends Document {
    content: string;
    CreatedAt: Date;
}

export const MessageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true,
    },

    CreatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpires: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Verification code expiration date is required"],
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [MessageSchema],
        default: [],
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;
