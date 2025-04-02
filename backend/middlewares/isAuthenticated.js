import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Ensure cookies exist before accessing token
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({
                message: "User not authenticated. Token is missing.",
                success: false,
            });
        }

        const token = req.cookies.token;

        // Ensure SECRET_KEY is defined
        if (!process.env.SECRET_KEY) {
            return res.status(500).json({
                message: "Server error: SECRET_KEY is missing in environment variables.",
                success: false,
            });
        }

        // Verify JWT
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Store user ID in request for further processing
        req.id = decoded.userId;

        return next(); // Move to next middleware
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(500).json({
            message: "Authentication failed",
            success: false,
            error: error.message,
        });
    }
};

export default isAuthenticated;
export const isAdmin = async (req, res, next) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false,
            });
        }
        return next(); // Move to next middleware
    } catch (error) {
        console.error("Authorization Error:", error.message);
        return res.status(500).json({
            message: "Authorization failed",
            success: false,
            error: error.message,
        });
    }
};
