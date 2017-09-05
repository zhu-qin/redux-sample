(function () {
  'use strict'

  window.reduxStore = Redux.createStore(todosReducer, {})
  window.reduxActions = mapDispatchToActions(reduxStore.dispatch)

  const createElement = (type, props) => {
    return {
      type: type,
      props: props
    }
  }

  const div = (props) => createElement('div', props)
  const ul = (props) => createElement('ul', props)
  const li = (props) => createElement('li', props)
  const textNode = (props) => createElement('text', props)
  const input = (props) => createElement('input', props)


  const createTree = (virtualTree, container) => {

    let node

    if (virtualTree.type != 'text') {
      node = document.createElement(virtualTree.type)
    } else if (virtualTree.type === 'text') {
      node = document.createTextNode(virtualTree.props.text)
    }

    let virtualChildren = virtualTree.props.children
    let clickListener = virtualTree.props.onClick
    let changeListener = virtualTree.props.onChange
    let className = virtualTree.props.className

    if (clickListener) {
      node.addEventListener('click', clickListener)
    }

    if (changeListener) {
      node.addEventListener('input', changeListener)
    }

    if (className) {
      className.split(" ").forEach((cl) => node.classList.add(cl))
    }

    if (virtualChildren) {
      virtualChildren.forEach((vChild) => createTree(vChild, node))
    }

    container.appendChild(node)
    return container
  }


  class TodoList {
    constructor(store, container) {
      this.store = store
      this.container = container
      this.todoID = 5
      this.addListenerToStore()
      this.todoForm = {
        title: "",
        description: ""
      }
    }

    addListenerToStore() {
      let listener = () => {
        let state = this.store.getState()
        this.render(state)
      }
      this.store.subscribe(listener)
    }

    clickHandler(todo) {
      return (e) => {
        reduxActions.deleteTodo(todo)
      }
    }

    changeListener(formKey) {
      return (e) => {
        this.todoForm[formKey] = e.currentTarget.value
      }
    }

    submitForm(e) {

      let todo = {
        title: this.todoForm.title,
        description: this.todoForm.description,
        id: this.todoID ++
      }

      this.todoForm = {
        title: "",
        description: ""
      }

      reduxActions.addTodo(todo)
    }

    render(state) {
      this.container.innerHTML = ""

      let todos = state.todos.map((todo) => {
        return (
          li({
            className: 'todo',
            children: [
              textNode({text: `${todo.title} ${todo.id}`}),
              div({ className: 'button', onClick: this.clickHandler(todo) })
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
          textNode({text: state.title}),
          ...todos,
          titleInput,
          submitButton
        ]
      })

      createTree(list, this.container)
    }
  }




  document.addEventListener('DOMContentLoaded', () => {
    new TodoList(reduxStore, document.getElementById('todos-1'))

    new TodoList(reduxStore, document.getElementById('todos-2'))

    new TodoList(reduxStore, document.getElementById('todos-3'))

    let todosDocument = {
      type: 'TodoList',
      title: 'This is a todo list',
      id: 1000,
      todos: [
        {type: 'Todo', id: 1, title: 'hello' },
        {type: 'Todo', id: 2, title: 'goodbye' },
        {type: 'Todo', id: 3, title: 'world' }
      ]
    }

    setTimeout(reduxActions.setTodosDocument.bind(null, todosDocument), 300)
  })

})()
