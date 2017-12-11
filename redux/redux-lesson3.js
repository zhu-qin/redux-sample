(function () {
  'use strict'

  function compose() {
    let fns = arguments
    let start = fns.length - 1
    return function() {
       let i = start
       let result = fns[start].apply(this, arguments)
       while (i--) {
         result = fns[i].call(this, result)
       }
     return result
    }
  }

  function applyMiddeware(middlewares) {
    return (createStore) => (mainReducer, preloadedState, storeEnhancer) => {
      let store = createStore(mainReducer, preloadedState, storeEnhancer)
      let dispatch = store.dispatch
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)
      }

      let chain = middlewares.map((middleware) => middleware(middlewareAPI))
      let newDispatch = compose(chain)(store.dispatch)
      return {
        getState: store.getState,
        subscribe: store.subscribe,
        dispatch: newDispatch
      }
    }
  }

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

  function createStore(mainReducer, preloadedState, storeEnhancer) {

    if (storeEnhancer) {
      return storeEnhancer(createStore)(mainReducer, preloadedState)
    }

    let state = preloadedState
    let listeners = []

    function dispatch(action) {
      state = mainReducer(state, action)
      listeners.forEach((listener) => listener())
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
