import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, email, password } = await request.json();

        console.log("Received sign-up data:", { username, email, password });

        const existingUser = await UserModel.findOne({ email });

        const verifyCodeOtp = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "User Already Exists and is Verified"
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCodeOtp;
                existingUser.verifyCodeExpires = expiryDate;
                await existingUser.save();

                await sendVerificationEmail(email, verifyCodeOtp, username);

                return Response.json({
                    success: true,
                    message: "User Updated and Verification Email Sent"
                });
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

            await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCodeOtp,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await sendVerificationEmail(email, verifyCodeOtp, username);

            return Response.json({
                success: true,
                message: "User Registered successfully"
            });
        }

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json({
            success: false,
            message: "Error Registering User" 
        })
    }
}