import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidaton } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidaton
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {username: searchParams.get("username")}
        const validUserName = UsernameQuerySchema.safeParse(queryParam);
        //zod vallidation
        if(!validUserName.success){
            const usernameErrors = validUserName.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(",") : "Invalid query parameters"
            },
        {
            status: 400
        })
        }

        const username = validUserName.data.username

        const userResponse = await UserModel.findOne({username, isVerified:true})
       if (userResponse) {
         return Response.json({
             success: false,
             message: "Username already exists"
         },{
             status: 400
         })
       }
       return Response.json({
        success: true,
        message: "Username is available"
    },{
        status: 200
    })

    } catch (error) {
        console.error("Error checking available username", error);
        return Response.json({
            success: false,
            message: "Error checking username availability"
        },
            {
                status: 500
            })
    }
}