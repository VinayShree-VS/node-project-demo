const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log("<<------------ Auth ------------->>");
    // console.log(`${req.method} - ${req.url}`);
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        };
        
        req.user = decoded;
        next();
    });
};

function hasRole(roles) {
    roles = roles.map(a => a.toLowerCase());
    return function(req, res, next) {
        if (!req.user) {
            return res.status(401).json({ code: 401, message: "Unauthorized: User not found." });
        };
        if (!req.user.roles) {
            return res.status(400).json({ code: 400, message: "Roles are required for this user." });
        };

        const roleMatched = req.user.roles.some(userRole => roles.includes(userRole.toLowerCase()));
        if (!roleMatched) {
            return res.status(403).json({ code: 403, message: "Unauthorized: Insufficient permissions." });
        };
        next();
    };
}


module.exports = {auth,hasRole};