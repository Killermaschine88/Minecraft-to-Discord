const { MessageButton, MessageActionRow } = require('discord.js')

//Different Buttons
const npc_close = new MessageButton().setLabel('Close').setCustomId('close_npc').setStyle('DANGER')

const leftclick_npc_slot = new MessageButton().setLabel('Left Click').setCustomId('leftclick_npc_slot').setStyle('PRIMARY')

const rightclick_npc_slot = new MessageButton().setLabel('Right Click').setCustomId('rightclick_npc_slot').setStyle('PRIMARY')

const show_lore = new MessageButton().setLabel('Show Lore').setCustomId('show_lore').setStyle('PRIMARY')

const refresh = new MessageButton().setLabel("Refresh Window").setCustomId("refresh").setStyle("PRIMARY")


//Different Rows
const npc_row1 = new MessageActionRow().addComponents(npc_close, leftclick_npc_slot, rightclick_npc_slot, show_lore, refresh)


//Exporting Rows
module.exports = { npc_row1 }