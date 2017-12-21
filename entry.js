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
    constructor(props) {
      this.appState = props.appState ? props.appState : {}
      this.todosDocument = props.todosDocKey ? this.appState.documents[props.todosDocKey] : null
      this.todoForm = {
        title: "",
        description: "",
        id: TODO_ID
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

      let todo = {
        title: this.todoForm.title,
        description: this.todoForm.description,
        id: TODO_ID ++
      }

      this.todoForm = {
        title: "",
        description: ""
      }

      this.todosDocument.todos = this.todosDocument.todos.concat(todo)
      reduxActions.setDocuments(`todos_document_${this.todosDocument.uid}`, this.todosDocument)
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
              textNode({text: `${todo.id}, ${todo.title}`}),
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

    let todosDocuments = Object.keys(appState.documents)
                          .filter((todosDocKey) => todosDocKey.includes('todos_document'))
                          .map((todosDocKey) => {
                            let props = {
                                          appState: appState,
                                          todosDocKey: todosDocKey
                                        }
                            return createElement(TodoList, props)
                          })
    let entry = div({
      className: 'wrapper',
      children: [
        ...todosDocuments,
        createElement(SelectedList, appState)
      ]
    })

    let root = document.getElementById('root')
    root.innerHTML = ""
    createTree(entry, root)
  }

  document.addEventListener('DOMContentLoaded', () => {


    const todosList1 = {
      type: 'TodoList',
      'entity-type': 'document',
      title: ' todo list 1',
      uid: 1000,
      todos: [
        {type: 'Todo', id: 1, title: 'hello' },
        {type: 'Todo', id: 2, title: 'goodbye' },
        {type: 'Todo', id: 3, title: 'world' }
      ]
    }

    const todosList2 = {
      type: 'TodoList',
      'entity-type': 'document',
      title: ' todo list 2',
      uid: 1100,
      todos: [
        {type: 'Todo', id: 4, title: 'aaaaa' },
        {type: 'Todo', id: 5, title: 'bbbbb' },
        {type: 'Todo', id: 6, title: 'ccccc' }
      ]
    }

    const todosList3 = {
      type: 'TodoList',
      'entity-type': 'document',
      title: ' todo list 3',
      uid: 1200,
      todos: [
        {type: 'Todo', id: 7, title: 'xxxxx' },
        {type: 'Todo', id: 8, title: 'yyyyy' },
        {type: 'Todo', id: 9, title: 'zzzzz' }
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
    reduxActions.setDocuments(`todos_document_${todosList1.uid}`, todosList1)
    reduxActions.setDocuments(`todos_document_${todosList2.uid}`, todosList2)
    reduxActions.setDocuments(`todos_document_${todosList3.uid}`, todosList3)
  })

})()
