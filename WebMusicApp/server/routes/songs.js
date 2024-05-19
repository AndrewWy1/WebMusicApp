const router = require("express").Router();

router.get("/getAll", async (req, res) => {
    return await res.json("Getting all songs");
});

module.exports = router;