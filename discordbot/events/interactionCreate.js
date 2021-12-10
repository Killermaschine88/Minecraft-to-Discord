const Discord = require('discord.js')

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {

    if(!interaction.isCommand()) return

    await interaction.deferReply()

    try {
      interaction.client.slashcommands.get(interaction.commandName).execute(interaction)
      
    } catch (err) {

      return interaction.editReply({ content: "Error!" })
      
    }
  }
}