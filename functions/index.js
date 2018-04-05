var functions = require('firebase-functions')
var mailgun = require('mailgun-js')({'apiKey': 'key-c4f6d33e5817be7410c261daf6826a24', 'domain': 'https://seedmap.com.au'})

exports.sendWelcomeEmail = functions.database.ref('users/{uid}').onWrite(event => {

  // only trigger for new users [event.data.previous.exists()]
  // do not trigger on delete [!event.data.exists()]
  if (!event.data.exists() || event.data.previous.exists()) {
    return
  }

  var user = event.data.val()
  var email = user.email

  var data = {
    from: 'app@app.com',
    subject: 'Welcome!',
    html: `<p>Welcome! ${user.name}</p>`,
    'h:Reply-To': 'app@app.com',
    to: email
  }

  mailgun.messages().send(data, function (error, body) {
    console.log(body)
  })
})