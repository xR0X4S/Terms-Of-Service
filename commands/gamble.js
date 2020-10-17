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

    Data.findOne({
        userID: message.author.id,
    
    }, (err, data) => {
        if(err) console.log(err);
        if(!data) {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                lb: "all",
                money: 0,
                xp: 0,
                daily: 0,
            })
            newData.save().catch(err => console.log(err));
            return message.reply("Sorry, you dont have any ISK to gamble with! Use the daily command!");
        } else {
            var minBet = 10000;
            var maxBet = 1000000;

            if(data.money <= 0) return message.reply("you don't have any ISK.");
        
            if(!args[0]) return message.reply("please specify a bet.");
        
            if(args[0].toLowerCase() == "all") args[0] = data.money;
        
            try {
        
            var bet = parseFloat(args[0]);
            } catch {
                return message.reply("you can only enter whole numbers.");
            }
        
            if(bet != Math.floor(bet)) return message.reply("you can only enter whole numbers.");
        
            if(data.money < bet) return message.reply("you don't have that much ISK.");
        
            if(bet < minBet) return message.reply(`the minimum bet is **${minBet.toLocaleString()} ISK**.`);

            if(bet > maxBet) return message.reply(`the maximum bet is **${maxBet.toLocaleString()} ISK**.`);
        
            const result = Math.floor(Math.random() * 100);
        
            let HouseEdge = 2;
            let lose = 50 + HouseEdge;
            let win = 50 - HouseEdge;

            if (result < lose) {
                data.money -= bet;
                data.save().catch(err => console.log(err));
                return message.reply(`you rolled an ${result} and lost ${bet.toLocaleString()}! - New Balance: **${data.money.toLocaleString()} ISK**.`);
            } else if (result > win) {
                data.money += bet;
                data.save().catch(err => console.log(err));
                return message.reply(`you rolled an ${result} and **won ${bet.toLocaleString()}!** - New Balance: **${data.money.toLocaleString()} ISK**.`);
            }
        }
    })
    
}

module.exports.help = {
    name: "gamble",
    aliases: ["g", "bet"]
}