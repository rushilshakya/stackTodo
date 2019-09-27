import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createdSingleTodo, deletedSingleTodo} from '../reducers/todosReducer'

class Todos extends Component {
  componentDidMount() {
    // real-time listener
    db.collection('todos').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let todo = change.doc.data()
        todo.id = change.doc.id
        if (change.type === 'added') {
          this.props.addTodo(todo)
        }
        if (change.type === 'removed') {
          this.props.removeTodo(todo.id)
        }
      })
    })
  }

  render() {
    return (
      <div className="recipes container grey-text text-darken-1">
        {this.props.todos.map(todo => (
          <div key={todo.id} className="card-panel recipe white row">
            <img src="/img/dish.png" alt="recipe thumb" />
            <div className="recipe-details">
              <div className="recipe-title">{todo.title}</div>
              <div className="recipe-ingredients">{todo.details}</div>
            </div>
            <div className="recipe-delete">
              <i className="material-icons">delete_outline</i>
            </div>
          </div>
        ))}
      </div>
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
