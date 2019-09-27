import store from './store'
import {createdSingleTodo, deletedSingleTodo} from './reducers/todosReducer'

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
