const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req,res,next){
    const userUid=req.cookies.uid;
    console.log("Cookie uid:", userUid); // Debug: check what's in the cookie
    if(!userUid) return res.redirect('/login')

    try {
        const user=getUser(userUid)
        if(!user)return res.redirect('/login')
        req.user=user;
        next();
    } catch (error) {
        // Handle JWT malformed or invalid token errors
        console.log("JWT Error:", error.message);
        return res.redirect('/login')
    }

}

module.exports={
    restrictToLoggedinUserOnly
}