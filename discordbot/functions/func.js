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

function renderInventory(bot) {
  let str = ''
  let i = 0

  for(const item of bot.inventory.slots) {
    if(!item) {
      str += '<:inv_slot:919349781594247188>'
    } else {
      //item.name for item_name_format
      str += '👍'
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