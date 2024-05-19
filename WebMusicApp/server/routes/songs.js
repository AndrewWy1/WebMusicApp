const router = require("express").Router();

const song = require("../models/song");

router.get("/getAll", async (req, res) => {

    const data = await song.find().sort({ createdAt: 1 });
    if (data) {
        return res.status(200).send({ success: true, songs: data });
    }
    else {
        return res.status(400).send({ success: false, message: "Song not found" });
    }
});


router.get("/getSong/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const data = await song.findOne(filter);

    if (data) {
        return res.status(200).send({ success: true, song: data });
    }
    else {
        return res.status(400).send({ success: false, message: "Song not found" });
    }
});


router.post("/set", async (req, res) => {
    const newSong = song(
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL : req.body.songURL,
            album : req.body.album,
            artist : req.body.artist,
            genre : req.body.genre,
        }
    );

    try {
        const savedSong = await newSong.save();
        return res.status(200).send({ success: true, song: savedSong });
    }
    catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
});


router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const result = await song.deleteOne(filter);
    if (result) {
        return res.status(200).send({ success: true, message: `Success to delete song: ${filter._id}` });
    }
    else {
        return res.status(400).send({ success: false, message: "Song not found" });
    }
});

router.put("/update/:id", async (req, res) =>{
    const filter = { _id: req.params.id };

    const options = {
        upsert : true,
        new: true,
    };

    try {
        const result = await song.findOneAndUpdate(filter,
        {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL : req.body.songURL,
            album : req.body.album,
            artist : req.body.artist,
            genre : req.body.genre,
        }, 
        options);

        return res.status(200).send({ success: true, data: result });
    } 
    catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
});
module.exports = router;