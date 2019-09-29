import store from './store'
import {
  createdSingleTodo,
  deletedSingleTodo,
  updatedSingleTodo
} from './reducers/todosReducer'
import firebase from 'firebase'

//setup
const firebaseConfig = {
  apiKey: 'AIzaSyBCBBBIIxYR3DGH-THrqlpsPtvQJvgK6i8',
  authDomain: 'todo-pwa-b23f4.firebaseapp.com',
  databaseURL: 'https://todo-pwa-b23f4.firebaseio.com',
  projectId: 'todo-pwa-b23f4',
  storageBucket: 'todo-pwa-b23f4.appspot.com',
  messagingSenderId: '135069503114',
  appId: '1:135069503114:web:6f2b4aa22e872bb1ffe773',
  measurementId: 'G-Q1YBRZHFL1'
}
firebase.initializeApp(firebaseConfig)
// firebase.analytics()
const db = firebase.firestore()
const messaging = firebase.messaging()
navigator.serviceWorker
  .register('./serviceWorker.js')
  .then(registration => messaging.useServiceWorker(registration))
messaging.usePublicVapidKey(
  'BI2LNVVMi3LRhsceua9iuQW34nGB0F8ASgcm1JUQhxmjBkhDffPnI_7Q60bD7FXz7QvdSOcyR4paW9JfilcKWoQ'
)

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('Notification permission granted.')
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging
      .getToken()
      .then(currentToken => {
        if (currentToken) {
          console.log('token received ', currentToken)
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log(
            'No Instance ID token available. Request permission to generate one.'
          )
          // Show permission UI.
          // updateUIForPushPermissionRequired()
          // setTokenSentToServer(false)
        }
      })
      .catch(err => {
        console.log('An error occurred while retrieving token. ', err)
        // showToken('Error retrieving Instance ID token. ', err)
        // setTokenSentToServer(false)
      })
  } else {
    console.log('Unable to get permission to notify.')
  }
})

// enable offline data
db.enablePersistence().catch(function(err) {
  if (err.code == 'failed-precondition') {
    // probably multible tabs open at once
    console.log('persistance failed')
  } else if (err.code == 'unimplemented') {
    // lack of browser support for the feature
    console.log('persistance not available')
  }
})

// real-time listener
db.collection('todos').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    let todo = change.doc.data()
    todo.id = change.doc.id
    if (change.type === 'added') {
      store.dispatch(createdSingleTodo(todo))
    } else if (change.type === 'removed') {
      store.dispatch(deletedSingleTodo(todo.id))
    } else if (change.type === 'modified') {
      store.dispatch(updatedSingleTodo(todo))
    }
  })
})

//adding to firebase
export const addTodoFirebase = todo => {
  db.collection('todos')
    .add(todo)
    .catch(err => console.log(err))
}

//removing from firebase
export const removeTodoFirebase = todoId => {
  db.collection('todos')
    .doc(todoId)
    .delete()
    .catch(err => console.log(err))
}

//editing firebase
export const editTodoFirebase = todo => {
  const editedTodo = {...todo}
  const id = editedTodo.id
  delete editedTodo.id
  db.collection('todos')
    .doc(id)
    .update(editedTodo)
    .catch(err => console.log(err))
}
