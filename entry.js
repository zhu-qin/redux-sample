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
  const checkbox = (props) => createElement('checkbox', props)

  const createTree = (virtualTree, container) => {

    let node

    if (typeof virtualTree.type === 'function') {
      virtualTree = new virtualTree.type(virtualTree.props).render()
      node = document.createElement(virtualTree.type)
    } else if (virtualTree.type === 'text') {
      node = document.createTextNode(virtualTree.props.text)
    } else if (virtualTree.type === 'checkbox') {
      node = document.createElement('input')
      node.type = 'checkbox'
      node.checked = virtualTree.props.checked
    } else {
      node = document.createElement(virtualTree.type)
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
      this.appState = appState ? appState : {}
      this.currentDocument = appState && appState.documents ? appState.documents.current : {}
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

    checkboxHandler(todo) {
      return (e) => {
        if (e.currentTarget.checked) {
          let selectedList = this.appState.documents['selectedTodos']
          selectedList = selectedList || []
          selectedList.push(todo)
          reduxActions.setDocuments(`selectedTodos`, selectedList)
        } else {
          let selectedList = this.appState.documents['selectedTodos']
          let idx = selectedList.indexOf(todo)
          selectedList.splice(idx ,1)
          reduxActions.setDocuments(`selectedTodos`, selectedList)
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
      if (!this.currentDocument) {
        return ul({className: 'todo-list'})
      }

      let todos = this.currentDocument.todos.map((todo) => {
        return (
          li({
            className: 'todo',
            children: [
              checkbox({onClick: this.checkboxHandler(todo), checked: this.isChecked(todo)}),
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
          textNode({text: this.appState.users.current.firstName}),
          textNode({text: this.currentDocument.title}),
          ...todos,
          titleInput,
          submitButton
        ]
      })

      return list
    }
  }

  class SelectedList {
    constructor(appState) {
      this.appState = appState ? appState : {}
      this.currentDocument = appState && appState.documents ? appState.documents.current : {}
    }

    render() {
      let selectedTodos = this.appState.documents['selectedTodos']

      let selectedTodoList = selectedTodos ? selectedTodos.map((todo) => {
        return (
          li({
            className: 'todo',
            children: [
              textNode({text: `${todo.title} ${todo.id}`}),
            ]
          })
        )
      }) : []

      let list = ul({
        className: 'todo-list',
        children: [
          textNode({text: 'Selected Todos'}),
          ...selectedTodoList
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
        createElement(TodoList, appState),
        createElement(SelectedList, appState)
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
      title: ' todo list',
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

    window.configureInitialState(currentUser, {}, reduxActions)
    reduxStore.subscribe(() => renderCompleteTree(reduxStore.getState()))
    renderCompleteTree(reduxStore.getState())
    setTimeout(reduxActions.setCurrentDocument.bind(null, todosDocument), 0)
  })

})()
