(function(){
  'use strict'

  function mapDispatchToActions(dispatch) {

    function createSetterAction(actionType) {
        return function action(string, payload) {
          if (typeof string != 'string' || string.includes(' ')) {
            throw 'first argument must be a string with no spaces for state key, second argument must be a state value'
          } else if (typeof payload === 'undefined') {
            throw 'second argument must be a state value'
          }
          dispatch({
            type: actionType,
            resource: string,
            payload: payload
          })
      }
    }

    function setCurrentDocument(doc) {
      if (doc['entity-type'] !== 'document' || !doc['uid']) {
        throw 'argument must be a nuxeo document with uid'
      }
      createSetterAction('SET_DOCUMENTS')('current', doc)
    }

    function setCurrentUser(user) {
      if (user['entity-type'] !== 'user' || !user.id) {
        throw 'argument must be a user object with id'
      }
      createSetterAction('SET_USERS')('current', user)
    }

    return {
      setUsers: createSetterAction('SET_USERS'),
      setDocuments: createSetterAction('SET_DOCUMENTS'),
      setSettings: createSetterAction('SET_SETTINGS'),
      setMessages: createSetterAction('SET_MESSAGES'),
      setStudio: createSetterAction('SET_STUDIO'),
      setCurrentDocument: setCurrentDocument,
      setCurrentUser: setCurrentUser
    }

  }

  window.mapDispatchToActions = mapDispatchToActions

})()
