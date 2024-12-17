import mongoose from 'mongoose';


export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to database ${mongoose.connection.host}`);
    } catch(error) {
        console.log('Error connecting to MONGODB', error.messge);
        process.exit(1);
    }
}


