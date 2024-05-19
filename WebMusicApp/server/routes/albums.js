const router = require("express").Router();

router.get("/getAll", async (req, res) => {
    return res.json("Getting all alboms");
});

module.exports = router;