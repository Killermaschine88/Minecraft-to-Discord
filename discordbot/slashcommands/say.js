module.exports = {
  name: "say",
  async execute(interaction) {
    interaction.editReply(`${interaction.options.getString('input')}`)
  }
}