const Discord = require('discord.js')
const express = require('express')
const mineflayer = require('mineflayer')
let started = false

module.exports = {
  name: "fragbot",
  async execute(interaction) {

    if (!fragbotstate) {
      if (interaction.user.id !== '570267487393021969') return

      interaction.editReply('starting . . .')
    }

    global.allowed_names = ['baltrazyt', 'itsj4s0n', 'altpapier', 'mattthecuber', 'skyrats']
    let sent = false
    let in_party = false
    let locationCheck = false
    let uses = 1

    setTimeout(() => {
      locationCheck = true
    }, 60000)

    const app = express()
    if (!started) {
      started = true
      app.listen(3000)
    }
    app.get('/', (req, res) => {
      res.send('Fragbot online')
    })

    const bot = mineflayer.createBot({
      host: 'hypixel.net',
      username: process.env.MINECRAFT_EMAIL,
      password: process.env.MINECRAFT_PASSWORD,
      version: "1.8.9",
      viewDistance: 'tiny'
    })

    setInterval(() => {
      bot.chat('/locraw')
    }, 30000)

    bot._client.on('transaction', function(packet) {
      packet.accepted = true
      bot._client.write('transaction', packet)
    })

    bot.on('end', async (end) => {
      await sleep(10000)
      dclient.slashcommands.get('fragbot').execute()
    })

    bot.once('spawn', async () => {
      dclient.channels.cache.get('925799810722852964').send({
        content: `Bot logged into Hypixel. <t:${(Date.now() / 1000).toFixed()}:f>`
      })
      if (sent) return
      sent = true
      if (!fragbotstate) {
        interaction.editReply(`${bot.username} online!`)
      }
      visitIsland(bot, false)
    })

    bot.on('kicked', (kicked, loggedIn) => {
      console.log(kicked)
      if (!loggedIn) {
        process.exit()
      }
    })

    bot.on('message', async (msg) => {
      //Visiting Island if warped to Limbo
      if (msg.text.includes('You are AFK.')) {
        visitIsland(bot, false)
        return
      }

      //joining party
      if (msg.extra) {
        for (const m of msg.extra) {
          if (m.clickEvent) {
            for (const ign of allowed_names) {
              if (m.clickEvent.value.toLowerCase().includes(ign.toLowerCase()) && !in_party && m.clickEvent.value.startsWith('/party')) {
                in_party = true
                bot.chat(m.clickEvent.value)
                await sleep(1000)
                bot.chat(`/pc Thanks for using me as a Fragbot. Uses since Bot started ${uses}`)
                botUse(m, uses)
                uses++
                setTimeout(() => {
                  in_party = false
                  bot.chat('/p leave')
                  return
                }, 10000)
              }
            }
          }
        }
      }

      //stay on island
      if(msg.text.toLowerCase().includes('server') && msg.color === 'white' && locationCheck) {
        const obj = JSON.parse(msg.text)
        if(obj.gametype !== 'SKYBLOCK') {
          visitIsland(bot, true)
        } else {
          visitIsland(bot, false)
        }
      }
    })
  }
}

async function visitIsland(bot, inSkyblock) {
  if(!inSkyblock) {
    await bot.chat('/l')
    await sleep(10000)
    await bot.chat('/play sb')
    await sleep(10000)
  }
  await bot.chat('/visit BaltrazYT')
  await sleep(10000)
  await bot.simpleClick.leftMouse(11)
  console.log('penis yes')
  dclient.channels.cache.get('925804248908828692').send({
    content: `Reached AFK Pool. <t:${(Date.now() / 1000).toFixed()}:f>`
  })
}

function botUse(m, uses) {
  dclient.channels.cache.get('925793437318541382').send({
    content: `**${m.clickEvent.value.slice(14)}** partied me. **${uses}** use since I was started.`
  })
}

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}