const mongoose = require("mongoose");

const artistSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required : true,
        },
        imageURL:{
            type: String,
            required: true,
        },
        X:{
            type:String,
            required: true,
        },
        instagram:{
            type: String,
            required: true,
        }
        
    },
    {timestamps: true}
)

module.exports = mongoose.model("artist", artistSchema);