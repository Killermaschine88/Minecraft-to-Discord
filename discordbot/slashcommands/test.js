const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

let isRunning = false;
let bot;
let hasChatted = false

module.exports = {
  name: "test",
  async execute(interaction) {

    bot = mineflayer.createBot({
  host: 'hub.lemoncloud.net',
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
      
      await sleep(3000)
      await bot.chat('/l')
      await sleep(3000)
      await bot.chat('/play sb')
      
    })

    if(!hasChatted) {
    bot.on("message", (message) => {
      hasChatted = true
      
      if(message.extra?.length > 0) {
        console.log(message.extra[0].text)
      }
    })
    }

    if(type === "chat") {
      if(input) {
        await bot.chat(`${input}`)
        interaction.editReply(`said ${input}`)
      } else {
        return interaction.editReply("input required")
      }
    } else if(type === "move") {
      if(!movement) return interaction.editreply('movement needed')
      bot.setControlState(movement, true)
      await sleep(1350)
      bot.clearControlStates()
      return interaction.editReply(`moved ${movement}`)
    }
    
  }
}

const sleep = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}