const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    money: Number,
    xp: Number,
    daily: Number,
})

module.exports = mongoose.model("Data", dataSchema);