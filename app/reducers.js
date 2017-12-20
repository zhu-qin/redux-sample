(function () {
  'use strict';

  function getType(val) {
    let type
    if (typeof val === 'string') {
      type = String
    } else if (typeof val === 'number') {
      type = Number
    } else if (typeof val === 'boolean') {
      type = Boolean
    } else if (typeof val === ' symbol') {
      type = Symbol
    } else if (Array.isArray(val)) {
      type = Array
    } else if (val && typeof val === 'object') {
      type = Object
    }
    return type
  }

  function createSetterReducer(actionType) {
    const typeCheck = {}

    return function setterReducer(state = {}, action) {
        let nextState
        if (actionType === action.type) {
          if (Array.isArray(action.payload)) {
            action.payload = Object.assign([], action.payload)
          } else if (action.payload && typeof action.payload === 'object') {
            action.payload = Object.assign({}, action.payload)
          }
          // sets the type on inital setter
          if (!(action.resource in state)) {
            typeCheck[action.resource] = getType(action.payload)
            console.warn(`${action.type} is setting a new key and value for state.${action.type.split('-').pop()}.${action.resource}
              ${typeCheck[action.resource].name} is the input type`)
          }
          // checks type for each value that is set
          if (typeCheck[action.resource].name !== getType(action.payload).name) {
            throw new TypeError(`Initial type for state.${action.type.split('-').pop()}.${action.resource} is of type ${typeCheck[action.resource].name}, input is of type ${getType(action.payload).name}`)
          }

          nextState = Object.assign({}, state, { [action.resource]: action.payload })
        } else {
          nextState = state
        }
        
        return Object.freeze(nextState)
    }
  }

  window.mainReducer = {
    users: createSetterReducer('set-users'),
    settings: createSetterReducer('set-settings'),
    documents: createSetterReducer('set-documents'),
    messages: createSetterReducer('set-messages'),
    studio: createSetterReducer('set-studio')
  }

})()
