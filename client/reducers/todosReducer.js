import axios from 'axios'

//ACTION TYPES
const GOT_ALL_TODOS = 'GOT_ALL_TODOS'
const GOT_SINGLE_TODO = 'GOT_SINGLE_TODO'
const CREATED_SINGLE_TODO = 'CREATED_SINGLE_TODO'
const DELETED_SINGLE_TODO = 'DELETED_SINGLE_TODO'
const UPDATED_SINGLE_TODO = 'UPDATED_SINGLE_TODO'
//STATUS ACTION TYPES
export const STATUS_SINGLE_TODO_NOT_FOUND = 'STATUS_SINGLE_TODO_NOT_FOUND'
export const STATUS_LOADING = 'STATUS_LOADING'

//NORMAL ACTION CREATORS
//got all
const gotAllTodos = todos => ({
  type: GOT_ALL_TODOS,
  todos
})
//got one
const gotSingleTodo = todo => ({
  type: GOT_SINGLE_TODO,
  todo
})
//requested todo not found
const singleTodoNotFound = message => ({
  type: STATUS_SINGLE_TODO_NOT_FOUND,
  message
})
//one todo created
export const createdSingleTodo = todo => ({
  type: CREATED_SINGLE_TODO,
  todo
})
//todo deleted
export const deletedSingleTodo = todoId => ({
  type: DELETED_SINGLE_TODO,
  todoId
})
//todo updated
export const updatedSingleTodo = todo => ({type: UPDATED_SINGLE_TODO, todo})
//creating status actions
const statusUpdate = (statusCd, message) => ({
  type: statusCd,
  message
})

//THUNK ACTION CREATORS
//All Todos
export const getAllTodos = () => {
  return async dispatch => {
    dispatch(statusUpdate(STATUS_LOADING, 'page loading'))
    const {data} = await axios.get('/api/todos')
    dispatch(gotAllTodos(data))
  }
}
//One Todo
export const getSingleTodo = todoId => {
  return async dispatch => {
    dispatch(statusUpdate(STATUS_LOADING, 'page loading'))
    try {
      const {data} = await axios.get(`/api/todos/${todoId}`)
      dispatch(gotSingleTodo(data))
    } catch (error) {
      dispatch(singleTodoNotFound(`Todo with ID ${todoId} does not exist`))
    }
  }
}
//Create Todo
export const createSingleTodo = todo => {
  return async dispatch => {
    const {data} = await axios.post('/api/todos', todo)
    dispatch(createdSingleTodo(data))
  }
}
//Delete Todo
export const deleteSingleTodo = todoId => {
  return async dispatch => {
    await axios.delete(`/api/todos/${todoId}`)
    dispatch(deletedSingleTodo(todoId))
  }
}
//Update todo
export const updateSingleTodo = todo => {
  return async dispatch => {
    const {data} = await axios.put(`/api/todos/${todo.id}`, todo)
    dispatch(updatedSingleTodo(data))
  }
}

//INITIAL STATE
const initialState = {
  all: [],
  single: {},
  status: '',
  message: ''
}

//REDUCER
export const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_TODOS:
      return {
        ...state,
        all: action.todos,
        single: {},
        status: '',
        message: ''
      }
    case GOT_SINGLE_TODO:
      return {...state, single: action.todo, status: '', message: ''}
    case UPDATED_SINGLE_TODO: {
      const withUpdatedTodo = state.all.map(todo => {
        if (todo.id === action.todo.id) {
          return action.todo
        } else {
          return todo
        }
      })
      return {
        ...state,
        all: withUpdatedTodo,
        single: {},
        status: '',
        message: ''
      }
    }
    case STATUS_SINGLE_TODO_NOT_FOUND:
      return {
        ...state,
        status: action.type,
        message: action.message
      }
    case STATUS_LOADING:
      return {...state, status: action.type, message: action.message}
    case CREATED_SINGLE_TODO:
      return {
        ...state,
        all: [...state.all, action.todo],
        status: '',
        message: ''
      }
    case DELETED_SINGLE_TODO: {
      const removedDeletedTodo = state.all.filter(
        todo => todo.id !== action.todoId
      )
      return {
        ...state,
        single: {students: []},
        all: removedDeletedTodo,
        status: '',
        message: ''
      }
    }
    default:
      return state
  }
}
