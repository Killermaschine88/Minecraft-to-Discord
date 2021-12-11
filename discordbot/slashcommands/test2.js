const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalBlock } = require('mineflayer-pathfinder').goals

module.exports = {
  name: "test2",
  async execute(interaction) {

    interaction.editReply('executed')

    const bot = mineflayer.createBot({
      host: 'localhost',
      username: process.env.MINECRAFT_EMAIL,
      password: process.env.MINECRAFT_PASSWORD,
      version: "1.8.9",
      viewDistance: 'tiny',
      colorsEnabled: false,
    })

    bot.loadPlugin(pathfinder)

    bot.once('spawn', () => {
      mineflayerViewer(bot, { port: 3000 })

      bot.on('path_update', (r) => {
        const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
        console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
        const path = [bot.entity.position.offset(0, 0.5, 0)]
        for (const node of r.path) {
          path.push({ x: node.x, y: node.y + 0.5, z: node.z })
        }
        bot.viewer.drawLine('path', path, 0xff00ff)
      })

      const mcData = require('minecraft-data')(bot.version)
      const defaultMove = new Movements(bot, mcData)

      bot.viewer.on('blockClicked', (block, face, button) => {
        if (button !== 2) return // only right click

        const p = block.position.offset(0, 1, 0)

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
      })
    })

  }
}
