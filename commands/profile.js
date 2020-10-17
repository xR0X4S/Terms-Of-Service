const Discord = require("discord.js");
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

    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Profile')
        .setDescription('This is your Profile.')
        .setFooter('xSora Productions')
        .addField('Name', 'data.userID', false)
        .addFields(
            {name: 'ISK', value: '${data.money}', inline: false },
            {name: 'XP', value: 'data.xp', inline: false },
        )
        .setTimestamp()
        .setThumbnail('https://cdn.discordapp.com/avatars/659453299409420318/b0522d9c7642fba215b2d940b2765c2a.webp?size=4096');
        return message.channel.send(embed);
    }

module.exports.help = {
    name: "profile",
    aliases: ["p"]
}