const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");

// CONNECT TO DATABASE
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MODELS
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {

    if(message.author.id != (botconfig.owner)) return message.reply("You cannot use this command!");

    Data.findOne({
        lb: "all"
    }).sort([
        ['money', 'descending']
    ]).exec((err, res) => {
        if(err) console.log(err);

        if(!args[0]) return message.reply("Please specify an amount!");
        if(args[0] != Math.floor(args[0])) return message.reply("Please enter only whole numbers!");

        if(!res) return message.reply("No users found!");

        for(i = 0; i < res.length; i++) {
            Data.findOne({
                userID: res[i].userID
            },(err, data) => {
                if(err) console.log(err);
                if(data) {
                    data.money += parseInt(args[0]);
                    data.save().catch(err => console.log(err));
                }
            })
        }

        return message.channel.send(`**Admin ${message.author.username} gifted ${args[0]} ISK to everyone!**`);
    })

}

module.exports.help = {
    name: "payall",
    aliases: ["pa"]
}