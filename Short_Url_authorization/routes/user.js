const express= require("express")
const {handeUserSignup} = require('../controllers/user')
const {handeUserLogin}= require('../controllers/user')

const router =express.Router()

router.post("/",handeUserSignup)
router.post("/login",handeUserLogin)

module.exports= router;