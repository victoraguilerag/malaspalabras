const fetch = require('node-fetch')

const SlackBot = require('slackbots')

const API_TOKEN = 'xoxp-456143174853-457004358391-455862681427-ba1cabc925a6a19bf1fab8bff2f9c644'
const BOT_TOKEN = 'xoxb-456143174853-457324967830-sPLbZ6tqoYIa8Sd7TYpV8vfd'

//Palbaras baneadas en el grupo
const blackList = [
  'peo'
]

const bot = new SlackBot({
  token: BOT_TOKEN,
  name: 'malaspalabras'
})

//Start

bot.on('start', () => {

})

bot.on('message', (e) => {
  if (e.type !== 'message') {
    return;
  }
  handleMessage(e.text, e)
})

function handleMessage(message, e) {
  console.log(e)
  const info = {
    token: API_TOKEN,
    channel: e.channel,
    ts: e.ts,
    as_user: true
  }
  blackList.map(word => {
    if (message && message.includes(word)) {
      return fetch(`https://slack.com/api/chat.delete?token=${info.token}&channel=${e.channel}&ts=${e.ts}`, {
        method: 'post',
        body: JSON.stringify(info)
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        fetch(`https://slack.com/api/users.info?token=${info.token}&user=${e.user}`)
        .then(function(user) {
          return user.json()
        })
        .then(function(userData) {
          fetch(`https://slack.com/api/channels.info?token=${info.token}&channel=${e.channel}`)
          .then(response => response.json())
          .then(channelData => {
            const responseText = `El mensaje de ${userData.user.real_name} fue eliminado por contenido inapropiado`
            console.log(channelData.channel.name)
            sendMessage(responseText, channelData.channel.name)

          })
        })
      }).catch(function(error) {
        if(error) {
          return console.log(error)
        }
      });
    }
  })
}

function sendMessage (message, channel) {
  const params = {
    icon_emoji: ':apuntando_hacia_arriba:'
  }
  console.log(message, channel)
  bot.postMessageToChannel(

    channel,
    message,
    params
  )
}


bot.on('error', err => console.log(err))
