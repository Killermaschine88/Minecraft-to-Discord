module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if(message.author.id !== '570267487393021969') return
    if(message.channel.id === process.env.MESSAGE_LOGS_CHANNEL) {
      client.bot.chat(message.content)
    }

    //fragbot
    if(message.channel.id === '925810140681224203') {
      allowed_names.push(message.content)
      message.channel.send(`**${message.content}** added.`)
      message.delete()
    }

    //add removeing people from array
  }
}