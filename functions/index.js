const functions = require('firebase-functions')

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()
const messaging = admin.messaging()
const userToken =
  'cQF36MK6-Pde2mfblBWRU8:APA91bHu5MWI-Afzae17j5lqxFD1E2kyHruI_ICmAl8abntEVih-TpDHeXDl-bz-G-pLX4KCt_1n0c75waN26W8KZtQWYjwngtkzCcD3LQv9voL5IScrijMIP1taIsjC7eTCuSX-5JPn'

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
      let payload = {
        notification: {
          title,
          body: 'is due at ' + dueAt.toDate().toLocaleString()
        }
      }
      messaging
        .sendToDevice(userToken, payload)
        .then(res => console.log('sent ', res))
        .catch(e => console.log('error ', e))
    })
  })

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})
