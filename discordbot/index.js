require('dotenv').config()
//Imports
const Discord = require('discord.js')
const fs = require('fs')

//Discord Client
const client = new Discord.Client({ intents: [ 'GUILDS', 'GUILD_MESSAGES' ]})

client.slashcommands = new Discord.Collection()

//Login
client.login(process.env.DISCORD_TOKEN)

global.dclient = client

//Event Handler
const eventFiles = fs.readdirSync('./discordbot/events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//Command Loader
const slashcommandFolders = fs.readdirSync('./discordbot/slashcommands');

for (const file of slashcommandFolders) {
		const command = require(`./slashcommands/${file}`);
		client.slashcommands.set(command.name.toLowerCase(), command);
}

//Debugging
client.options.http.api = 'https://discordapp.com/api'
process.on('warning', e => console.warn(e.stack));
//client.on('debug', console.log)

//Fragbot stuff
global.fragbotstate = true

if(fragbotstate) {
  client.slashcommands.get('fragbot').execute()
}

//nono crash
try {
process.on('uncaughtException', error => console.log(error))
process.on('unhandledRejection', error => console.log(error))
} catch (e) {
  console.log(e)
}