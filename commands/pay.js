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

    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");

    if(user.id == message.author.id) return message.reply("You cannot pay yourself!");

    Data.findOne({
        userID: message.author.id
    }, (err, authorData) => {
        if(err) console.log(err);
        if(!authorData) {
            return message.reply("you dont have any ISK to send.");
        } else {
            Data.findOne({
                userID: user.id
        },  (err, userData) => {
            if(err) console.log(err);

            if(!args[1]) return message.reply("Please specify the amount you want to pay.");
            
            if(parseInt(args[1]) > authorData.money) return message.reply("You do not have that much ISK.");
            if(parseInt(args[1]) < 1) return message.reply("You cannot pay less than **1 ISK**.");

                if(args[1] != Math.floor(args[1])) return message.reply("Please enter only whole numbers!");
                if(!userData) {
                    const newData = new Data({
                        name: bot.users.cache.get(user.id).username,
                        userID: user.id,
                        lb: "all",
                        money: parseInt(args[1]),
                        daily: 0,
                    })
                    authorData.money -= parseInt(args[1]);
                    newData.save().catch(err => console.log(err));
                    authorData.save().catch(err => console.log(err));
                } else {
                    userData.money += parseInt(args[1]);
                    authorData.money -= parseInt(args[1]);
                    userData.save().catch(err => console.log(err));
                    authorData.save().catch(err => console.log(err));
                }

                return message.channel.send(`${message.author.username} payed **${args[1]} ISK** to ${bot.users.cache.get(user.id).username}. `);
            })
        }
    })

}

module.exports.help = {
    name: "pay",
    aliases: [""]
}