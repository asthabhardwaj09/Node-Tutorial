const jwt = require('jsonwebtoken')
const secret = "Asrav$1718"

function setUser(user) {

    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role:user.role,
        },
        secret
    );

}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log("JWT verify error:", error.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}