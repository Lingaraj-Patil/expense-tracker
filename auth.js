const jwt = require("jsonwebtoken");
const JWT_SECRET = "s3cret";
function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token Received:", token);

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  
        console.log("Decoded JWT:", decoded);
        next();  
    } catch (error) {
        
        console.error("JWT Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    JWT_SECRET,
    auth
}