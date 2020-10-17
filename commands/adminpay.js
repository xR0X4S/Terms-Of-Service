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

    if(message.author.id != (botconfig.permissions.owner)) return message.reply("You cannot use this command!");


    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");


    Data.findOne({
        userID: user.id
},  (err, userData) => {
    if(err) console.log(err);

    if(!args[1]) return message.reply("Please specify the amount you want to pay.");

    if(args[1] != Math.floor(args[1])) return message.reply("Please enter only whole numbers!");

        if(!userData) {
            const newData = new Data({
                name: bot.users.cache.get(user.id).username,
                userID: user.id,
                lb: "all",
                money: parseInt(args[1]),
                xp: 0,
                daily: 0,
            })
            newData.save().catch(err => console.log(err));
        } else {
            userData.money += parseInt(args[1]);
            userData.save().catch(err => console.log(err));
        }

        return message.channel.send(`${message.author.username} admin payed **${args[1]} ISK** to ${bot.users.cache.get(user.id).username}.`);
    })

}

module.exports.help = {
    name: "adminpay",
    aliases: ["ap", "deposit", "cashin"]
}