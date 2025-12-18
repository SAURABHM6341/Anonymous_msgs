import dbConnect from "@/lib/dbconnect";
import { UserModel } from "@/model/User";
import {success, z} from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";
import { url } from "inspector";

const usernameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {

    await dbConnect();
    // url example = https://localhost:3000/api/check-username-unique?username=something
    try {
        const {searchParams}  = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }
        // validate with zod
        const result = usernameQuerySchema.safeParse(queryParam);
// first create schema by importing the userNameValidation from signUpSchema because validation method is in signupSchema file
// then call the safeparse method to validate the query parameter

        console.log("result ", result);  //remove after learning
        if(!result.success){
            const usernameError = result.error.format().username?._errors||[];
            return Response.json(
                {
                    success:false,
                    message:usernameError?.length > 0 ? usernameError.join(', '): 'Invalid Query Parameters',
                },
                {
                    status:400
                }
            )
        }
        const {username} = result.data;
        const existingVerifiedUsernameUser = await UserModel.findOne({username, isVerified:true});
        if(existingVerifiedUsernameUser){
            return Response.json(
                {
                    success:false,
                    message:"Username is already taken",
                },
                {
                    status:400
                }
            )
        }
        else{
            return Response.json(
                {
                    success:true,
                    message:"Username is available",
                },
                {
                    status:200
                }
            )
        }
    } catch (error) {
        console.error("Error checking Username, ", error);
        return Response.json(
            {
                success:false,
                message:"error while checking username ",
            },
            {
                status:500
            }
        )
    }
}