(function () {
  'use strict'

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
