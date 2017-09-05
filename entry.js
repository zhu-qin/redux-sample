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

    if (typeof virtualTree.type === 'function') {
      virtualTree = new virtualTree.type(virtualTree.props).render()
      node = document.createElement(virtualTree.type)
    } else if (virtualTree.type != 'text') {
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
  }

  class TodoList {
    constructor(props) {
      this.props = props
      this.todoID = 5
      this.addListenerToStore()
      this.todoForm = {
        title: "",
        description: ""
      }
    }

    addListenerToStore() {
      let listener = () => {
        this.state = this.props.store.getState()
        renderCompleteTree()
      }
      this.state = this.props.store.getState()
      this.props.store.subscribe(listener)
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

    render() {

      if (!this.state.todos) {
        return ul({className: 'todo-list'})
      }

      let todos = this.state.todos.map((todo) => {
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
          textNode({text: this.state.title}),
          ...todos,
          titleInput,
          submitButton
        ]
      })

      return list
    }
  }

  const renderCompleteTree = () => {
    let entry = div({
      className: 'wrapper',
      children: [
        createElement(TodoList, {store: reduxStore }),
        createElement(TodoList, {store: reduxStore }),
        createElement(TodoList, {store: reduxStore })
      ]
    })

    let root = document.getElementById('root')
    root.innerHTML = ""
    createTree(entry, root)
  }

  document.addEventListener('DOMContentLoaded', () => {

    const todosDocument = {
      type: 'TodoList',
      title: 'This is a todo list',
      id: 1000,
      todos: [
        {type: 'Todo', id: 1, title: 'hello' },
        {type: 'Todo', id: 2, title: 'goodbye' },
        {type: 'Todo', id: 3, title: 'world' }
      ]
    }

    renderCompleteTree()
    setTimeout(reduxActions.setTodosDocument.bind(null, todosDocument), 0)
  })

})()
