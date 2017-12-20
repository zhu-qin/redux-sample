(function () {
  'use strict'

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

   const Tuple = function( /* types */ ) {

     const typeInfo = Array.prototype.slice.call(arguments, 0)

     function checkType(type, val) {
         if (getType(val).name === type.name) {
           return val
         } else {
           throw new TypeError(`Initial type is ${type.name}, input is ${getType(val).name}`)
         }
     }

     const _T =  function( /* values */ ) {

          const values = Array.prototype.slice.call(arguments, 0)

          if (values.some((val) => val === null || val === undefined)) {
             throw new ReferenceError('Tuples may not have any null values')
          }

          if (values.length !== typeInfo.length) {
             throw new TypeError('Tuple arity does not match its prototype')
          }

          values.map(function(val, index) {
                this['_' + (index + 1)] = checkType(typeInfo[index], val)
          }, this)

          Object.freeze(this)
      }

      _T.prototype.values = () => Object.keys(this).map((key) => this[key], this)
      _T.toString = () => typeInfo.map((fn) => fn.name).join(', ')

      return _T
  }

  function createSetterReducer(actionType) {
    const typeCheck = {}

    return function setterReducer(state = {}, action) {
        if (actionType === action.type) {

          if (Array.isArray(action.payload)) {
            action.payload = Object.assign([], action.payload)
          } else if (action.payload && typeof action.payload === 'object') {
            action.payload = Object.assign({}, action.payload)
          }

          if (!(action.resource in state)) {
            typeCheck[action.resource] = Tuple(String, getType(action.payload))
            console.warn(`${action.type} is setting a new key and value for state.${action.type.split('-').pop()}.${action.resource}
              ${typeCheck[action.resource].toString()} are the input types
              `)
          }

          new typeCheck[action.resource](action.resource, action.payload)

          return Object.assign({}, state, { [action.resource]: action.payload })
        } else {
          return state
        }
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
