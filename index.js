const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true});
const botconfig = require("./botconfig.json");
const fs = require("fs");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {
        return console.log("No commands found!");
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    })
})

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
    bot.user.setActivity(`At your Service!`);
})

bot.on("message", async message => {
    
    if(message.channel.type === "dm)") return;
    if(message.author.id === bot.user.id) return;

    let prefix = botconfig.prefix;

    if(!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if(bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if(bot.aliases.has(cmd)) {
        command = bot.commands.get(bot.aliases.get(cmd));
    }

    try {
        command.run(bot, message, args);
    } catch(e) {
        return;
    }
})

bot.login(botconfig.token);