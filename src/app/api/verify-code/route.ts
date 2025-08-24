import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    const {username, code} = await req.json();

    if (!username || !code) {
      return Response.json(
        { success: false, message: "Missing username or code" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username, isVerified: false });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found or already verified" },
        { status: 400 }
      );
    }

    if (code === user.verifyCode && user.verifyCodeExpires > new Date()) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in code verification:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
