const express = require("express")
const path = require('path')
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
const staticRoute = require("./routes/staticsRouter")
const { handelGenerateNewShortUrl, handelGetAnalytics } = require("./controllers/url")
const cookieparser =require('cookie-parser')
const {checkForAuthentication,restrictTo}= require('./Middlewares/auth')


const userRoute =require('./routes/user')

const app = express()
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("mongodb connected"))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(checkForAuthentication)

app.use((req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:", req.path)
    console.log("Body:", req.body)
    next()
})

app.use('/user',userRoute)

// 1. URL routes directly
app.post("/url", restrictTo(["NORMAL"]), handelGenerateNewShortUrl);
app.get("/url/analytics/:shortId", handelGetAnalytics)

// 2. Test route (MUST come before catch-all /:shortId)
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', { urls: allUrls });
});

// 3. Static routes and pages (must be before the catch-all short URL redirect)
app.use("/", staticRoute)

// 4. Short URL redirect (catch-all - must be last)
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log("Visiting shortId:", shortId);
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true }
    );
    console.log("Entry after update:", entry);
    if (!entry) return res.status(404).json({ error: "Short URL not found" });
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`))