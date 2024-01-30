import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcrypt";

// resetPasswordToken
export const resetPasswordToken = async (req, res, next) => {
    try {
        // fetch email from the request body
        const { email } = req.body;

        // find user with the email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found, please sign up first"
            });
        }
        // generate token
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        const updatedDetails = await User.findByIdAndUpdate({ email: email }, {
            resetPasswordToken: token,
            resetPasswordExpire: Date.now() + 5 * (60 * 1000)
        }, { new: true });

        // create url for reset password
        const resetUrl = `http://localhost:3000/update-password/${token}`;

        // send email to the user with the reset url 
        await mailSender({
            email: email,
            subject: "Reset Password",
            message: `Please click on the link below to reset your password: \n\n ${resetUrl}`
        });

        // send response to the user
        res.status(200).json({
            success: true,
            message: "Reset password link sent to your email"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset password token"
        });
    }
};

// resetPassword
export const resetPassword = async (req, res, next) => {
    try {
        // fetch data from the request body
        const { token, password, confirmPassword } = req.body;

        // validation
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the required fields"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token id missing"
            });
        }

        // get user details from db using token
        const user = await User.findOne({
            token: token,
        });

        // if no entry - invalid token
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // token time check
        if (user.resetPasswordExpire < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "Token expired, please try again"
            });
        }

        // hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);

        // password update
        const updatedUser = await User.findByIdAndUpdate({ token: token }, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpire: null
        }, { new: true });

        // send response to the user
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        });
    }
};