const shortid = require("shortid")
const URL = require("../models/url")

async function handleGenerateShortURL(req, res) {
    const body = req.body;
    if (!body.url)
        return res.status(400).json({ error : "url requied!"})
    const shortID = shortid();

    await URL.create({
        visitorId : shortID,
        redirectedURL : body.url,
        visitHistory : [],
    });

    return res.json({ id : shortID })
}   

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks : result.visitHistory.length, 
        analytics: result.visitHistory});
}

module.exports = {
    handleGenerateShortURL,
    handleGetAnalytics
}
