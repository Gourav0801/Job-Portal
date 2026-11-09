
import express from "express";

import {
    getAdminJobs,
    getAllJobs,
    getJobById,
    postJob
} from "../controllers/job.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Recruiter only
router.route("/post").post(
    isAuthenticated,
    authorizeRoles("recruiter"),
    postJob
);

router.route("/getadminjobs").get(
    isAuthenticated,
    authorizeRoles("recruiter"),
    getAdminJobs
);

// Both students and recruiters can browse jobs
router.route("/get").get(
    isAuthenticated,
    getAllJobs
);

router.route("/get/:id").get(
    isAuthenticated,
    getJobById
);

export default router;
