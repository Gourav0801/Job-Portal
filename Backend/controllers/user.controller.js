
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        // Check all required fields
        if (!fullName || !email || !phoneNumber || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role: role || "user"
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true
        });

    } catch (error) {
        console.error("Error registering user:", error);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            });
        }

        // Check role
        if (user.role !== role) {
            return res.status(400).json({
                message: "Invalid role",
                success: false
            });
        }

        // Generate JWT token
        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Remove password from response
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Send cookie and response
        return res.status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            })
            .json({
                message: `Welcome back ${user.fullName}`,
                user,
                success: true
            });

    } catch (error) {
        console.error("Error logging in user:", error);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
export const logout = (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            maxAge: 0}).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullName,email,PhoneNumber,bio,skills} = req.body;
        const file = req.file;
           if (!fullName || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };

        //cloudinary upload
        const skillsArray = skills.split(',').map(skill => skill.trim());
        const updatedUser = 
            req.user._id;
            let user = await User.findById(userId);

            if(!user) {
                return res.status(404).json({
                    message: "User not found",
                    success: false
                });
            }

            user.fullName = fullName;
            user.email = email;
            user.phoneNumber = phoneNumber;
            user.profile.bio = bio;
            user.profile.skills = skillsArray; 

            //user comes later here

            await user.save();

             user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }   
}
