const router = require("express").Router();

const artist = require("../models/artist");

router.post("/set", async (req, res) => {
    const newArtist = artist(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            twitter: req.body.twitter,
            instagram: req.body.instagram,
        }
    );

    try {
        const savedArtist = await newArtist.save();
        return res.status(200).send({ success: true, artist: savedArtist });
    }
    catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
});


router.get("/getArtist/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const data = await artist.findOne(filter);

    if (data) {
        return res.status(200).send({ success: true, artist: data });
    }
    else {
        return res.status(400).send({ success: false, message: "Artist not found" });
    }
});

module.exports = router;