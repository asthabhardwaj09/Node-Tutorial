const JWT = require('jsonwebtoken')

const secret = "asrav0718"

//It will take a user object and generate a token
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    }

    const token = JWT.sign(payload, secret)
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret)
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}