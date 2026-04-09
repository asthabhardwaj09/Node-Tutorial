const express= require("express")
const {handelGenerateNewShortUrl,handelGetAnalytics}= require("../controllers/url");
const router = express.Router();

router.post('/',handelGenerateNewShortUrl,);

router.get('/anaytics/:shortId',handelGetAnalytics)

module.exports=router;