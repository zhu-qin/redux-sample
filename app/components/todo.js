import {
  createElement,
  div,
  ul,
  li,
  textNode,
  input,
  checkbox,
  createTree
} from '../virtual-dom/virtual-dom.js'

class Todo {
  constructor(props) {
    this.props = props
  }

  isChecked(todo) {
    let selectedList = this.props.appState.documents[`selectedTodos`]
    selectedList = selectedList ? selectedList : []
    let found = selectedList.filter((el) => el.id === todo.id)[0]
    return found ? true : false
  }

  checkboxHandler(todo) {
    return (e) => {
      if (e.currentTarget.checked) {
        this.addSelectedTodo(todo)
      } else {
        this.deleteSelectedTodo(todo)
      }
    }
  }

  deleteHandler(todo) {
    return (e) => {
      let nextState = this.props.todosDocument
      let found = nextState.todos.find((el) => todo.id === el.id)
      if (found) {
        let idx = nextState.todos.indexOf(found)
        let newTodoList = nextState.todos.slice()
            newTodoList.splice(idx, 1)
        nextState = Object.assign({}, nextState, { todos: newTodoList })
        this.deleteSelectedTodo(todo)
      }
      reduxActions.setDocuments(`todos_document_${this.props.todosDocument.uid}`, nextState)
    }
  }

  addSelectedTodo(todo) {
    let selectedList = this.props.appState.documents['selectedTodos']
    selectedList = selectedList || []
    selectedList.push(todo)
    reduxActions.setDocuments(`selectedTodos`, selectedList)
  }

  deleteSelectedTodo(todo) {
    let selectedList = this.props.appState.documents['selectedTodos']
    let idx = selectedList.indexOf(todo)
    if (idx > -1) {
      selectedList.splice(idx, 1)
    }
    reduxActions.setDocuments(`selectedTodos`, selectedList)
  }

  deleteHandler(todo, todosDocument) {
    return (e) => {
      let nextState = todosDocument
      let found = nextState.todos.find((el) => todo.id === el.id)
      if (found) {
        let idx = nextState.todos.indexOf(found)
        let newTodoList = nextState.todos.slice()
            newTodoList.splice(idx, 1)
        nextState = Object.assign({}, nextState, { todos: newTodoList })
        this.deleteSelectedTodo(todo)
      }
      reduxActions.setDocuments(`todos_document_${todosDocument.uid}`, nextState)
    }
  }

  onDragStart(todo, todosDocument) {
    return (e) => {
      e.dataTransfer.setData('text/plain', `todosDocument:${this.props.todosDocument.uid}_todo:${todo.id}`)
    }
  }

  onDragOver(todo, todosDocument) {
    return (e) => e.preventDefault()
  }

  onDragDrop(todo, todosDocument) {
    return (e) => {
      let data = e.dataTransfer.getData('text/plain')
      let draggedTodosDocument = this.props.appState.documents[`todos_document_${data.split('_')[0].split(':').pop()}`]
      let draggedTodo = draggedTodosDocument.todos.find((el) => parseInt(data.split('_')[1].split(':').pop()) === el.id)

      if (draggedTodosDocument.uid === todosDocument.uid) {
        draggedTodosDocument = todosDocument
      }

      draggedTodosDocument.todos.splice(draggedTodosDocument.todos.indexOf(draggedTodo), 1)
      todosDocument.todos.splice(todosDocument.todos.indexOf(todo) + 1, 0, draggedTodo)

      reduxActions.setDocuments(`todos_document_${draggedTodosDocument.uid}`, draggedTodosDocument)
      reduxActions.setDocuments(`todos_document_${todosDocument.uid}`, todosDocument)
    }
  }

  render() {
    let todo = this.props.todo
    let todosDocument = this.props.todosDocument
    let customData = {
      todosDocument: this.props.todosDocument,
      todo: todo
    }
    return (
      li({
        className: 'todo',
        onDragStart: this.onDragStart(todo, todosDocument),
        onDragOver: this.onDragOver(todo, todosDocument),
        onDragDrop: this.onDragDrop(todo, todosDocument),
        customData: customData,
        children: [
          checkbox({onClick: this.checkboxHandler(todo), checked: this.isChecked(todo)}),
          textNode({text: `${todo.id}, ${todo.title} `}),
          div({ className: 'button', onClick: this.deleteHandler(todo, this.props.todosDocument) })
        ]
      })
    )
  }
}


export default Todo
