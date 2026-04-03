const express = require("express")
const router = express.Router();

router.get('/', (req, res) => {
    return res.render("home", { urls: [] }) // also pass urls or it will error
})


module.exports=router;