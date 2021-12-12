module.exports = {
  name: "kill",
  async execute(interaction) {
    await interaction.editReply("Shutting down.")
    process.exit()
  }
}