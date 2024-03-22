import nodemailer from "nodemailer"
import bcryptjs from bcryptjs
import User from "@/models/userModel"

const sendMail = async({email , emailType , userId})=>{
 
try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    if(emailType == "VERIFY"){
    await User.findByIdAndUpdate(userId , {verifyToken:hashedToken , verifyTokenExpiry:Date.now() + 3600000})

    }else if(emailType=="RESET"){
        await User.findByIdAndUpdate(userId , {forgotPasswordToken:hashedToken , forgotPasswordTokenExpiry:Date.now() + 3600000})
    }
    
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });
    
        const option ={
            from: 'farzeel@gmail.com', 
            to:email, 
            subject:  emailType === "VERIFY" ? "Verify your email" : "Reset your password", 
         
            html: `<p><a href=${process.env.DOMAIN}/verifyemail?token=${hashedToken}> here </a> to
            ${emailType=="VERIFY" ? "Verify your Email" : "reset your Password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, 
          }
          const mailResponse =await transporter.sendMail(option)

          return mailResponse
} catch (error) {
    console.log(error)
    throw new Error(error.message);
}
}

export default sendMail