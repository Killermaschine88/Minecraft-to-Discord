const emojis = require('../constants/emojis.json')
const sent_items = []

function dig (bot, interaction) {
  let target
  if (bot.targetDigBlock) {
    console.log(`already digging ${bot.targetDigBlock.name}`)
  } else {
    target = bot.blockAt(bot.entity.position.offset(+1, 0, 0)) //going off your lower body aka feet
    if (target && bot.canDigBlock(target)) {
      interaction.editReply(`starting to dig ${target.name}`)
      bot.dig(target, onDiggingCompleted(err, interaction))
    } else {
      console.log('cannot dig')
    }
  }
}

function onDiggingCompleted (err, interaction) {
    if (err) {
      console.log(err.stack)
      return
    }
    interaction.editReply(`finished digging ${target.name}`)
  }

function snakeFormatter(words, state) {
  if(state) {
  words = words.replace("_", " ")
  }
  
	let separateWord = words.toUpperCase().split(' ');
	
	return separateWord.join('_');
}

function renderInventory(bot, interaction) {
  let str = ''
  let i = 0

  for(const item of bot.inventory.slots) {
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
        interaction.client.channels.cache.get('919366146573090867').send(`ID: ${item.name}\nDisplayName: ${item.displayName}`)
          sent_items.push(item.displayName)
        }
      }
    }
    
    i++
    
    if(i === 9) {
      str += '\n'
      i = 0
    }
  }
  return str
}

module.exports = { dig, onDiggingCompleted, renderInventory }