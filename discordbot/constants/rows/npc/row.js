const { MessageButton, MessageActionRow } = require('discord.js')

//Different Buttons
const npc_close = new MessageButton().setLabel('Close').setCustomId('close_npc').setStyle('DANGER')

const npc_click_slot = new MessageButton().setLabel('Click Slot').setCustomId('click_npc_slot').setStyle('PRIMARY')


//Different Rows
const npc_row1 = new MessageActionRow().addComponents(npc_close, npc_click_slot)


//Exporting Rows
module.exports = { npc_row1 }