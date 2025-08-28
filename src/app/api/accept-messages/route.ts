import { auth } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const session = await auth();

        if (!session || !session.user) {
            return Response.json(
                {
                    message: "You must be signed in to perform this action",
                    success: false,
                },
                { status: 401 }
            );
        }

        // Read body
        const body = await req.json();
        const acceptingMessages = body?.acceptingMessages as boolean;

        if (typeof acceptingMessages !== "boolean") {
            return Response.json(
                {
                    message: "Invalid request: 'acceptingMessages' must be true or false",
                    success: false,
                },
                { status: 400 }
            );
        }

        const userEmail = session.user.email;
        const existingUser = await UserModel.findOne({ email: userEmail });

        if (!existingUser) {
            return Response.json(
                {
                    message: "User not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        existingUser.isAcceptingMessages = acceptingMessages;
        await existingUser.save();

        return Response.json({
            message: `Successfully set accepting messages to ${acceptingMessages}`,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return Response.json(
            {
                message: "Unable to update messages preference, please try again later",
                success: false,
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {

    const session = await auth();

    if (!session || !session.user) {
        return Response.json({
            message: "You must be signed in to perform this action",
            success: false,
        });
    }
    const userEmail = session?.user?.email;
    const existingUser = await UserModel.findOne({ email: userEmail });

    if (!existingUser) {
        return Response.json({
            message: "User not found",
            success: false,
        });
    }
    return Response.json({
        message: "Successfully fetched accepting messages",
        success: true,
        data: existingUser.isAcceptingMessages
    });
}
