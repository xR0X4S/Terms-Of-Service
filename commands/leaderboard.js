const Discord = require("discord.js");
const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const fs = require("fs");

// CONNECT TO DATABASE
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MODELS
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {

    Data.find({
        lb: "all"
}).sort([
    ['money', 'descending']
]).exec((err, res) => {
    if(err) console.log(err);

    var page = Math.ceil(res.length / 10);

    let embed = new Discord.MessageEmbed();
    embed.setTitle("LEADERBOARD");
    embed.setThumbnail("https://i.pinimg.com/originals/37/f6/e3/37f6e3c43e554757633ae8aff2b4c917.png");

    let pg = parseInt(args[0]);
    if(pg != Math.floor(pg)) pg = 1;
    if(!pg) pg = 1;
    let end = pg * 10;
    let start = (pg * 10) - 10;

    if(res.length === 0) {

        embed.addField("Error", "No pages found!");

    } else if(res.length <= start) {

        embed.addField("Error", "Page not found!");

    } else if(res.length <= end) {

        embed.setFooter(`page ${pg} of ${page}`);
        for(i = start; i < res.length; i++) {
            embed.addField(`${i + 1}. ${res[i].name}`, `${res[i].money.toLocaleString()} ISK`);
    }

    } else {

        embed.setFooter(`page ${pg} of ${page}`);
        for(i = start; i < end; i++) {
            embed.addField(`${i + 1}. ${res[i].name}`, `${res[i].money.toLocaleString()} ISK`);
        }

    }

    message.channel.send(embed);

});


}

module.exports.help = {
    name: "leaderboard",
    aliases: ["lb", "top"]
}