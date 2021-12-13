const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalBlock } = require('mineflayer-pathfinder').goals
const { dig, onDiggingCompleted, renderInventory, parseMessage } = require('../functions/func.js')
const toolPlugin = require('mineflayer-tool').plugin
const { npc_row1 } = require('../constants/rows/npc/row.js')

module.exports = {
  name: "start-bot",
  async execute(interaction) {

    const hypixel_ip = ["mc.hypixel.net", "hypixel.net", "stuck.hypixel.net", "beta.hypixel.net"]
    let editDisabled = false
    
    if(hypixel_ip.includes(interaction.options.getString('ip')) && interaction.user.id !== "570267487393021969") return interaction.editReply('no hypixel')

    const menu = await interaction.editReply({ content: 'Starting Minecraft Bot', fetchReply: true })

    const bot = mineflayer.createBot({
      host: interaction.options.getString('ip'),
      username: process.env.MINECRAFT_EMAIL,
      password: process.env.MINECRAFT_PASSWORD,
      version: "1.8.9",
      viewDistance: 'tiny',
      colorsEnabled: false,
      skinParts: {
        showJacket: false,
        showHat: false,
        showRightPants: false,
        showLeftPants: false,
        showLeftSleeve: false,
        showRightSleeve: false
      },
    })

    const embed = new Discord.MessageEmbed()
    .setTitle(`Online on ${interaction.options.getString('ip')}`)
    .setColor('GREEN')
    .setDescription("Ready to be viewed on your [Browser](https://Minecraft-to-Discord.baltrazz.repl.co)")

    //Load useful Plugins
    bot.loadPlugin(toolPlugin)

    //Hypixel Limbo Fix
    bot._client.on('transaction', function (packet) {
  packet.accepted = true
  bot._client.write('transaction', packet)
}) 


    //General Events
    bot.on("login", () => {
      console.log({ login: true })
      //console.log(bot)
    })

    bot.on("kicked", (reason, loggedIn) => {
      console.log({ kicked_reason: reason })
      return interaction.editReply({ content: "Kicked!", wasLoggedIn: loggedIn })
    })

    bot.on("error", (err) => {
      console.log({ error: err })
      return interaction.editReply("Cant connect to Server or invalid IP.")
      bot.end()
    })

    bot.on("message", async (message) => {
      const msg = parseMessage(message)

      //console.log({msg: msg})
    })

    bot.on("chat", async (username, message) => {

      const msg = parseMessage(message)

      //console.log(`${username} said ${msg}`)
    })

    bot.on("windowOpen", async (window) => {
      //console.log(window.slots)
      bot.window = window;
      embed.setDescription(`**NPC Inventory**\n${renderInventory(window, interaction, true)}\n\n**Player Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

return interaction.editReply({embeds: [embed], components: [npc_row1]})
    })

    const kill_button = new Discord.MessageButton().setEmoji('❌').setCustomId('kill').setStyle('DANGER');

    const forward_button = new Discord.MessageButton().setEmoji('⬆️').setCustomId('forward').setStyle('PRIMARY');

    const right_button = new Discord.MessageButton().setEmoji('➡️').setCustomId('left').setStyle('PRIMARY');

    const back_button = new Discord.MessageButton().setEmoji('⬇️').setCustomId('back').setStyle('PRIMARY');

    const left_button = new Discord.MessageButton().setEmoji('⬅️').setCustomId('right').setStyle('PRIMARY');

    const jump_button = new Discord.MessageButton().setEmoji('⏫').setCustomId('jump').setStyle('PRIMARY')

    const message_button = new Discord.MessageButton().setEmoji('📢').setCustomId('message').setStyle('SECONDARY')

    const mine_button = new Discord.MessageButton().setEmoji('852069714577719306').setCustomId('mine').setStyle('SECONDARY')

    const turn_button = new Discord.MessageButton().setEmoji('🔄').setCustomId('turn').setStyle('SECONDARY')


    const interact_button = new Discord.MessageButton().setLabel('interact').setCustomId('interact').setStyle('SECONDARY')

    const row1 = new Discord.MessageActionRow().addComponents(kill_button, forward_button, jump_button, message_button)

    const row2 = new Discord.MessageActionRow().addComponents(left_button, back_button, right_button, turn_button)

    const row3 = new Discord.MessageActionRow().addComponents().addComponents(mine_button, interact_button)

    let choosenBoolean;
    if (interaction.options.getString('first-person') === 'true') {
      choosenBoolean = true
    } else {
      choosenBoolean = false
    }

    let triggered;

    bot.once("spawn", async () => {

      mineflayerViewer(bot, { port: 3000, firstPerson: choosenBoolean })
      await interaction.editReply({ embeds: [embed], components: [row1, row2, row3] })
      
      pingUser(interaction)

      //click movement
      if (interaction.options.getString('allow-click-movement') && !triggered) {

        triggered = true
        bot.loadPlugin(pathfinder)

        bot.on('path_update', (r) => {
          const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
          //console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
          if(r.status === "success") {

            embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nAction **move via browser** done executing.\n\n**Inventory**\n${renderInventory(bot, interaction)}`)
              interaction.editReply({embeds: [embed]})
          }
          const path = [bot.entity.position.offset(0, 0.5, 0)]
          for (const node of r.path) {
            path.push({ x: node.x, y: node.y + 0.5, z: node.z })
          }
          bot.viewer.drawLine('path', path, 0xff00ff)
        })

        const mcData = require('minecraft-data')(bot.version)
        const defaultMove = new Movements(bot, mcData)

        bot.viewer.on('blockClicked', (block, face, button) => {
          
          /**
           * change the state to whatever you want to use
           * 
           * 0 = Left Click = Mobile Click
           * 1 = Middle Click
           * 2 = Right Click
           * 3 = First Mouse Button
           * 4 = Second Mouse Button
           */
          const button_state = 0;

          if (button !== button_state) return 

          const p = block.position.offset(0, 1, 0)

          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
        })
      }

    })

    const collector = menu.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 858000,
    });


    const player_actions = ["kill", "jump", "forward", "left", "right", "back", "jump", "message", "mine", "turn", "interact"]
    const npc_actions = ["close_npc", "click_npc_slot"]
    
    const movement_array = ["left", "right", "forward", "back", "jump"]

    collector.on("collect", async (i) => {
      await i.deferUpdate()
      if (i.user.id !== interaction.user.id) return

      if(player_actions.includes(i.customId)) {
      if (i.customId === "kill") {
        embed.setColor('RED')
        interaction.editReply({ content: "Stopped", embeds: [embed], components: [] })
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

        embed.setDescription('Command / Message to execute / send.')
        interaction.editReply({embeds: [embed]})

        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            let content = collected.values()
            content = content.next().value.content
            let message = collected.values()
            interaction.channel.messages.fetch(message.next().value.id).then(msg => msg.delete())
            bot.chat(content)
          })
          .catch(collected => {
            embed.setDescription('Nothing said to execute/send within 30 Seconds')
            return interaction.editReply({embeds: [embed]})
          });
      } else if(i.customId === 'mine') {
        let block;
        const filter = m => m.author.id === interaction.user.id;
        
        embed.setDescription('Say the block name to mine')

        interaction.editReply({embeds: [embed]})
        
        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            let content = collected.values()
            content = content.next().value.content
            let message = collected.values()
            interaction.channel.messages.fetch(message.next().value.id).then(msg => msg.delete())
            block = content;
          })
          .catch(collected => {
            embed.setDescription('Nothing said to execute/send within 30 Seconds')
            return interaction.editReply({embeds: [embed]})
          });
        
        dig(bot, interaction, block)
      } else if(i.customId === "turn") {
        bot.look(bot.entity.yaw-(3.14/4), 0, false)
      } else if(i.customId === "interact") {
        
        const entity = bot.nearestEntity()
        console.log(bot.nearestEntity())

        if(entity) {
          await bot.activateEntity(entity)
          //embed.setDescription(`Interacted with ${entity.name}, movement locked`)
          //interaction.editReply({embeds: [embed], components: []}) //later add entity row
        } else {
          embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nCan't find NPC to interact with.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

  interaction.editReply({embeds: [embed]})
        }
      }
      } else if(npc_actions.includes(i.customId)) {
        if(i.customId === "close_npc") {
          bot.closeWindow(bot.window)
          embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nAction **${i.customId}** done executing.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)
      
      await interaction.editReply({embeds: [embed], components: [row1, row2, row3]})
        } else if(i.customId === "click_npc_slot") {
          let slotToClick;
          
          const filter = m => m.author.id === interaction.user.id;

        interaction.editReply({content: 'Slot number to click (slots start with 0 and go from left to right then a row down).'})

        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            let content = collected.values()
            content = content.next().value.content
            let message = collected.values()
            interaction.channel.messages.fetch(message.next().value.id).then(msg => msg.delete())
            const check = Number(content)
            //console.log(bot.window.slots.length)
            if(typeof check !== "number" && check <= bot.window.slots.length) {
              embed.setDescription("Invalid number entered or invalid slot")
              return interaction.editReply({embeds: [embed]})
            } else {
              slotToClick = check
            }
          })
          .catch(collected => {
            embed.setDescription('No slot number said within 30 Seconds')
            return interaction.editReply({embeds: [embed]})
          })

          bot.simpleClick.leftMouse (slotToClick)

          //console.log(bot.currentWindow)
            embed.setDescription(`**NPC Inventory**\n${renderInventory(bot.currentWindow, interaction, true)}\n\n**Player Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

interaction.editReply({embeds: [embed]})
      }
      } //add next group buttony

      const no_default_edit = ["interact", "click_npc_slot", "close_npc"]
    if(!no_default_edit.includes(i.customId)) {
      embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nAction **${i.customId}** done executing.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)
      
      await interaction.editReply({embeds: [embed]})
    }

    }) //collectof
  }
}

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function pingUser(interaction) {
  interaction.followUp({content: `<@${interaction.user.id}>`}).then(msg => {
    setTimeout(() => {
      msg.delete()
    }, 5000)
  })
}