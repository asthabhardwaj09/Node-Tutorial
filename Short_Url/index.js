const express = require("express")
const urlRoute = require("./routes/url")
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")

const app = express()
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("mongodb connected"))

app.use(express.json())

// Put this BEFORE app.use("/url", urlRoute)
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

app.use("/url", urlRoute)  // moved below

app.listen(PORT, () => console.log(`server started at port ${PORT}`))