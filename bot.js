var Discord = require("discord.js");
var bot = new Discord.Client();

let prefix = "!";

var pugInfo = [];
var pugPlayers = [];

bot.on("message", msg => 
{
    if (msg.content.startsWith(prefix + "newpug")) 
    {
      if (!msg.author.bot && (msg.member.highestRole.position >= 0)) 
      {
        pugInfo = msg.content.split(" ", 3);
        msg.channel.sendMessage("New pug on " + pugInfo[1] + " at " + pugInfo[2]);
        msg.channel.sendMessage("Type !join to join");
      };
    }
    else if (msg.content.startsWith(prefix + "checkStat")) 
    {
      if (!msg.author.bot && (msg.member.highestRole.position >= 0)) 
      {
         for (i=0; i<=pugPlayers.length; i++)
         {
             msg.channel.sendMessage(pugPlayers[i]);
         }

        msg.channel.sendMessage("Current list: \n" + pugPlayers.join("\n") + "");
      };
    }
    else if (msg.content.startsWith(prefix + "join")) 
    {
      if (!msg.author.bot) 
      {
        pugPlayers.push(msg.author.username);
        msg.channel.sendMessage(pugPlayers.toString());
        msg.channel.sendMessage(msg.author.username + ", you've been added to the list!");
        msg.delete;
        msg.channel.sendMessage(pugPlayers.toString());
      };
    }

    else 
    {

    }
});

bot.on('ready', () => 
{
  console.log('I am ready!');
});

bot.login("<botkey>");