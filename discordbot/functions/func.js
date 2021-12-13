const emojis = require('../constants/emojis.json')
const { ignored } = require('./ignore.js')
const sent_items = []

function dig (bot, interaction, block) {
  const mcData = require('minecraft-data')(bot.version)

  if (bot.targetDigBlock) {
    interaction.editReply({ content: `already digging ${bot.targetDigBlock.name}`})
  }
 //console.log(mcData.blocksByName[block])

  if(!mcData.blocksByName[block]) {
    return interaction.editReply({content: `${block} not found`})
  } else {
    //
    const ids = [mcData.blocksByName[block].id]
    const target = bot.blockAt(bot.findBlocks({ matching: ids, maxDistance: 3, count: 1 })[0])
    //console.log(target)

    if (target && bot.canDigBlock(target)) {
      bot.tool.equipForBlock(target, {})
      interaction.editReply({ content: `starting to dig ${target.name}`})
      bot.dig(target, onDiggingCompleted(interaction, target))
    } else {
      interaction.editReply({content: 'cannot dig but found block'})
    }
  }
}


function onDiggingCompleted (interaction, target) {
    interaction.editReply({content: `finished digging ${target.name}`})
  }

function snakeFormatter(words, state) {

  //PRE FILTERING
  if(words.toLowerCase().includes('dye')) {
    return "INK_SACK:8" //Grey Dye
  } else if(words.toLowerCase().includes('shovel')) {
    return "SNOW_SHOVEL"
  } else if(words.toLowerCase() ==="carrot") {
    return "CARROT_ITEM"
  } else if(words.toLowerCase() === "potato") {
    return "POTATO_ITEM"
  } else if(words.toLowerCase() === "sugar canes") {
    return "SUGAR_CANE"
  } else if(words.toLowerCase() === "redstone torch") return "REDSTONE_TORCH_ON"


  if(state) {
  words = words.replace("_", " ")
  }
  
	let separateWord = words.toUpperCase().split(' ');
	
	return separateWord.join('_');
}

function renderInventory(bot, interaction, npc) {
  let str = ''
  let i = 0
  let j = 0
  let max = 0
  const maxRow = 9
  let maxShown = 0
  //console.log(bot.slots)

  if(!bot.slots) return 'No Inventory'


  if(bot.slots.length === 45) maxShown = 45 //Player Inventory
  else if(bot.slots.length === 90) maxShown = 54 //NPC Big Inventory
    else if(bot.slots.length === 81) maxShown = 45 //NPC Mid Inventory
  else maxShown = 36 //NPC Small Inventory

  //console.log(bot.slots.length)
  //console.log(maxShown)

  for(const item of bot.slots) {
    if(j < 9 && !npc) {
      //console.log("skipped")
      j++
      continue
    }
    //if(item) console.log(item)
    if(!item) {
      str += '<:inv_slot:919349781594247188>'
    } else {
      if(emojis[snakeFormatter(item.name, true)]) {
        str += emojis[snakeFormatter(item.name, true)].formatted
      } else if(emojis[snakeFormatter(item.displayName, false)]) {
        str += emojis[snakeFormatter(item.displayName, false)].formatted
      } else {
        str += '<:missing_texture:919358315421663302>' 

        if(!sent_items.includes(item.displayName)) {
        interaction.client.channels.cache.get('919366146573090867').send(`ID: **${item.name}**\nDisplayName: **${item.displayName}**\nServer: **${interaction.options.getString('ip')}**`)
          sent_items.push(item.displayName)
        }
      }
    }
    
    i++
    max++
    
    if(i === maxRow) {
      str += '\n'
      i = 0
    }
    
    if(max === maxShown) {
      //console.log("got bigger")
      break;
    }
  }
  //console.log(str)
  return str
}

function parseMessage(message) {
  return message
}

module.exports = { dig, onDiggingCompleted, renderInventory, parseMessage }