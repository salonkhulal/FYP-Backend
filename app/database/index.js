import mongoose from 'mongoose';

const connectDB = async (db_url)=>{
    try{
        await mongoose.connect(db_url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;