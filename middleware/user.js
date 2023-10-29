// Middleware to verify the JWT token
const { User } = require("../schemas/user");
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: 'Token was not provided.' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
}


// Middleware to check if the user is an addmin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.admin) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized. Only admin users can access this resource.',
            });
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports.verifyToken = verifyToken;
module.exports.isAdmin = isAdmin;