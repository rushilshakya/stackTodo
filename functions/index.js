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
  'cjo5iy0jUdyKiO5Afaz-IV:APA91bHyF_y_8J3q7ia5W61O4rmbqf498QOqXIiafisVFUs26lEP3_7GwbssHNVVt5m_xWEJAQUNkqA1ioqRf_8zy3dnx8bbI1LQdIp-isqSbQCXPOwwrohg56u_s-ShoFIELXKZaH58'

const projectId = process.env.GCLOUD_PROJECT
const region = 'us-central1'

exports.reply = functions.https.onRequest(async (req, res) => {
  let isValid = true

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

  const question = req.body.Body.trim().toLowerCase()
  console.log(question)
  console.log('going to query')

  let answer = await getQueriedTasks(question)
  console.log('back from query, answer is ', answer)

  // Prepare a response to the SMS message
  const response = new MessagingResponse()

  // Add text to the response
  // response.message('Hello from Google Cloud Functions!')

  response.message(answer)

  // Send the response
  res
    .status(200)
    .type('text/xml')
    .end(response.toString())
})

const getQueriedTasks = async question => {
  console.log('inside get queried tasks')
  let answer = ''
  let queryResult
  const now = admin.firestore.Timestamp.now()

  const queryPast = db
    .collection('todos')
    .where('dueAt', '<=', now)
    .where('done', '==', false)

  const queryNext = db
    .collection('todos')
    .where('dueAt', '>', now)
    .where('done', '==', false)

  if (question === 'past') {
    console.log('quering past')
    queryResult = await queryPast.get()
    if (queryResult.size < 1) return 'you have no past due tasks'
  } else if (question === 'next') {
    console.log('quering next')
    queryResult = await queryNext.get()
    if (queryResult.size < 1) return 'you have no upcoming tasks'
  } else {
    console.log('returning help')
    return 'please ask for past or next'
  }

  queryResult.forEach(task => {
    const {title, dueAt} = task.data()
    answer += title + '-' + dueAt.toDate().toLocaleString() + '\n'
  })
  answer = answer.trim()

  return answer
}

exports.sendMessage = functions.firestore
  .document('todos/{todoId}')
  .onCreate(async (change, context) => {
    // console.log(change.data())
    const docId = context.params.todoId
    const productRef = db.collection('todos').doc(docId)
    return productRef.update({done: false, notified: false})
  })

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
