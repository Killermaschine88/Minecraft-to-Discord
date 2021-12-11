const Discord = require('discord.js')

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {

    if(!interaction.isCommand()) return
    //console.log(interaction)
    if(!interaction.client.slashcommands.get(interaction.commandName)) return
    if(!interaction) return

    try {
    await interaction.deferReply()
    } catch (e) {
      return
    }

    try {
      await interaction.client.slashcommands.get(interaction.commandName).execute(interaction)
      
    } catch (err) {

      console.error(err)

      //return await interaction.followUp({ content: "Error!" })
      
    }
  }
}