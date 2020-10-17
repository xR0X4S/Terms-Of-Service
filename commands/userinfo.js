const Discord = require("discord.js");
const Canvas = require("canvas");
const colors = require ("../colors.json");

module.exports.run = async (bot, message, args) => {

    if(!args[0]) {
     var user = message.author;
    } else {
     var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
}
    var member = message.guild.member(user);

    const canvas = Canvas.createCanvas(500,200);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("https://www.kellsolutions.com/wp-content/uploads/2019/07/1564233245-678x381.jpg")
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = colors.white;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.white;
    var size1 = 40;
    var size2 = 30;
    var size3 = 30;

    var name = user.tag;
    do {
        ctx.font = `${size1 -= 5}px sans-serif`;
    } while (ctx.measureText(name).width > canvas.width - 225);
    ctx.fillText(name, 200, 65);

    var created = "Created: " + user.createdAt.toLocaleString();
    do {
        ctx.font = `${size2 -= 5}px sans-serif`;
    } while (ctx.measureText(created).width > canvas.width - 225);
    ctx.fillText(created, 200, 110);

    var joined = "Joined: " + member.joinedAt.toLocaleString();
    do {
        ctx.font = `${size3 -= 5}px sans-serif`;
    } while (ctx.measureText(joined).width > canvas.width - 225);
    ctx.fillText(joined, 200, 145);
    
    ctx.beginPath();
    ctx.arc(100, 100, 75, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "jpg"}));
    ctx.drawImage(avatar, 25, 25, 150, 150);

    const final = new Discord.MessageAttachment(canvas.toBuffer(), "userinfo.png");

    return message.channel.send(final);
    
}

module.exports.help = {
    name: "userinfo",
    aliases: ["ui"]
}