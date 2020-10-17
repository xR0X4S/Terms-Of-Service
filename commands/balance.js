const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");

mongoose.connect(botconfig.mongoPass,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {

    Data.findOne({
        userID: message.author.id
    }, (err, data) => {
        if(!data)
        {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                lb: "all",
                money: 0,
                xp: 0,
                daily: 0,
            })
            newData.save().catch(err => console.log(err));
            return message.channel.send("You have **0 ISK**.");
        }
        else
        {
            return message.channel.send(`You have **${data.money.toLocaleString()} ISK**.`);
        }
    })

}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money", "b"]
}