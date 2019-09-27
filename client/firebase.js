import store from './store'
import {createdSingleTodo, deletedSingleTodo} from './reducers/todosReducer'
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
    }
    if (change.type === 'removed') {
      store.dispatch(deletedSingleTodo(todo.id))
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
