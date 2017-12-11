(function () {
  'use strict'

  function createSetterReducer(actionType) {
    return function setterReducer(state = {}, action) {
        if (actionType === action.type) {
          if (Array.isArray(action.payload)) {
            action.payload = Object.assign([], action.payload)
          } else if (action.payload && typeof action.payload === 'object') {
            action.payload = Object.assign({}, action.payload)
          }
          if (!(action.resource in state)) {
            console.warn(`${action.type} is setting a new key and value for state.${action.type.split('_').pop().toLowerCase()}.${action.resource}`)
          }
          return Object.assign({}, state, { [action.resource]: action.payload })
        } else {
          return state
        }
    }
  }

  window.mainReducer = {
    users: createSetterReducer('SET_USERS'),
    settings: createSetterReducer('SET_SETTINGS'),
    documents: createSetterReducer('SET_DOCUMENTS'),
    messages: createSetterReducer('SET_MESSAGES'),
    studio: createSetterReducer('SET_STUDIO')
  }

})()
