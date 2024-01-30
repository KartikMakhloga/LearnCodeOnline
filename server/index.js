import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import dbConnect from './config/database.js';
import dotenv from 'dotenv';
import cloudinaryConnect from './config/cloudinary.js';
import courseRoutes from './routes/Course.js';
import userRoutes from './routes/User.js';
import profileRoutes from './routes/Profile.js';
import paymentRoutes from './routes/Payments.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';

dotenv.config();
const port = process.env.PORT || 4000;


// Init Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: "/tmp/"
    }
));

// Connect to cloudinary
cloudinaryConnect();

// Connect to database
dbConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to E-Learning API"
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// https://documenter.getpostman.com/view/24441701/2s93kz6REm#61c22c97-a48f-476b-b9f9-653d6e46da54