import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  createdSingleTodo,
  deletedSingleTodo,
  createSingleTodo
} from '../reducers/todosReducer'
import {addTodoFirebase, removeTodoFirebase} from '../firebase'

class Todos extends Component {
  onSubmit = evt => {
    evt.preventDefault()
    const todo = {}
    todo.title = evt.target[0].value
    todo.details = evt.target[1].value
    addTodoFirebase(todo)
  }

  render() {
    return (
      <React.Fragment>
        <div className="recipes container grey-text text-darken-1">
          {this.props.todos.map(todo => (
            <div key={todo.id} className="card-panel recipe white row">
              <img src="/img/dish.png" alt="recipe thumb" />
              <div className="recipe-details">
                <div className="recipe-title">{todo.title}</div>
                <div className="recipe-ingredients">{todo.details}</div>
              </div>
              <div className="recipe-delete">
                <i
                  className="material-icons"
                  onClick={function() {
                    removeTodoFirebase(todo.id)
                  }}
                >
                  delete_outline
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
