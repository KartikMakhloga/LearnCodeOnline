import mongoose from 'mongoose';
const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error.message);
    }
}

export default dbConnect;