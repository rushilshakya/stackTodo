import store from './store'
import {
  createdSingleTodo,
  deletedSingleTodo,
  updatedSingleTodo
} from './reducers/todosReducer'
import firebase from 'firebase'
import toasty from 'toastify-js'

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
messaging.usePublicVapidKey(
  'BI2LNVVMi3LRhsceua9iuQW34nGB0F8ASgcm1JUQhxmjBkhDffPnI_7Q60bD7FXz7QvdSOcyR4paW9JfilcKWoQ'
)

messaging
  .requestPermission()
  .then(() => {
    console.log('Notification permission granted.')
    return messaging.getToken()
  })
  .then(token => {
    console.log('token is ', token)
  })
  .catch(err => console.log('error is ', err))

messaging.onMessage(payload => {
  toasty({
    text: payload.notification.title + ' ' + payload.notification.body,
    duration: 5000,
    newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'left', // `left`, `center` or `right`
    backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function() {} // Callback after click
  }).showToast()
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
