const express = require("express");
const { connectMongoDB } = require('./connect')
const urlRoute = require('./routes/url');
const URL = require('./models/url')


const app = express();
const PORT = 8000;

connectMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("MongoDB Error!", err));


app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = decodeURIComponent(req.params.shortId);
    console.log("Received shortId:", shortId);

    const entry = await URL.findOneAndUpdate(
        { visitorId: shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    if (!entry) {
        console.log("No entry found for:", shortId);
        return res.status(404).send("Short URL not found.");
    }

    res.redirect(entry.redirectedURL);
});


app.listen(PORT, () => (`Server Started at : ${PORT}`));