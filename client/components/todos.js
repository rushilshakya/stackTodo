import React, {Component} from 'react'
import {connect} from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import contentEditable from './contentEditable'
import {
  createdSingleTodo,
  deletedSingleTodo,
  createSingleTodo
} from '../reducers/todosReducer'
import {
  addTodoFirebase,
  removeTodoFirebase,
  editTodoFirebase
} from '../firebase'

class Todos extends Component {
  constructor() {
    super()
    this.state = {}
  }
  onSubmit = evt => {
    evt.preventDefault()
    const todo = {}
    todo.title = evt.target[0].value
    todo.details = evt.target[1].value
    todo.done = false
    todo.createdAt = new Date()
    todo.notified = false
    addTodoFirebase(todo)
  }

  toggleDone = todo => {
    const toggledTodo = {...todo}
    toggledTodo.done = !toggledTodo.done
    editTodoFirebase(toggledTodo)
  }

  onSave = editedTodo => editTodoFirebase(editedTodo)

  handleDateChange = (selectedDate, id) => {
    // this.toggleDateView(id)
    editTodoFirebase({id, dueAt: selectedDate})
  }

  // toggleDateView = todoId => this.setState({[todoId]: !this.state[todoId]})
  toggleDateView = todoId =>
    this.setState(prevState => ({[todoId]: !prevState[todoId]}))

  render() {
    let EditableDiv = contentEditable('div')
    return (
      <React.Fragment>
        <div className="recipes container grey-text text-darken-1">
          {this.props.todos.map(todo => (
            <div key={todo.id} className="card-panel recipe white row">
              <img src="/img/dish.png" alt="recipe thumb" />
              <div className="recipe-details">
                <EditableDiv
                  className="recipe-title"
                  value={todo.title}
                  onSave={value => this.onSave({id: todo.id, title: value})}
                />
                <EditableDiv
                  className="recipe-ingredients"
                  value={todo.details}
                  onSave={value => this.onSave({id: todo.id, details: value})}
                />
              </div>
              <div className="recipe-delete">
                <DatePicker
                  selected={todo.dueAt ? todo.dueAt.toDate() : ''}
                  onChange={selectedDate =>
                    this.handleDateChange(selectedDate, todo.id)
                  } //only when value has changed
                  popperPlacement="left-start"
                  open={this.state[todo.id]}
                  onClickOutside={() => this.toggleDateView(todo.id)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MM d, yy h:mm aa"
                />
                <i
                  className="material-icons"
                  onClick={() => this.toggleDateView(todo.id)}
                >
                  calendar_today
                </i>
                <i
                  className="material-icons"
                  onClick={() => removeTodoFirebase(todo.id)}
                >
                  delete_outline
                </i>
                {/* <i
                  className="material-icons"
                  onClick={() => {
                    editTodoFirebase(todo)
                  }}
                >
                  edit_outline
                </i> */}
                <i
                  className="material-icons"
                  onClick={() => this.toggleDone(todo)}
                >
                  {todo.done ? (
                    <div>check_circle</div>
                  ) : (
                    <div>check_circle_outline</div>
                  )}
                </i>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="center">
            <a
              className="btn-floating btn-small btn-large add-btn sidenav-trigger"
              data-target="side-form"
            >
              <i className="material-icons">add</i>
            </a>
          </div>

          {/* add todo side nav */}
          <div id="side-form" className="sidenav side-form">
            <form
              className="add-recipe container section"
              onSubmit={this.onSubmit}
            >
              <h6>New TODO</h6>
              <div className="divider"></div>
              <div className="input-field">
                <input
                  placeholder="e.g. TODO Item"
                  id="title"
                  type="text"
                  className="validate"
                />
                <label htmlFor="title">TODO Title</label>
              </div>
              <div className="input-field">
                <input
                  placeholder="e.g. Do this, Do that"
                  id="details"
                  type="text"
                  className="validate"
                />
                <label htmlFor="details">details</label>
              </div>
              <div className="input-field center">
                <button className="btn-small">Add</button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  todos: state.todos.all
})

const mapDispatchtoProps = dispatch => ({
  // fetchCampuses: () => dispatch(getAllCampuses()),
  // removeCampus: campusId => dispatch(deleteSingleCampus(campusId))
  addTodo: todo => dispatch(createdSingleTodo(todo)),
  removeTodo: todoId => dispatch(deletedSingleTodo(todoId))
})

const connectedTodos = connect(
  mapStateToProps,
  mapDispatchtoProps
)(Todos)

export default connectedTodos
