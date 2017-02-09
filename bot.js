var fs = require('fs'); 
var Discord = require("discord.js");
var bot = new Discord.Client();
var sqlite3 = require("sqlite3");
var config = require("./config.json");
var pugs = new sqlite3.Database("./db/pugs.db");
var players = new sqlite3.Database("./db/players.db");

let prefix = config.prefix;

const EventEmitter = require('events');
class PlayerEvents extends EventEmittter {}
const PlayerEvents = new PlayerEvents();


var pugCount = 0;
var pugLive = false;
var pugPlayers = [];
var entryCount = 0;
var currentPugMsg = undefined;

bot.on("message", msg => {
    if (msg.content.startsWith(prefix + "newpug")) {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) {
        if (pugLive == false) {
          var pugInfo = msg.content.split(" ", 3);
          pugCount++;
          msg.channel.sendMessage("New pug on " + pugInfo[1] + " at " + pugInfo[2]);
          msg.channel.sendMessage("Type !join to join").then(function(message) {
            PlayerEvents.on('newPlayer', function() {
              message.edit("Current list: \n `" + pugPlayers.join("\n") + "`");
            })
          });
          pugs.run("INSERT into pugs VALUES(" + pugCount.toString() + ", '" + pugInfo[1] + "', '" + pugInfo[2] + "', 1)");
        }
        else if (pugLive == true){
          msg.channel.sendMessage("A pug is ongoing!");
        }
      };
    }
    else if (msg.content.startsWith(prefix + "checkStatus")) {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) {
        msg.channel.sendMessage("Current list: \n `" + pugPlayers.join("\n") + "`");
      };
    }
    else if (msg.content.startsWith(prefix + "join")) {
      if (!msg.author.bot && pugLive == true) {
        pugPlayers.push(msg.author.username);
        entryCount++;
        pugs.run("INSERT into entries VALUES(" + entryCount.toString() + ", " + pugCount.toString() + ", '" + msg.author.username + "')");
        PlayerEvents.emit('newPlayer');
        msg.channel.sendMessage(msg.author.username + ", you've been added to the list!");
        msg.delete;
      };
    }
    else if (msg.content.startsWith(prefix + "endpug")) {
      if (!msg.author.bot && (msg.member.highestRole.position > 0)) {
        pugPlayers = [];
        pugLive = false;
      };
    }
    else {

    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(config.token);