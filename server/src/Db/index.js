import mongoose from "mongoose";
// import 'dotenv/config'
const connectDb=async() =>{
    try {
        const connectionIntance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\nMONGODB connected || Db host: ${connectionIntance.connection.host}`);
        
    } catch (error) {
        console.log(`MONGODB connection error : ${error}`);
        process.exit(1);
        
    }
}

export default connectDb