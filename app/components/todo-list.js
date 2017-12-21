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

class TodoList {
  constructor(props) {
    this.appState = props.appState ? props.appState : {}
    this.todosDocument = props.todosDocKey ? this.appState.documents[props.todosDocKey] : null
    this.todoForm = {
      title: "",
      description: ""
    }
  }

  deleteHandler(todo) {
    return (e) => {
      let nextState = this.todosDocument
      let found = nextState.todos.find((el) => todo.id === el.id)
      if (found) {
        let idx = nextState.todos.indexOf(found)
        let newTodoList = nextState.todos.slice()
            newTodoList.splice(idx, 1)
        nextState = Object.assign({}, nextState, { todos: newTodoList })
        this.deleteSelectedTodo(todo)
      }
      reduxActions.setDocuments(`todos_document_${this.todosDocument.uid}`, nextState)
    }
  }

  addSelectedTodo(todo) {
    let selectedList = this.appState.documents['selectedTodos']
    selectedList = selectedList || []
    selectedList.push(todo)
    reduxActions.setDocuments(`selectedTodos`, selectedList)
  }

  deleteSelectedTodo(todo) {
    let selectedList = this.appState.documents['selectedTodos']
    let idx = selectedList.indexOf(todo)
    if (idx > -1) {
      selectedList.splice(idx, 1)
    }
    reduxActions.setDocuments(`selectedTodos`, selectedList)
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

  changeListener(formKey) {
    return (e) => this.todoForm[formKey] = e.currentTarget.value
  }

  isChecked(todo) {
    let selectedList = this.appState.documents[`selectedTodos`]
    selectedList = selectedList ? selectedList : []
    let found = selectedList.filter((el) => el.id === todo.id)[0]
    return found ? true : false
  }

  submitForm(e) {
    let nextTodoCount = this.appState.settings.todoCounter + 1

    let todo = {
      title: this.todoForm.title,
      description: this.todoForm.description,
      id: nextTodoCount
    }

    this.todoForm = {
      title: "",
      description: ""
    }


    this.todosDocument.todos = this.todosDocument.todos.concat(todo)
    reduxActions.setDocuments(`todos_document_${this.todosDocument.uid}`, this.todosDocument)
    reduxActions.setSettings('todoCounter', nextTodoCount)
  }

  render() {
    if (!this.todosDocument) {
      return ul({className: 'todo-list'})
    }

    let todos = this.todosDocument.todos.map((todo) => {
      return (
        li({
          className: 'todo',
          children: [
            checkbox({onClick: this.checkboxHandler(todo), checked: this.isChecked(todo)}),
            textNode({text: `${todo.id}, ${todo.title} `}),
            div({ className: 'button', onClick: this.deleteHandler(todo) })
          ]
        })
      )
    })

    let titleInput = input({
      className: 'input',
      onChange: this.changeListener('title')
    })

    let submitButton = div({
      className: 'submit',
      children: [textNode({text: 'Click To Add Todo'})],
      onClick: this.submitForm.bind(this)
    })

    let list = ul({
      className: 'todo-list',
      children: [
        textNode({text: this.appState.users.current.firstName}),
        textNode({text: this.todosDocument.title}),
        ...todos,
        titleInput,
        submitButton
      ]
    })

    return list
  }
}

export default TodoList
