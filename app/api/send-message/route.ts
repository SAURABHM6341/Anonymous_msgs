import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username: username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                }
                , { status: 404 }
            )
        }
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: `Message cannot be sent as ${username} is no longer accepting messages `
                }
                , {
                    status: 403
                }
            )
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success:true,
            message:`message sent successfully to ${user.username}`,
        }, {status : 200})

    }
    catch (error) {
        console.log("error occured in send-message route ", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server error, error occured in send-message route"
            },
            {
                status: 500
            }
        )
    }
}