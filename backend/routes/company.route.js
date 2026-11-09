
import express from "express";

import {
    getCompany,
    getCompanyById,
    registerCompany,
    updateCompany
} from "../controllers/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Recruiter only
router.route("/register").post(
    isAuthenticated,
    authorizeRoles("recruiter"),
    registerCompany
);

router.route("/get").get(
    isAuthenticated,
    authorizeRoles("recruiter"),
    getCompany
);

// Authenticated users can view company details
router.route("/get/:id").get(
    isAuthenticated,
    getCompanyById
);

// Only recruiters can update company details
router.route("/update/:id").put(
    isAuthenticated,
    authorizeRoles("recruiter"),
    singleUpload,
    updateCompany
);

export default router;
