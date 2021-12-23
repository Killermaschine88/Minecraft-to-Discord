require('dotenv').config()
const Discord = require('discord.js')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalBlock } = require('mineflayer-pathfinder').goals
const { dig, onDiggingCompleted, renderInventory, getEmoji, parseMessage, parseScoreboard, parseLore, format } = require('../functions/func.js')
const toolPlugin = require('mineflayer-tool').plugin
const { npc_row1 } = require('../constants/rows/npc/row.js')
const movement = require('mineflayer-movement')


module.exports = {
  name: "start-bot",
  async execute(interaction) {
    //current line 424

    const hypixel_ip = ["mc.hypixel.net", "hypixel.net", "stuck.hypixel.net", "beta.hypixel.net"]
    let editDisabled = false
    let currentRow = 1;
    let block_to_mine = '';
    
    if(hypixel_ip.includes(interaction.options.getString('ip')) && interaction.user.id !== "570267487393021969") return interaction.editReply('no hypixel')

    const menu = await interaction.editReply({ content: 'Starting Minecraft Bot'})

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

    bot.loadPlugin(movement.plugin);


    let proximity = new movement.heuristics.proximity({
    weighting: 10
});
let conformity = new movement.heuristics.conformity({
    weighting: 10
});
let distance = new movement.heuristics.distance({
    weighting: 10,
    radius: 3,
    count: 10,
    sectorLength: 0.5
});
let danger = new movement.heuristics.danger({
  weighting: 0.1
}); 


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
      bot.entities = {}
      bot.movement.loadHeuristics(proximity, distance, danger);

      setTimeout(() => {
        bot.chat('/locraw')
      }, 1000)
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

      if(message.json.text.includes("server") && message.json.color === 'white') {
        const obj = JSON.parse(message.json.text)
        if(obj.mode) {
          return interact.followUp({content: `Game: ${obj.gametype || 'Null'}\nArea: ${obj.mode || 'Null'}`, ephemeral: true})
        } else {
          return interact.followUp({content: `Server: ${obj.server}`, ephemeral: true})
        }
      }
      
      if (message.toString().trim() === '') return
      message = message.toString()
      message.replace('>>>', '')
      message.replace('<<<', '')
      const ignore = ['Mana']
      for(const no of ignore) {
        if(message.includes(no)) {
          return
        } else {
          continue;
        }
      }

      interaction.client.channels.cache.get(process.env.MESSAGE_LOGS_CHANNEL).send({content: `> ${message}`})
      return
    })

    bot.on("chat", async (username, message) => {

      const msg = parseMessage(message, username)

      //interaction.client.channels.cache.get(process.env.CHAT_LOGS_CHANNEL).send({content: `${msg}`})
      return
    })

    bot.on("windowOpen", async (window) => {
      //console.log("window open")
      //console.log(window.slots)
      bot.window = window;
      embed.setDescription(`**NPC Inventory** (Sometimes needs manual refresh)\n${renderInventory(window, interaction, true)}\n\n**Player Inventory** (Updates once closed)\n${renderInventory(bot.inventory, interaction, false)}`)

return interaction.editReply({embeds: [embed], components: [npc_row1]})
    })

    bot.on("windowClose", async (window) => {
      currentRow = 1
          current_row.components[0].label = "Main (1/2)"
          current_row.components[2].disabled = false
          current_row.components[1].disabled = true
            embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nEvent **window closed** done executing.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

            return interaction.editReply({embeds: [embed], components: [row1, row2, current_row]})
    })

    const warp_select = new Discord.MessageSelectMenu()
      .setPlaceholder('Location to walk to...')
			.setCustomId('quick_walk')
			.setMaxValues(1)
			.setMinValues(1);

    const data = [
      { label: "Bank", value: "bank" },
      { label: "Bazaar", value: "bazaar" },
      { label: "Auction House", value: "auction_house" }
    ]

    warp_select.addOptions(data)

    const kill_button = new Discord.MessageButton().setEmoji('❌').setCustomId('kill').setStyle('DANGER');

    const forward_button = new Discord.MessageButton().setEmoji('⬆️').setCustomId('forward').setStyle('PRIMARY');

    const right_button = new Discord.MessageButton().setEmoji('➡️').setCustomId('left').setStyle('PRIMARY');

    const back_button = new Discord.MessageButton().setEmoji('⬇️').setCustomId('back').setStyle('PRIMARY');

    const left_button = new Discord.MessageButton().setEmoji('⬅️').setCustomId('right').setStyle('PRIMARY');

    const jump_button = new Discord.MessageButton().setEmoji('⏫').setCustomId('jump').setStyle('PRIMARY')

    const message_button = new Discord.MessageButton().setEmoji('📢').setCustomId('message').setStyle('SECONDARY')

    const mine_button = new Discord.MessageButton().setEmoji('852069714577719306').setCustomId('mine').setStyle('SECONDARY')
    const set_block = new Discord.MessageButton().setLabel('Set Block').setCustomId('set_block').setStyle('SECONDARY')

    const turn_button = new Discord.MessageButton().setEmoji('🔄').setCustomId('turn').setStyle('SECONDARY')

    const interact_button = new Discord.MessageButton().setLabel('Interact').setCustomId('interact').setStyle('SECONDARY')

    const leftclick_npc_slot = new Discord.MessageButton().setLabel('Click Inv').setCustomId('leftclick_npc_slot').setStyle('SECONDARY')

    const current_shown = new Discord.MessageButton().setLabel('Main (1/3)').setCustomId('0').setStyle('SECONDARY').setDisabled(true)
    const row_back_button = new Discord.MessageButton().setLabel('Previous').setCustomId('previous').setStyle('SECONDARY').setDisabled(true)
    const row_next_button = new Discord.MessageButton().setLabel('Next').setCustomId('next').setStyle('SECONDARY')

    const show_lore = new Discord.MessageButton().setLabel('Show Lore').setCustomId('show_lore').setStyle('SECONDARY')
    
    const attack_button = new Discord.MessageButton().setLabel('⚔️').setCustomId('attack').setStyle('DANGER')

    const switch_hub_button = new Discord.MessageButton().setLabel('Switch Hub').setCustomId('switch_hub').setStyle('SECONDARY')

    const nearby_blocks_button = new Discord.MessageButton().setLabel('Nearby Blocks').setCustomId('nearby_blocks').setStyle('SECONDARY')

    const display_inventory_button = new Discord.MessageButton().setLabel('Display Inventory').setCustomId('display_inventory').setStyle('SECONDARY')
 
      

    const current_row = new Discord.MessageActionRow().addComponents(current_shown, row_back_button, row_next_button, interact_button)

    const row1 = new Discord.MessageActionRow().addComponents(kill_button, forward_button, jump_button, message_button, attack_button)

    const row2 = new Discord.MessageActionRow().addComponents(left_button, back_button, right_button, turn_button, leftclick_npc_slot)

    //const row3 = new Discord.MessageActionRow().addComponents().addComponents()

    const mining_row = new Discord.MessageActionRow().addComponents(mine_button, set_block, nearby_blocks_button)
    current_row.addComponents(show_lore)

    const utility_row2 = new Discord.MessageActionRow().addComponents(switch_hub_button, display_inventory_button)

    const utility_row1 = new Discord.MessageActionRow().addComponents(warp_select)

    

    let choosenBoolean;
    if (interaction.options.getString('first-person') === 'true') {
      choosenBoolean = true
    } else {
      choosenBoolean = false
    }

    let triggered;
    let p = null;

    bot.once("spawn", async () => {
      mineflayerViewer(bot, { port: 3000, firstPerson: choosenBoolean })
      await interaction.editReply({ embeds: [embed], components: [row1, row2, current_row] })
      bot.setControlState("sprint", true)

      
      pingUser(interaction)

      //click movement
      if (interaction.options.getString('allow-click-movement') && !triggered) {

        triggered = true
        bot.loadPlugin(pathfinder)

        bot.on('path_update', (r) => {
          //console.log(r)
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
          //bot.viewer.drawLine('path', path, 0xff00ff)
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
          const button_state = 4;

          if (button === button_state) {
          p = block.position.offset(0, 1, 0)

          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
          } else if(button === 3) {
            dig(bot, interaction, block.name)
          }
        })

      //add
        bot.on("physicsTick", () => {
          if(!p) return
          if(bot.entity.position.distanceTo(p) < 1) {
            p = null
            bot.setControlState("forward", false)
            bot.setControlState("jump", false)
            return
          }
          bot.setControlState("sprint", true)
  bot.movement.steer(p, 10, "average")
        //  bot.movement.steer(p, 8, "average")
}); 
      }

    })

    const collector = menu.createMessageComponentCollector({
      //componentType: ['BUTTON', 'SELECT_MENU'],
      time: 840000, //14 mins
    });


    const player_actions = ["kill", "jump", "forward", "left", "right", "back", "jump", "message", "mine", "turn", "interact", "attack", "set_block", "nearby_blocks"]
    const npc_actions = ["close_npc", "leftclick_npc_slot", "rightclick_npc_slot", "refresh"]
    
    const movement_array = ["left", "right", "forward", "back", "jump"]

    const global_actions = ["show_lore", "display_inventory"]

    const utility_actions = ["switch_hub", "quick_walk"]

    const change_row = ["previous", "next"]

    collector.on("collect", async (i) => {

      //console.log(utility_row1)

//console.log(bot.players)
     // const lines = bot.scoreboard.sidebar.items.map(e => e.displayName.toString())  

      
      const sb = parseScoreboard(bot)

      const players_nearby = Object.values(bot.players).filter(a => a.uuid.charAt(14) == 4 && a.entity && a.ping == 1).length

      
      embed.setFooter(`❤️ Health: ${sb.health}\n💰 Purse: ${sb.coins}\nPlayers nearby: ${players_nearby}`)
      
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
          bot.setControlState(i.customId, false)
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

        if(block_to_mine !== '') {
          block = block_to_mine
        } else {
        
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
        }
        
        dig(bot, interaction, block)
      } else if(i.customId === "turn") {
        bot.look(bot.entity.yaw-(3.14/4), 0, false)
      } else if(i.customId === "interact") {
        
        const entity = bot.nearestEntity()
        
        //console.log(entity.name)
        //console.log(bot.nearestEntity())

        if(entity) {

          await bot.activateEntity(entity)

          if(entity.name !== "ArmorStand") return
          bot._client.write('use_entity', {target: entity.id, mouse: 2, x: 0.15, y: 1.5, z: -0.25, hand: 0}) 
        
          
        } else {
          embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nCan't find NPC to interact with.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

  interaction.editReply({embeds: [embed]})
        }
      } else if(i.customId === "attack") {
        const entity = bot.nearestEntity(entity => entity.type === "mob")
        if(!entity) {
          return interaction.editReply({content: "no mob found to attack"})
        } else {
        bot.attack(entity)
        }
      } else if(i.customId === "set_block") {
        interaction.editReply({content: 'say the block name to set as quick mine block'})
        const filter = m => m.author.id === interaction.user.id;

        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            //console.log(collected)
            let content = collected.values()
            content = content.next().value.content.toLowerCase()
            let message = collected.values()
            interaction.channel.messages.fetch(message.next().value.id).then(msg => msg.delete())

            const mcData = require('minecraft-data')(bot.version)
            console.log(mcData.blocksByName[content])

            if(mcData.blockByName[content]) {
            block_to_mine = content;
            embed.setDescription(`set block to mine to ${content}`)
            } else {
              embed.setDescription(`${block} isnt a valid block name`)
            }
            interaction.editReply({embeds: [embed]})
          })
          .catch(collected => {
            console.log(collected)
            embed.setDescription('Nothing said to execute/send within 30 Seconds or block not found')
            return interaction.editReply({embeds: [embed]})
          });
      } else if(i.customId === "nearby_blocks") {
        const blocks = bot.findBlocks({
matching: (block) => block.position.distanceTo(bot.entity.position) < 4,
          count: 50
})
        let data = []
        let str = '';

        for(const block of blocks) {
          //console.log(block)
          
          let bl = bot.blockAt(block)
          if(!data.find(b => b.name === bl.name || b.displayName === bl.displayName)) {
            //console.log(bl)
            data.push({
              name: bl.name,
              displayName: bl.displayNams
            })
            str += `Name: **${bl.name}**, Display: **${bl.displayName}**\n`
          } else {
            continue;
          }
        }

        interaction.followUp({content: `${str}`, ephemeral: true})
        data = []
        str = ''
      }
      } else if(npc_actions.includes(i.customId)) {
        if(i.customId === "close_npc") {
          if(bot.currentWindow) {
          bot.closeWindow(bot.currentWindow)
          } else {
            try {
              bot.closeWindow(bot.window)
            } catch (error) {
              
            }
          }
      
        } else if(i.customId === "leftclick_npc_slot" || i.customId === "rightclick_npc_slot") {
          let slotToClick;
          
          const filter = m => m.author.id === interaction.user.id;      
        interaction.editReply({content: 'Slot number to click (slots start with 1 and go from left to right then a row down).'})

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
              slotToClick--
            }
          })
          .catch(collected => {
            embed.setDescription('No slot number said within 30 Seconds')
            return interaction.editReply({embeds: [embed]})
          })

          //console.log(slotToClick)

          if(i.customId === "leftclick_npc_slot") {
            if(!bot.currentWindow) {
              slotToClick += 9
            }
          await bot.simpleClick.leftMouse (slotToClick)
          } else {
            await bot.simpleClick.rightMouse(slotToClick)
          }

          //console.log(bot.currentWindow)
            embed.setDescription(`**NPC Inventory**\n${renderInventory(bot.currentWindow, interaction, true)}\n\n**Player Inventory (Updates once closed)**\n${renderInventory(bot.inventory, interaction, false)}`)

interaction.editReply({embeds: [embed]})
      } else if(i.customId === "refresh") {
          //console.log(bot.currentWindow)
          if(!bot.currentWindow) {
            currentRow = 1
          current_row.components[0].label = "Main (1/3)"
          current_row.components[2].disabled = false
          current_row.components[1].disabled = true
            embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nAction **${i.customId}** done executing.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)

            interaction.editReply({embeds: [embed], components: [row1, row2, current_row]})
          } else {
            embed.setDescription(`**NPC Inventory** (Sometimes needs manual refresh)\n${renderInventory(bot.currentWindow, interaction, true)}\n\n**Player Inventory** (Updates once closed)\n${renderInventory(bot.inventory, interaction, false)}`)

interaction.editReply({embeds: [embed]})
          }
        }
      } else if(global_actions.includes(i.customId)) {
        if(i.customId === "show_lore") {
          let slotToClick;
          let inv;
          const filter = m => m.author.id === interaction.user.id;
          
          interaction.editReply({content: 'Slot number to click (slots start with 1 and go from left to right then a row down).'})

        await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            let content = collected.values()
            content = content.next().value.content
            let message = collected.values()
            interaction.channel.messages.fetch(message.next().value.id).then(msg => msg.delete())
            const check = Number(content)
            //console.log(bot.window.slots.length)
            if(!bot.currentWindow) {
              inv = bot.inventory
            } else {
              inv = bot.currentWindow
            }
            if(typeof check !== "number" && check <= inv.slots.length) {
              embed.setDescription("Invalid number entered or invalid slot")
              return interaction.editReply({embeds: [embed]})
            } else {
              slotToClick = check
              slotToClick--
            }
          })
          .catch(collected => {
            embed.setDescription('No slot number said within 30 Seconds')
            return interaction.editReply({embeds: [embed]})
          })

          //handle getting lore
          if(!bot.currentWindow) {
            slotToClick += 9
          }
          const lore = parseLore(inv, slotToClick, bot)

          const displayEmbed = new Discord.MessageEmbed().setTitle('Item Lore').setColor('GREEN').setDescription(`**Name:** ${format(lore.name)} ${getEmoji({name: lore.name, id: lore.id})}\n**ID:** ${lore.id}\n**Lore:** ${format(lore.lore)}`).setFooter("This message automatically gets deleted after 15 seconds.")

          interaction.followUp({embeds: [displayEmbed]}).then(msg => {
            setTimeout(() => {
              try {
                msg.delete()
              } catch (e) {}
            }, 15000)
          })
        }
      } else if(change_row.includes(i.customId)) {
        //console.log(currentRow)
        if(currentRow === 1) {
  
          currentRow = 2
          current_row.components[0].label = "Mining (2/3)"
          current_row.components[2].disabled = false
          current_row.components[1].disabled = false
          interaction.editReply({components: [mining_row, current_row]})
        } else if(currentRow === 2) {
          if(i.customId === "previous") {
          
          currentRow = 1
          current_row.components[0].label = "Main (1/3)"
          current_row.components[2].disabled = false
          current_row.components[1].disabled = true
          interaction.editReply({components: [row1, row2, current_row]})
          } else if(i.customId === "next") {
            currentRow = 3
            current_row.components[0].label = "Utility (3/3)"
          current_row.components[2].disabled = true
          current_row.components[1].disabled = false
          interaction.editReply({components: [utility_row1, utility_row2, current_row]})
          }
        } else if(currentRow === 3) {
          currentRow = 2
          current_row.components[0].label = "Mining (2/3)"
          current_row.components[2].disabled = false
          current_row.components[1].disabled = false
          interaction.editReply({components: [mining_row, current_row]})
        }
      } else if(utility_actions.includes(i.customId)) {
        if(i.customId === "switch_hub") {
          const mcData = require('minecraft-data')(bot.version)
          const defaultMove = new Movements(bot, mcData)
          
          bot.chat("/hub")
          await sleep(750)
          bot.chat("/hub")
          await sleep(250)
          //add going to npc clicking etc
          bot.pathfinder.setMovements(defaultMove)
          p = { x: -11, y: 70, z: -67}
    bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))

          await sleep(3000)

          const entity = bot.nearestEntity(entity => entity.position.x === -10 && entity.position.y === 70 && entity.position.z === -67 && entity.id === 1021) //Hub Selector
          //console.log(entity)
          bot.activateEntity(entity)
          await sleep(1500)
          bot.simpleClick.leftClick(49)
        } else if(i.customId === 'quick_walk') {

          const mcData = require('minecraft-data')(bot.version)
          const defaultMove = new Movements(bot, mcData)
          bot.pathfinder.setMovements(defaultMove)
          
          const area = i.values[0]
          p = getCoords(area)
          

          bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
            interaction.followUp({content: `started traveling to ${area}`, ephemeral: true})
        
        }
      } //add next group

      const no_default_edit = ["interact", "leftclick_npc_slot", "rightclick_npc_slot", "close_npc", "show_lore", "previous", "next", "refresh", "set_block"]
    if(!no_default_edit.includes(i.customId)) {
      embed.setDescription(`[Browser](https://Minecraft-to-Discord.baltrazz.repl.co)\nAction **${i.customId}** done executing.\n\n**Inventory**\n${renderInventory(bot.inventory, interaction, false)}`)
      
      await interaction.editReply({embeds: [embed]})
     // console.log(bot.teams)
    }

    }) //collector
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

function getCoords(area) {
  if(area === "bank") {
    return { x: -24, y: 71, z: -58 }
  } else if(area === "bazaar") {
    return { x: -39, y: 70, z: -78 }
  } else if(area === "auction_house") {
    return { x: -31.5, y: 73, z: -95 }
  }
}