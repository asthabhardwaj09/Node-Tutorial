const express = require("express")
const path = require('path')
const urlRoute = require("./routes/url")
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
const staticRoute = require("./routes/staticsRouter")

const app = express()
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("mongodb connected"))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 1. URL routes
app.use("/url", urlRoute)

// 2. Short URL redirect
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    if (!entry) return res.status(404).json({ error: "Short URL not found" });

    res.redirect(entry.redirectURL);
});

// 3. Test route
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
});

// 4. Static routes (always last)
app.use("/", staticRoute)

app.listen(PORT, () => console.log(`server started at port ${PORT}`))