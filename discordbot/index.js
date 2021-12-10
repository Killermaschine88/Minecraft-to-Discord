//Imports
const Discord = require('discord.js')
const fs = require('fs')

//Discord Client
const client = new Discord.Client({ intents: [ 'GUILDS' ]})

client.slashcommands = new Discord.Collection()

//Login
client.login(process.env['discord-token'])

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
