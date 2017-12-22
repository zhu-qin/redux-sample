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

import Todo from './todo.js'

class TodoList {
  constructor(props) {
    this.props = props
    this.todosDocument = props.todosDocKey ? this.props.appState.documents[props.todosDocKey] : null
    this.todoForm = {
      title: "",
      description: ""
    }
  }

  changeListener(formKey) {
    return (e) => this.todoForm[formKey] = e.currentTarget.value
  }

  submitForm(e) {
    let nextTodoCount = this.props.appState.settings.todoCounter + 1

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
      let props = {
        appState: this.props.appState,
        todosDocument: this.todosDocument,
        todo: todo
      }
      return createElement(Todo, props)
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
        textNode({text: this.props.appState.users.current.firstName}),
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
