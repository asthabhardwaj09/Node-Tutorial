const { nanoid } = require('nanoid')
const URL = require('../models/url')
 

async function handelGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.redirectURL) return res.status(400).json({ error: "url is required" })
    const shortId = nanoid(8)
    await URL.create({
        shortId: shortId,
        redirectURL: body.redirectURL,
        visitHistory: [],
        createdBy:req.user._id,
    });

    return res.render('home', { id: shortId, urls: [] })
}

async function handelGetAnalytics(req,res){
    const shortId= req.params.shortId;
    const result= await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory,
    })
}

module.exports = {
    handelGenerateNewShortUrl, 
    handelGetAnalytics
}