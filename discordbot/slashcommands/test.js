const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

module.exports = {
  name: "test",
  async execute(interaction) {

    const menu = await interaction.editReply({ content: 'Starting Minecraft Bot', fetchReply: true} )

    bot = mineflayer.createBot({
  host: 'hub.lemoncloud.net',
  username: process.env['minecraft-email'],
  password: process.env['minecraft-password'],
      version: "1.8.9",
      viewDistance: 'tiny',
      colorsEnabled: false,
})

    const kill_button = new Discord.MessageButton().setEmoji('❌').setCustomId('kill').setStyle('DANGER');

    const forward_button = new Discord.MessageButton().setEmoji('⬆️').setCustomId('forward').setStyle('PRIMARY');

      const right_button = new Discord.MessageButton().setEmoji('➡️').setCustomId('left').setStyle('PRIMARY');

    const back_button = new Discord.MessageButton().setEmoji('⬇️').setCustomId('back').setStyle('PRIMARY');

    const left_button = new Discord.MessageButton().setEmoji('⬅️').setCustomId('right').setStyle('PRIMARY');

    const jump_button = new Discord.MessageButton().setEmoji('⏫').setCustomId('jump').setStyle('PRIMARY')

    const row1 = new Discord.MessageActionRow().addComponents(kill_button, forward_button, jump_button)

    const row2 = new Discord.MessageActionRow().addComponents(left_button, back_button, right_button)

    const row3 = new Discord.MessageActionRow().addComponents()

    let choosenBoolean;
    if(interaction.options.getString('first-person') === 'true') {
      choosenBoolean = true
    } else {
      choosenBoolean = false
    }
 
    bot.once("spawn", async () => {
      //Setting bot values
    //  bot.settings.viewDistance = 'tiny'
     // bot.settings.colorsEnabled = false
     // console.log(bot)
      
     mineflayerViewer(bot, { port: 3007, firstPerson: choosenBoolean })
      interaction.editReply({ content: "Ready to be viewed on your [Browser](https://Minecraft-to-Discord.baltrazz.repl.co)", components: [row1, row2] })
    })

    const collector = menu.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 858000,
		});
    //console.log(bot)
    
   // bot.on("message", (message) => {})
      /*bot.setControlState(movement, true)
      await sleep(1350)
      bot.clearControlStates()*/

    const movement_array = ["left", "right", "forward", "back", "jump"]
    const interacting_array = ["leftclick", "rightclick"]

    collector.on("collect", async (i) => {
      await i.deferUpdate()
      if(i.user.id !== interaction.user.id) return

      if(i.customId === "kill") {
        interaction.editReply({content: "Stopped", components: []})
        await bot.viewer.close()
        await bot.end()
        return collector.stop()
      }

      if(movement_array.includes(i.customId)) {
        //handle movement
        bot.setControlState(i.customId, true)
        await sleep(1000)
        bot.clearControlStates()
        
      } else if(false) {
        //whatever here idk
      }

      interaction.editReply({ content: `Action ${i.customId} done.` })
    })
    
  }
}

const sleep = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}