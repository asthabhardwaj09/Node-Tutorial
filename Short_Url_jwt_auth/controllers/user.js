const {v4:uuidv4} = require('uuid')
const {setUser}= require('../service/auth')

const User = require('../models/user')

async function handeUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect('/');
}

async function handeUserLogin(req, res) {
    const { email, password } = req.body;
    const user= await User.findOne({email,password})
    if(!user){
        return res.render("login",{
            error:"Invalid username or password",
        });
    }
    const token=  setUser(user);
    // res.cookie("uid",token,{
    //     // domain:"www.google.com"
    // });
    return res.json({token});
    // return res.redirect('/');
}

module.exports = {
    handeUserSignup,
    handeUserLogin
}