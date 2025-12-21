import { resend } from "@/lib/resend";
import { VerificationEmail } from "@/emails/verificationCode";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify Your Email Address || Anonymous MSGS',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: `Verification email sent successfully to ${email}.`
        }
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email."
        }
    }
}