import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated, Plese login to continue"
        }, {
            status: 401
        })
    }
    const UserId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([ // Fetching user's messages using aggregation pipeline aggregate pipeline ko chai aur code se pdho
            { $match: { _id: UserId } }, // Match the user by their ID
            { $unwind: "$messages" }, // Unwind the messages array to deconstruct it
            { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt in descending order
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group back to user level and push sorted messages into an array
        ])
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not found"
            }, { status: 401 })
        }
        if(user.length === 0){
            return Response.json({
                success: false,
                message: "No messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, {
            status: 200
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to fetch messages"
        }, {
            status: 500
        })
    }

}
