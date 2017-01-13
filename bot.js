var Discord = require("discord.js");
var bot = new Discord.Client();
var sqlite3 = require("sqlite3");
var pugs = new sqlite3.Database("./db/pugs.db");
var players = new sqlite3.Database("./db/players.db");

let prefix = "!";

var pugInfo = [];
var pugPlayers = [];
var pugCount = 0;

bot.on("message", msg => 
{
    if (msg.content.startsWith(prefix + "newpug")) 
    {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) 
      {
        pugInfo = msg.content.split(" ", 3);
        pugCount++;
        msg.channel.sendMessage("New pug (ID: " + pugCount.toString() + ") on " + pugInfo[1] + " at " + pugInfo[2]);
        msg.channel.sendMessage("Type !join <id> to join");
        pugs.run("INSERT into pugs VALUES(" + pugCount.toString() + ", '" + pugInfo[1] + "', '" + pugInfo[2] + ", 1)");
      };
    }
    else if (msg.content.startsWith(prefix + "checkStat")) 
    {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) 
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
    else if (msg.content.startsWith(prefix + "endpug")) 
    {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) 
      {
        pugs.run("UPDATE pugs SET live = 0 WHERE id = " + msg.content.match("\d"));
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