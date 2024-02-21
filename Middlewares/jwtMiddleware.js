const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT Middleware !!");

    try {
        const token = req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null;
        if (token) {
            const jwtResponse = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1d' });
            req.payload = jwtResponse.userId;
            console.log("Before next");
            next();
        } else {
            res.status(401).json({ error: "Authorization token not provided" });
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ error: "Invalid token" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = jwtMiddleware;
