import User from "@/models/userModel";
import { NextResponse , NextRequest } from "next/server";
import bcryptjs from bcryptjs
import sendMail from "@/helpers/mailer";
import connect from "@/db/db";


connect()

export async function POST(){

try {
    const reqBody = await NextRequest.json()

    const {username , email , password} = reqBody
    console.log(reqBody)

    const user = await User.findOne({email})

    if(user){
        return NextResponse.json({error: "User already exists"}, {status: 400})
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    const savedUser = await newUser.save()

    // send verification email
    await sendMail({email, emailType: "VERIFY", userId: savedUser._id})

    return NextResponse.json({
        message: "User created successfully",
        success: true,
        savedUser
    })
    
    
} catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
}

}