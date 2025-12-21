import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user:User = session?.user;
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "user is not logged in "
        },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to fetch User from database in accept-message route"
            },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Successfully toggled the accept message status",
                updatedUser
            }
            , {
                status: 200
            }
        )

    } catch (error) {
        console.log("failed to toggle the accept-message status please try again");
        return Response.json(
            {
                success: false,
                message: "Failed to toggle the accept message status"
            }
            , {
                status: 500
            }
        )

    }

}
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // const user:User = session?.user;
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "user is not logged in "
        },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    try {
        const userFromDb = await UserModel.findById(userId);
        if (!userFromDb) {
            return Response.json({
                success: false,
                message: "failed to fetch User from database in accept-message route"
            },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                isAccepting: userFromDb.isAcceptingMessages
            }
            , {
                status: 200
            }
        )
    } catch (error) {
        console.log("failed to fetch the accept-message status please try again");
        return Response.json(
            {
                success: false,
                message: "Failed to fetch the accept message status"
            }
            , {
                status: 500
            }
        )
    }

}