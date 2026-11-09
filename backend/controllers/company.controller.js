
import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a company
export const registerCompany = async (req, res) => {
    try {
        const companyName = req.body.companyName?.trim();

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const existingCompany = await Company.findOne({
            name: companyName
        });

        if (existingCompany) {
            return res.status(409).json({
                message: "Company already exists.",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Register Company Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get companies belonging to logged-in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        const companies = await Company.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("Get Company Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });

    } catch (error) {
        console.error("Get Company By ID Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Update company details
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        const { name, description, website, location } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (website !== undefined) updateData.website = website;
        if (location !== undefined) updateData.location = location;

        // Upload logo only if a new file is provided
        if (req.file) {
            const fileUri = getDataUri(req.file);

            const cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                { resource_type: "image" }
            );

            updateData.logo = cloudResponse.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No update data provided.",
                success: false
            });
        }

        // Only allow the owner to update their company
        const company = await Company.findOneAndUpdate(
            {
                _id: companyId,
                userId: req.id
            },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found or you are not authorized to update it.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Update Company Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
