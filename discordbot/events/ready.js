module.exports = {
  name: "ready",
  execute(client) {

    console.log('Ready')

    const data = [
      {
        name: "start-bot",
        description: "test",
        options: [
          {
            name: "ip",
            description: "1.8.9 server ip",
            type: "STRING",
            required: true,
            autocomplete: true,
          },
          {
            name: "first-person",
            description: "if it should be first person view",
            type: "STRING",
            required: true,
            choices: [
              {
                name: "yes",
                value: "true"
              },
              {
                name: "no",
                value: "false"
              }
            ]
          },
          {
            name: "allow-click-movement",
            description: "if you can middle click to move",
            type: "STRING",
            required: false,
            choices: [
              {
                name: "yes",
                value: "yes"
              },
            ]
          },
          {
            name: "play-on-mobile",
            description: "if you are playing on mobile",
            type: "STRING",
            required: false,
            choices: [
              {
                name: "yes",
                value: "yes"
              },
            ]
          },
        ],
      },
      {
        name: "kill",
        description: "kill bot"
      },
      {
        name: "say",
        description: "send a msg",
        options: [
          {
            name: "input",
            description: "word",
            type: "STRING",
            required: true
          }
        ]
      }
    ]

     //client.guilds.cache.get('918627796132179988')?.commands.set(data);

  }
}