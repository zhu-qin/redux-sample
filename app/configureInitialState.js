(function() {
  'use strict'

  function configureInitialState(currentUser, nuxeoClient, reduxActions) {
    reduxActions.setCurrentUser(currentUser)

    let settings = {
      isDrawerOpen: true,
      isBreadcrumbVisible: true,
      isBreadcrumbNavigate: true
    }

    Object.keys(settings).forEach((key) => reduxActions.setSettings(key, settings[key]))
  }

  window.configureInitialState = configureInitialState
})()
