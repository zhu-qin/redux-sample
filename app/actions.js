(function(){
  'use strict'

  function mapDispatchToActions(dispatch) {
    return {
      setTodosDocument: (todosDocument) => dispatch({
        type: 'SET_TODOS_DOCUMENT',
        todosDocument: todosDocument
      }),

      addTodo: (todo) => dispatch({
        type: 'ADD_TODO',
        todo: todo
      }),

      deleteTodo: (todo) => dispatch({
        type: 'DELETE_TODO',
        todo: todo
      })
    }
  }

  window.mapDispatchToActions = mapDispatchToActions

})()
