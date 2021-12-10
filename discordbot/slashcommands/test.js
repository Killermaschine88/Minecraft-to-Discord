const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

let isRunning = false;
let bot;
let hasChatted = false

module.exports = {
  name: "test",
  async execute(interaction) {

    const menu = await interaction.editReply('Starting Minecraft Bot')

    bot = mineflayer.createBot({
  host: interaction.options.getString('ip') || 'hub.lemoncloud.net',
  username: process.env['minecraft-email'],
  password: process.env['minecraft-password'],
      version: "1.8.9"
})
 
    bot.once("spawn", async () => {
      //Setting bot values
      bot.settings.viewDistance = 'tiny'
      bot.settings.colorsEnabled = false
      
      mineflayerViewer(bot, { port: 3007, firstPerson: true })
      interaction.editReply({ content: "Ready to be viewed on your [Browser](https://Minecraft-to-Discord.baltrazz.repl.co)"})
      
    })
    
   // bot.on("message", (message) => {})
      /*bot.setControlState(movement, true)
      await sleep(1350)
      bot.clearControlStates()*/
    
  }
}

const sleep = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}