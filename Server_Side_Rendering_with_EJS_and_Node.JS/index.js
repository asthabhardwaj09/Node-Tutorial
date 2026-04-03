const express = require("express")
const path = require('path')
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
const staticRoute = require("./routes/staticsRouter")
const { handelGenerateNewShortUrl, handelGetAnalytics } = require("./controllers/url")

const app = express()
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("mongodb connected"))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:", req.path)
    console.log("Body:", req.body)
    next()
})

// 1. URL routes directly
app.post("/url", handelGenerateNewShortUrl)
app.get("/url/analytics/:shortId", handelGetAnalytics)

// 2. Test route (MUST come before catch-all /:shortId)
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', { urls: allUrls });
});

// 3. Short URL redirect (catch-all - must be last)
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

// 4. Static routes (always last)
app.use("/", staticRoute)

app.listen(PORT, () => console.log(`server started at port ${PORT}`))