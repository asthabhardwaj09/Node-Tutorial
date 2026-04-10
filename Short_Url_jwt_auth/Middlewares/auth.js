const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.headers['authorization'];  

    if (!userUid) return res.redirect('/login');

    const token = userUid.split('Bearer ')[1];  

    try {
        const user = getUser(token);  //using token, not userUid
        if (!user) return res.redirect('/login');

        req.user = user;
        next();
    } catch (error) {
        console.log("JWT Error:", error.message);
        return res.redirect('/login');
    }
}

module.exports = {
    restrictToLoggedinUserOnly
}