(function(){
  'use strict'

  function mapDispatchToActions(dispatch) {

    function checkValidKeyValue(string, value) {
      if (typeof string != 'string' || string.includes(' ')) {
        throw new TypeError('first argument must be a string with no spaces for state key, second argument must be a state value')
      } else if (value === 'undefined' || value === 'null') {
        throw new TypeError('second argument must be a state value')
      }
    }

    function createSetterAction(actionType) {
        return function action(string, payload) {
          checkValidKeyValue(string, payload)
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
      createSetterAction('set-documents')('current', doc)
    }

    function setCurrentUser(user) {
      if (user['entity-type'] !== 'user' || !user.id) {
        throw 'argument must be a user object with id'
      }
      createSetterAction('set-users')('current', user)
    }

    return {
      setUsers: createSetterAction('set-users'),
      setDocuments: createSetterAction('set-documents'),
      setSettings: createSetterAction('set-settings'),
      setMessages: createSetterAction('set-messages'),
      setStudio: createSetterAction('set-studio'),
      setCurrentDocument: setCurrentDocument,
      setCurrentUser: setCurrentUser
    }

  }

  window.mapDispatchToActions = mapDispatchToActions

})()
