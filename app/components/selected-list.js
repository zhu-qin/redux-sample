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

export default SelectedList
