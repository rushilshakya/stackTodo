import {combineReducers} from 'redux'
import {todosReducer} from './todosReducer'

const reducer = combineReducers({
  todos: todosReducer
})

export default reducer
