export const createElement = (type, props) => {
  return {
    type: type,
    props: props
  }
}

export const div = (props) => createElement('div', props)
export const ul = (props) => createElement('ul', props)
export const li = (props) => createElement('li', props)
export const textNode = (props) => createElement('text', props)
export const input = (props) => createElement('input', props)
export const checkbox = (props) => createElement('checkbox', props)

export const createTree = (virtualTree, container) => {

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
  let className = virtualTree.props.className

  // events
  let clickListener = virtualTree.props.onClick
  let changeListener = virtualTree.props.onChange
  // drag and drop events

  let onDragStartListener = virtualTree.props.onDragStart
  let onDragOverListener = virtualTree.props.onDragOver
  let onDragDropListener = virtualTree.props.onDragDrop

  // custom data in tags
  let customData = virtualTree.props.customData

  if (customData) {
    node.customData = customData
  }

  if (onDragStartListener) {
    node.addEventListener('dragstart', onDragStartListener)
    node.draggable = true
  }

  if (onDragOverListener) {
    node.addEventListener('dragover', onDragOverListener)
  }

  if (onDragDropListener) {
    node.addEventListener('drop', onDragDropListener)
  }

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
