import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const querySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        const result = querySchema.safeParse({ username });

        if (!result.success) {
            return Response.json({
                success: false,
                message: "Invalid username",
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ username , isVerified: true });

        if (user) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            message: "Username is available",
        }, { status: 200 });


    } catch (error) {
        console.error("Error checking usename uniqueness:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}