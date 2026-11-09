
import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Student applies for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("Apply Job Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Get jobs applied for by logged-in student
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({
            applicant: userId
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error("Get Applied Jobs Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Admin views applicants for their own job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID.",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Verify job ownership
        if (job.created_by.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view these applicants.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Get Applicants Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};


// Admin updates application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                message: "Invalid application ID.",
                success: false
            });
        }

        if (!status || typeof status !== "string") {
            return res.status(400).json({
                message: "Valid status is required.",
                success: false
            });
        }
        const allowedStatuses = ["pending", "accepted", "rejected"];

        if (!allowedStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: pending, accepted, rejected.",
                success: false
            });
        }

        const application = await Application.findById(applicationId)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        if (!application.job) {
            return res.status(404).json({
                message: "Associated job not found.",
                success: false
            });
        }

        // Verify that the logged-in admin owns this job
        if (application.job.created_by.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this application.",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error("Update Status Error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid application status.",
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
