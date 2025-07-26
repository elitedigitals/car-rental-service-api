import User from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from "../config/email.js"; // Assuming you have a utility function to send emails
import emailTemplates from "../emailTemplates/emailTemplate.js"; // Assuming you have email templates defined

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    //validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //set login tokens for frontend
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '3h' });

        //create email token
        const emailToken = uuidv4(); // Generate a unique token for email verification
        //create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            token,
            emailToken
        });
        await user.save();
        //send welcome email with verification link
        //const verificationLink = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;
        // Here you would typically send an email using a service like nodemailer
        const welcomeTemplate = emailTemplates.welcomeTemplate(name, emailToken);
        await sendEmail(email,
            welcomeTemplate.subject,
            welcomeTemplate.html,
            welcomeTemplate.text
        );
            

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const  token  = req.params.token;
    
    try {
        //check if token is passed frontend
        if(!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        //find user by email token
        const user = await User.findOne({ emailToken: token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true; // Set user as verified
        user.emailToken = null; // Clear the email token after verification
        await user.save();
        //send success response
         // Here you would typically send a success email or redirect to a success page
         await sendEmail(user.email, "Email Verified", "Your email has been successfully verified.");
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    //validate input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }
        //generate JWT token
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '3h' });
         // Here you would typically send a success email or redirect to a success page
         const loginTime = new Date().toLocaleString();
         const loginTemplate = emailTemplates.loginNotificationTemplate(user.name, loginTime);
         await sendEmail(
           email,
           loginTemplate.subject,
           loginTemplate.html,
           loginTemplate.text
         );
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    //validate input
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        //check if user exists
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //generate reset 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        //send the otp to user email
        const forgotPasswordTemplate = emailTemplates.forgotPasswordTemplate(user.name, otp);
        await sendEmail(user.email, 
            forgotPasswordTemplate.subject,
            forgotPasswordTemplate.html,
            forgotPasswordTemplate.text
        );
        await user.save();
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

//Verify OTP and reset password
export const verifyotp = async (req, res) => {
    const otp = req.body.otp?.trim();

    if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
    }

    try {
        const user = await User.findOne({ otp });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.otpVerified = true;
        user.otp = null;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully", userId: user._id });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

//reset password
export const resetPassword = async (req, res) => {
    const { comfirmPassword, newPassword } = req.body;
    const {userId} = req.params;
    //validate input
    if (!comfirmPassword || !newPassword) {
        return res
        .status(400)
        .json({ message: "All fields are required" });
    }
    if (newPassword !== comfirmPassword) {
        return res
        .status(400)
        .json({ message: "Passwords do not match" });
    }
    try {
        //check if user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res
            .status(400)
            .json({ message: "User not found" });
        }
        //check if user is verified
        if (user.otpVerified !== true) {
            return res.status(403).json({ message: "Please verify your OTP before resetting password" });
        }
        //hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword; // Update user's password
        user.otpVerified = false; // Reset OTP verification status
        await user.save();
        //send success email
        const passwordResetTemplate = emailTemplates.passwordResetConfirmationTemplate(user.name,);
        await sendEmail(user.email,
            passwordResetTemplate.subject,
            passwordResetTemplate.html,
            passwordResetTemplate.text
        );
        //send success response
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
}