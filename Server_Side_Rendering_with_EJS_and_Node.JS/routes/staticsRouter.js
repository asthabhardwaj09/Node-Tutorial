const express = require("express")
const path = require("path")
const URL = require("../models/url")
const router = express.Router();

router.get('/', async (req, res) => {
    const allurls = await URL.find({});

    return res.render("home",
        { urls: allurls })
})

router.get('/signup', (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'))
})

router.get('/login', (req, res) => {
    return res.render("login")
})


module.exports = router;