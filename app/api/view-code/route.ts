import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
export async function GET(request:Request){
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');
        const email = searchParams.get('email');
        const user  = await UserModel.findOne({username: username, email:email});
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found",
                },
                {
                    status:404
                }
            )
        }
        return Response.json(
            {
                success:true,
                message:"Verification code retrieved successfully",
                verifyCode: user.verifyCode,
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.error("Error in view code: ", error);
        return Response.json(
            {
                success:false,
                message:"Internal server error while viewing code",
            },
            {
                status:500
            }
        )
    }

}