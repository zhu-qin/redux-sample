// store and state container and api
import mainReducer from './redux/reducers.js'
import mapDispatchToActions from './redux/actions.js'
import Redux from './redux/redux.js'

//function to set intial state

import configureInitialState from './configureInitialState.js'

// virtual dom elements and methods
import {
  createElement,
  div,
  ul,
  li,
  textNode,
  input,
  checkbox,
  createTree
} from './virtual-dom/virtual-dom.js'

// custom components
import TodoList from './components/todo-list.js'
import SelectedList from './components/selected-list.js'

// setup our store and actions
const reduxStore = Redux.createStore(Redux.combineReducers(mainReducer), {})
const reduxActions = mapDispatchToActions(reduxStore.dispatch)

// function to map state to dom
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
    let todoId = 1

    while (todoId < 50) {
      const todosList = {
        type: 'TodoList',
        'entity-type': 'document',
        title: ` todo list ${todoId}`,
        uid: 1000 + todoId,
        todos: Array(10).fill().map((el) => {
          todoId++
          return {type: 'Todo', id: todoId, title: `hello` }
        })
      }

      reduxActions.setDocuments(`todos_document_${todosList.uid}`, todosList)
    }

    reduxActions.setSettings('todoCounter', todoId)
    reduxActions.setDocuments('selectedTodos', [])

    const currentUser = {
      'entity-type': 'user',
      'id': 'test',
      'firstName': 'Bob'
    }

    configureInitialState(currentUser, {}, reduxActions)

    reduxStore.subscribe(() => renderCompleteTree(reduxStore.getState()))
    renderCompleteTree(reduxStore.getState())

    window.reduxStore = reduxStore
    window.reduxActions = reduxActions
})
