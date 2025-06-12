const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.id);
        const userData = {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            profilePic: user.profilePic,
            bio: user.profileBio
        }

        req.user = userData;
        next();
    } catch (error) {
        console.log("Error in protected route middleware:", error);
        return res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = protectedRoute;