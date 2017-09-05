(function () {
  'use strict'

  function todosReducer(state = {}, action) {
    Object.freeze(state)
    switch (action.type) {
      case 'SET_TODOS_DOCUMENT':
        return action.todosDocument
        break;
      case 'ADD_TODO':
          let newTodoList = state.todos.concat(action.todo)
          return Object.assign({}, state, { todos: newTodoList })
        break;
      case 'DELETE_TODO':
          let found = state.todos.find((todo) => action.todo.id === todo.id)
          if (found) {
            let idx = state.todos.indexOf(found)
            let newTodoList = state.todos.slice()
                newTodoList.splice(idx, 1)
            return Object.assign({}, state, { todos: newTodoList })
          } else {
            return state
          }
        break;
      default:
        return state
    }
  }

  window.todosReducer = todosReducer

})()
