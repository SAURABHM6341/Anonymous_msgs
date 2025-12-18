import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();


    try {
        const {username, verifyCode, email} = await request.json();
        const existingVerifiedUsernameUser = await UserModel.findOne({username, isVerified:true});
        if(existingVerifiedUsernameUser){
            return Response.json(
                {
                    success:false,
                    message:"User is already verified or username is already taken, You can change your username by filling signup form again!",
                },
                {
                    status:400
                }
            )
        }
        const user  = await UserModel.findOne({username: username, email:email});
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found with the provided username and email",
                },
                {
                    status:404
                }
            )
        }
        if(user.verifyCode !== verifyCode){
            return Response.json(
                {
                    success:false,
                    message:"Invalid verification code",
                },
                {
                    status:400
                }
            )
        }
        if(user.verifyCodeExpiry <= new Date()){
            return Response.json(
                {
                    success:false,
                    message:"Verification code has expired, Please generate new one by filling signup form again!",
                },
                {
                    status:400
                }
            )
        }
        user.isVerified = true;
        await user.save();
        return Response.json(
            {
                success:true,
                message:"User verified successfully",
            },
            {
                status:200
            }
        )
        
    } catch (error) {
        console.log("Error in verifying code ", error);
        return Response.json(
            {
                success:false,
                message:"Error in verifying code in verify-code endpoint",
            },
            {
                status:500
            }
        )
    }
}