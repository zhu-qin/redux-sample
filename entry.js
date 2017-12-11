(function () {
  'use strict'

  window.reduxStore = Redux.createStore(Redux.combineReducers(mainReducer), {})
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

  let TODO_ID = 10

  class TodoList {
    constructor(appState) {
      this.currentDocument = appState ? appState.documents.current : {}
      this.todoForm = {
        title: "",
        description: "",
        id: TODO_ID
      }
    }

    deleteHandler(todo) {
      return (e) => {
        let nextState = this.currentDocument
        let found = nextState.todos.find((el) => todo.id === el.id)
        if (found) {
          let idx = nextState.todos.indexOf(found)
          let newTodoList = nextState.todos.slice()
              newTodoList.splice(idx, 1)
          nextState = Object.assign({}, nextState, { todos: newTodoList })
        }
        reduxActions.setCurrentDocument(nextState)
      }
    }

    changeListener(formKey) {
      return (e) => this.todoForm[formKey] = e.currentTarget.value
    }

    submitForm(e) {

      let todo = {
        title: this.todoForm.title,
        description: this.todoForm.description,
        id: TODO_ID ++
      }

      this.todoForm = {
        title: "",
        description: ""
      }

      this.currentDocument.todos = this.currentDocument.todos.concat(todo)
      reduxActions.setCurrentDocument(this.currentDocument)
    }

    render() {
      if (!this.currentDocument || !this.currentDocument.todos) {
        return ul({className: 'todo-list'})
      }

      let todos = this.currentDocument.todos.map((todo) => {
        return (
          li({
            className: 'todo',
            children: [
              textNode({text: `${todo.title} ${todo.id}`}),
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
          textNode({text: this.currentDocument.title}),
          ...todos,
          titleInput,
          submitButton
        ]
      })

      return list
    }
  }

  const renderCompleteTree = (appState) => {
    let entry = div({
      className: 'wrapper',
      children: [
        createElement(TodoList, appState),
        createElement(TodoList, appState),
        createElement(TodoList, appState)
      ]
    })

    let root = document.getElementById('root')
    root.innerHTML = ""
    createTree(entry, root)
  }

  document.addEventListener('DOMContentLoaded', () => {


    const todosDocument = {
      type: 'TodoList',
      'entity-type': 'document',
      title: 'This is a todo list',
      uid: 1000,
      todos: [
        {type: 'Todo', id: 1, title: 'hello' },
        {type: 'Todo', id: 2, title: 'goodbye' },
        {type: 'Todo', id: 3, title: 'world' }
      ]
    }

    const currentUser = {
      'entity-type': 'user',
      'id': 'test',
      'firstName': 'Bob'
    }

    reduxStore.subscribe(() => renderCompleteTree(reduxStore.getState()))

    renderCompleteTree()
    reduxActions.setCurrentUser(currentUser)
    setTimeout(reduxActions.setCurrentDocument.bind(null, todosDocument), 0)
  })

})()
