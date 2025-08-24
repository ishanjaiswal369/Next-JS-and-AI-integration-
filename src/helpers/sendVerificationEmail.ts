import {resend} from "../lib/resend"
import { ApiResponse } from "@/types/ApiResponse"
import { VerificationEmail } from "../../emails/VerificationEmail"


export async function sendVerificationEmail(email: string, token: string, username: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Mystery Email Verification",
            react: await VerificationEmail({ username: username, otp: token })
        });

        return {
            success: true,
            message: "Email sent successfully"
        }
    } catch (emailError) {
        console.error("Error Sending Verfication Email", emailError);
        return {
            success: false,
            message: "Failed to send verification email. Please try again later"
        }
    }
}