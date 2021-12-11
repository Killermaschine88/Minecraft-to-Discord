const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer


module.exports = {
  name: "test",
  async execute(interaction) {

    const menu = await interaction.editReply({ content: 'Starting Minecraft Bot', fetchReply: true })

    const bot = mineflayer.createBot({
      host: 'hypixel.net',
      username: process.env.MINECRAFT_EMAIL,
      password: process.env.MINECRAFT_PASSWORD,
      version: "1.8.9",
      viewDistance: 'tiny',
      colorsEnabled: false,
    })

    bot.on("login", () => {
      console.log({ login: true })
    })

    bot.on("kicked", (reason, loggedIn) => {
      console.log({ kicked_reason: reason })
      return interaction.editReply({ content: "Kicked!", wasLoggedIn: loggedIn })
    })

    bot.on("error", (err) => {
      console.log({ error: err })
    })

    bot.on("message", async (message) => {
      console.log({message: message})
    })

    bot.on("chat", async (username, message) => {
      console.log(`${username} said ${message}`)
    })

    const kill_button = new Discord.MessageButton().setEmoji('❌').setCustomId('kill').setStyle('DANGER');

    const forward_button = new Discord.MessageButton().setEmoji('⬆️').setCustomId('forward').setStyle('PRIMARY');

    const right_button = new Discord.MessageButton().setEmoji('➡️').setCustomId('left').setStyle('PRIMARY');

    const back_button = new Discord.MessageButton().setEmoji('⬇️').setCustomId('back').setStyle('PRIMARY');

    const left_button = new Discord.MessageButton().setEmoji('⬅️').setCustomId('right').setStyle('PRIMARY');

    const jump_button = new Discord.MessageButton().setEmoji('⏫').setCustomId('jump').setStyle('PRIMARY')

    const message_button = new Discord.MessageButton().setEmoji('📢').setCustomId('message').setStyle('SECONDARY')

    const row1 = new Discord.MessageActionRow().addComponents(kill_button, forward_button, jump_button)

    const row2 = new Discord.MessageActionRow().addComponents(left_button, back_button, right_button)

    const row3 = new Discord.MessageActionRow().addComponents().addComponents(message_button)

    let choosenBoolean;
    if (interaction.options.getString('first-person') === 'true') {
      choosenBoolean = true
    } else {
      choosenBoolean = false
    }

    bot.once("spawn", async () => {

      mineflayerViewer(bot, { port: 3007, firstPerson: choosenBoolean })
      await interaction.editReply({ content: "Ready to be viewed on your [Browser](https://Minecraft-to-Discord.baltrazz.repl.co)", components: [row1, row2, row3] })
    })

    const collector = menu.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 858000,
    });


    const movement_array = ["left", "right", "forward", "back", "jump"]
    const interacting_array = ["leftclick", "rightclick"]

    collector.on("collect", async (i) => {
      await i.deferUpdate()
      if (i.user.id !== interaction.user.id) return

      if (i.customId === "kill") {
        interaction.editReply({ content: "Stopped", components: [] })
        await bot.viewer.close()
        bot.end()
        return collector.stop()
      }
      if (movement_array.includes(i.customId)) {
        if (i.customId === "jump") {

          bot.setControlState(i.customId, true)
          bot.setControlState(i.customId, false)
          //so bot only jumps once

        } else {

          //make bot move for 1 second into said direction
          bot.setControlState(i.customId, true)
          await sleep(1000)
          bot.clearControlStates()
        }

      } else if (i.customId === "message") {
        //saying message input from user
        const filter = m => m.author.id === interaction.user.id;

        interaction.editReply('Say your message/command to send')

        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => console.log(collected))
          .catch(collected => interaction.editReply('Nothing was said within 30 seconds'));
      }

      await interaction.editReply({ content: `Action ${i.customId} done.` })

    })

  }
}

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}