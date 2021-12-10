module.exports = {
  name: "ready",
  execute(client) {

    console.log('Ready')

    const data = [
      {
        name: "test",
        description: "test",
        options: [
          {
            name: "ip",
            description: "1.8.9 server ip",
            type: "STRING",
            required: true,
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
          }
        ],
      },
    ]

    //client.guilds.cache.get('918627796132179988')?.commands.set(data);
    
  }
}