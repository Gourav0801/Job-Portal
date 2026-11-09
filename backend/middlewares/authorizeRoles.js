
import { User } from "../models/user.model.js";

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.id).select("role");

            if (!user) {
                return res.status(401).json({
                    message: "User not found. Please login again.",
                    success: false
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action.",
                    success: false
                });
            }

            req.user = user;
            next();

        } catch (error) {
            console.error("Authorization Error:", error);

            return res.status(500).json({
                message: "Internal server error.",
                success: false
            });
        }
    };
};

export default authorizeRoles;
