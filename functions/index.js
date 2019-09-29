const functions = require('firebase-functions')
const twilio = require('twilio')
const config = require('./config.json')

const MessagingResponse = twilio.twiml.MessagingResponse

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const messaging = admin.messaging()
const userToken =
  'dseaFBZ5-jC3TOSp3lzOrR:APA91bHAA8-jtU_kwD4xX4TvsJ4RIc-EIv09PN3IojGTXnB-k2bCpCKx_NuUQM9D1F4AOqTQ4wnuGuwy3Fqxs9ecpYE_bV1TZN9fWXyGpgdlUUlfXsuF4XDZaN6XudTsDSoFCQZ-RRJh'

const projectId = process.env.GCLOUD_PROJECT
const region = 'us-central1'

exports.reply = functions.https.onRequest((req, res) => {
  let isValid = true
  console.log(req.body.Body)

  // Only validate that requests came from Twilio when the function has been
  // deployed to production.
  if (process.env.NODE_ENV === 'production') {
    isValid = twilio.validateExpressRequest(req, config.TWILIO_AUTH_TOKEN, {
      url: `https://${region}-${projectId}.cloudfunctions.net/reply`
    })
  }

  // Halt early if the request was not sent from Twilio
  if (!isValid) {
    res
      .type('text/plain')
      .status(403)
      .send('Twilio Request Validation Failed.')
      .end()
    return
  }

  // Prepare a response to the SMS message
  const response = new MessagingResponse()

  // Add text to the response
  response.message('Hello from Google Cloud Functions!')

  // Send the response
  res
    .status(200)
    .type('text/xml')
    .end(response.toString())
})

// exports.sendMessage = functions.firestore
//   .document('todos/{todoId}')
//   .onCreate(async (change, context) => {
//     // console.log(change.data())
//     const docId = context.params.todoId
//     const productRef = db.collection('todos').doc(docId)
//     return productRef.update({message: 'functions work'})
//   })

// exports.sendReminder = functions.pubsub
//   .schedule('every friday 05:00')
//   .onRun(async context => {
//     const todosSnapshot = await db.collection('todos').get()

//     const reminders = todosSnapshot.docs.map(todo => todo.data().dueAt)
//   })

exports.taskRunner = functions.pubsub
  .schedule('* * * * *')
  .onRun(async context => {
    const now = admin.firestore.Timestamp.now()

    //query all documents ready to perform
    const query = db
      .collection('todos')
      .where('dueAt', '<=', now)
      .where('done', '==', false)
      .where('notified', '==', false)
    const tasks = await query.get()

    tasks.forEach(task => {
      const {title, dueAt} = task.data()
      sendFCM({title, dueAt})
    })
  })

const sendFCM = message => {
  let payload = {
    notification: {
      title: message.title,
      body: 'is dues at ' + message.dueAt.toDate().toLocaleString()
    }
  }
  messaging
    .sendToDevice(userToken, payload)
    .then(res => console.log('sent ', res))
    .catch(e => console.log('error ', e))
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})
