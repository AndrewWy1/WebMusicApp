const express = require("express");
const app = express();
require("dotenv/config");

const cors = require("cors");
const {default : mongoose} = require("mongoose");

app.use(cors({origin : true}));


app.get("/", (req, res) =>{

    return res.json("Hi");
})

//---ROUTES---//
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// const songsRoutes = require("./routes/songs");
// app.use("/api/song", songsRoutes);

// const albumsRoutes = require("./routes/albums");
// app.use("/api/album", albumsRoutes);

// const artistsRoutes = require("./routes/artists");
// app.use("/api/artist", artistsRoutes);


mongoose.connect(process.env.DB_STRING, {useNewUrlParser: true});
mongoose.connection
.once("open", () => console.log("Complete connection"))
.on("error", (error) => {
    console.log(`ERROR ${error}`)
})

app.listen(4000, () => console.log("lisitening to port 4000"));