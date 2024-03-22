import mongoose from "mongoose"



const connect = async ()=>{
    try {
     await mongoose.connect(process.env.MONGO_URI)
     const connection  = mongoose.connection

     connection.on("connected",()=>{
        console.log("mongo db connected successfully")
     })
     connection.on("error",(err)=>{
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit()
     })
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error)
    }
}

export default connect

