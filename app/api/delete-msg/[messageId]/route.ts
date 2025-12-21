import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ messageId: string }> }) {
    const { messageId } = await params;
    const msgId = messageId;
    console.log("msgid ", msgId);
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated, Plese login to continue"
        }, {
            status: 401
        })
    }
    // const UserId = new mongoose.Types.ObjectId(user._id);
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            {
                $pull: { messages: { _id: msgId } }
            }
        )
        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "message not found or already deleted"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message successfully deleted "
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error Occured During Deletion "
        }, { status: 500 })

    }

}