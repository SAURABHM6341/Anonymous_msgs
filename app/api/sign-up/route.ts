import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signupSchema } from "@/schemas/signUpSchema";

export async function POST(request: Request) {

    await dbConnect();
    try {

        const body = await request.json();

        // Validate with Zod
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return Response.json(
                {
                    success: false,
                    message: validation.error.issues[0].message,
                },
                {
                    status: 400
                }
            );
        }

        const { username, email, password } = validation.data;
        const existing_User_with_Verified_Username = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existing_User_with_Verified_Username) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken please try different name",
                },
                {
                    status: 409
                }
            )
        }
        const existingUserbyEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist and verified, Please Login!",
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserbyEmail.verifyCodeExpiry = expiryDate;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.username = username;  //update username in case of someone claimed it already
                const emailResponse = await sendVerificationEmail(email, username, verifyCode);
                if (!emailResponse.success) {
                    return Response.json({
                        success: false,
                        message: emailResponse.messages
                    }, { status: 500 })
                }
                await existingUserbyEmail.save();
            }
            
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                messages: []
            });
            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.messages
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User registered successfully, please verify email"
        })

    } catch (error) {
        console.error("Error in sign-up route while registering", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500
            }
        )
    }
}