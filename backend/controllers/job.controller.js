
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import mongoose from "mongoose";

// Create a job (Recruiter only)
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        // Validate required fields
        if (
            !title?.trim() ||
            !description?.trim() ||
            !requirements ||
            salary === undefined ||
            !location?.trim() ||
            !jobType?.trim() ||
            experience === undefined ||
            position === undefined ||
            !companyId
        ) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Validate numeric fields
        const salaryValue = Number(salary);
        const experienceValue = Number(experience);
        const positionValue = Number(position);

        if (
            !Number.isFinite(salaryValue) || salaryValue < 0 ||
            !Number.isFinite(experienceValue) || experienceValue < 0 ||
            !Number.isInteger(positionValue) || positionValue <= 0
        ) {
            return res.status(400).json({
                message: "Please provide valid salary, experience and position values.",
                success: false
            });
        }

        // Validate company ID
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID.",
                success: false
            });
        }

        // Check company ownership
        const company = await Company.findOne({
            _id: companyId,
            userId: userId
        });

        if (!company) {
            return res.status(403).json({
                message: "You are not authorized to post jobs for this company.",
                success: false
            });
        }

        // Normalize requirements
        const requirementsList = Array.isArray(requirements)
            ? requirements.map(item => String(item).trim()).filter(Boolean)
            : String(requirements).split(",").map(item => item.trim()).filter(Boolean);

        if (requirementsList.length === 0) {
            return res.status(400).json({
                message: "At least one requirement is required.",
                success: false
            });
        }

        // Create job
        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirementsList,
            salary: salaryValue,
            location: location.trim(),
            jobType: jobType.trim(),
            experienceLevel: experienceValue,
            position: positionValue,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.error("Post Job Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error("Get All Jobs Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        const job = await Job.findById(jobId)
            .populate({ path: "company" });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Get Job By ID Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get jobs created by logged-in recruiter
export const getAdminJobs = async (req, res) => {
    try {
        const recruiterId = req.id;

        const jobs = await Job.find({ created_by: recruiterId })
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error("Get Recruiter Jobs Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
