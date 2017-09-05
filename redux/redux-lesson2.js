(function () {
  'use strict'

  function combineReducers(reducers) {
    return function mainReducer(state, action) {
      let stateHasChanged = false
      let nextState = {}
      Object.keys(reducers).forEach((reducerKey) => {
        let prevStateSlice = state[reducerKey]
        let nextStateSlice = reducers[reducerKey](prevStateSlice, action)
        if (prevStateSlice != nextStateSlice) {
          stateHasChanged = true
        }
        nextState[reducerKey] = nextStateSlice
      })
      return stateHasChanged ? nextState : state
    }
  }

  function createStore(preloadedState = {}, mainReducer) {
    let state = preloadedState
    let listeners = []

    function dispatch(action) {
      let nextState = mainReducer(state, action)
      if (state != nextState) {
        state = nextState
        listeners.forEach((listener) => listener())
      }
    }

    function subscribe(listener) {
      listeners.push(listener)
      return function unsubscribe() {
        let idx = listeners.indexOf(listener)
        listeners.splice(idx, 1)
      }
    }

    function getState() {
      return state
    }

    return {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState
    }

  }

})()
