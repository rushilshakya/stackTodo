importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-messaging.js')

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

const messaging = firebase.messaging()
