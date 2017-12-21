/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _virtualDom = __webpack_require__(6);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SelectedList = function () {
  function SelectedList(appState) {
    _classCallCheck(this, SelectedList);

    this.appState = appState ? appState : {};
    this.currentDocument = appState && appState.documents ? appState.documents.current : {};
  }

  _createClass(SelectedList, [{
    key: 'render',
    value: function render() {
      var selectedTodos = this.appState.documents['selectedTodos'];

      var selectedTodoList = selectedTodos ? selectedTodos.map(function (todo) {
        return (0, _virtualDom.li)({
          className: 'todo',
          children: [(0, _virtualDom.textNode)({ text: todo.id + ', ' + todo.title })]
        });
      }) : [];

      var list = (0, _virtualDom.ul)({
        className: 'todo-list',
        children: [(0, _virtualDom.textNode)({ text: 'Selected Todos' })].concat(_toConsumableArray(selectedTodoList))
      });
      return list;
    }
  }]);

  return SelectedList;
}();

exports.default = SelectedList;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _virtualDom = __webpack_require__(6);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoList = function () {
  function TodoList(props) {
    _classCallCheck(this, TodoList);

    this.appState = props.appState ? props.appState : {};
    this.todosDocument = props.todosDocKey ? this.appState.documents[props.todosDocKey] : null;
    this.todoForm = {
      title: "",
      description: ""
    };
  }

  _createClass(TodoList, [{
    key: "deleteHandler",
    value: function deleteHandler(todo) {
      var _this = this;

      return function (e) {
        var nextState = _this.todosDocument;
        var found = nextState.todos.find(function (el) {
          return todo.id === el.id;
        });
        if (found) {
          var idx = nextState.todos.indexOf(found);
          var newTodoList = nextState.todos.slice();
          newTodoList.splice(idx, 1);
          nextState = Object.assign({}, nextState, { todos: newTodoList });
          _this.deleteSelectedTodo(todo);
        }
        reduxActions.setDocuments("todos_document_" + _this.todosDocument.uid, nextState);
      };
    }
  }, {
    key: "addSelectedTodo",
    value: function addSelectedTodo(todo) {
      var selectedList = this.appState.documents['selectedTodos'];
      selectedList = selectedList || [];
      selectedList.push(todo);
      reduxActions.setDocuments("selectedTodos", selectedList);
    }
  }, {
    key: "deleteSelectedTodo",
    value: function deleteSelectedTodo(todo) {
      var selectedList = this.appState.documents['selectedTodos'];
      var idx = selectedList.indexOf(todo);
      if (idx > -1) {
        selectedList.splice(idx, 1);
      }
      reduxActions.setDocuments("selectedTodos", selectedList);
    }
  }, {
    key: "checkboxHandler",
    value: function checkboxHandler(todo) {
      var _this2 = this;

      return function (e) {
        if (e.currentTarget.checked) {
          _this2.addSelectedTodo(todo);
        } else {
          _this2.deleteSelectedTodo(todo);
        }
      };
    }
  }, {
    key: "changeListener",
    value: function changeListener(formKey) {
      var _this3 = this;

      return function (e) {
        return _this3.todoForm[formKey] = e.currentTarget.value;
      };
    }
  }, {
    key: "isChecked",
    value: function isChecked(todo) {
      var selectedList = this.appState.documents["selectedTodos"];
      selectedList = selectedList ? selectedList : [];
      var found = selectedList.filter(function (el) {
        return el.id === todo.id;
      })[0];
      return found ? true : false;
    }
  }, {
    key: "submitForm",
    value: function submitForm(e) {
      var nextTodoCount = this.appState.settings.todoCounter + 1;

      var todo = {
        title: this.todoForm.title,
        description: this.todoForm.description,
        id: nextTodoCount
      };

      this.todoForm = {
        title: "",
        description: ""
      };

      this.todosDocument.todos = this.todosDocument.todos.concat(todo);
      reduxActions.setDocuments("todos_document_" + this.todosDocument.uid, this.todosDocument);
      reduxActions.setSettings('todoCounter', nextTodoCount);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      if (!this.todosDocument) {
        return (0, _virtualDom.ul)({ className: 'todo-list' });
      }

      var todos = this.todosDocument.todos.map(function (todo) {
        return (0, _virtualDom.li)({
          className: 'todo',
          children: [(0, _virtualDom.checkbox)({ onClick: _this4.checkboxHandler(todo), checked: _this4.isChecked(todo) }), (0, _virtualDom.textNode)({ text: todo.id + ", " + todo.title + " " }), (0, _virtualDom.div)({ className: 'button', onClick: _this4.deleteHandler(todo) })]
        });
      });

      var titleInput = (0, _virtualDom.input)({
        className: 'input',
        onChange: this.changeListener('title')
      });

      var submitButton = (0, _virtualDom.div)({
        className: 'submit',
        children: [(0, _virtualDom.textNode)({ text: 'Click To Add Todo' })],
        onClick: this.submitForm.bind(this)
      });

      var list = (0, _virtualDom.ul)({
        className: 'todo-list',
        children: [(0, _virtualDom.textNode)({ text: this.appState.users.current.firstName }), (0, _virtualDom.textNode)({ text: this.todosDocument.title })].concat(_toConsumableArray(todos), [titleInput, submitButton])
      });

      return list;
    }
  }]);

  return TodoList;
}();

exports.default = TodoList;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function configureInitialState(currentUser, nuxeoClient, reduxActions) {
  reduxActions.setCurrentUser(currentUser);

  var settings = {
    isDrawerOpen: true,
    isBreadcrumbVisible: true,
    isBreadcrumbNavigate: true
  };

  Object.keys(settings).forEach(function (key) {
    return reduxActions.setSettings(key, settings[key]);
  });
}

exports.default = configureInitialState;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapDispatchToActions;
function mapDispatchToActions(dispatch) {

  function checkValidKeyValue(string, value, actionType) {
    if (typeof string !== 'string' || string.includes(' ') || !string.length) {
      throw new TypeError('first argument ' + actionType + ' for state key ' + string + ' cannot be empty string or have spaces');
    } else if (value === undefined || value === null) {
      throw new TypeError('second argument ' + actionType + ' for state key ' + string + ' cannot be null or undefined');
    }
  }

  function createSetterAction(actionType) {
    return function action(string, payload) {
      checkValidKeyValue(string, payload, actionType);
      dispatch({
        type: actionType,
        resource: string,
        payload: payload
      });
    };
  }

  function setCurrentDocument(doc) {
    if (doc['entity-type'] !== 'document' || !doc['uid']) {
      throw 'argument must be a nuxeo document with uid';
    }
    createSetterAction('set-documents')('current', doc);
  }

  function setCurrentUser(user) {
    if (user['entity-type'] !== 'user' || !user.id) {
      throw 'argument must be a user object with id';
    }
    createSetterAction('set-users')('current', user);
  }

  return {
    setUsers: createSetterAction('set-users'),
    setDocuments: createSetterAction('set-documents'),
    setSettings: createSetterAction('set-settings'),
    setMessages: createSetterAction('set-messages'),
    setStudio: createSetterAction('set-studio'),
    setCurrentDocument: setCurrentDocument,
    setCurrentUser: setCurrentUser
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getType(val) {
  var type = void 0;
  if (typeof val === 'string') {
    type = String;
  } else if (typeof val === 'function') {
    type = Function;
  } else if (typeof val === 'number') {
    type = Number;
  } else if (typeof val === 'boolean') {
    type = Boolean;
  } else if (typeof val === ' symbol') {
    type = Symbol;
  } else if (Array.isArray(val)) {
    type = Array;
  } else if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    type = Object;
  }
  return type;
}

function createSetterReducer(actionType) {
  var typeCheck = {};

  return function setterReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];


    var nextState = void 0;

    if (actionType === action.type) {
      if (Array.isArray(action.payload)) {
        action.payload = Object.assign([], action.payload);
      } else if (action.payload && _typeof(action.payload) === 'object') {
        action.payload = Object.assign({}, action.payload);
      }
      // sets the type on inital setter
      if (!(action.resource in state)) {
        typeCheck[action.resource] = getType(action.payload);
        console.warn(action.type + ' is setting a new key and value for state.' + action.type.split('-').pop() + '.' + action.resource + '\n              ' + typeCheck[action.resource].name + ' is the input type');
      }
      // checks type for each value that is set
      if (typeCheck[action.resource].name !== getType(action.payload).name) {
        throw new TypeError('Initial type for state.' + action.type.split('-').pop() + '.' + action.resource + ' is of type ' + typeCheck[action.resource].name + ', input is of type ' + getType(action.payload).name);
      }

      nextState = Object.assign({}, state, _defineProperty({}, action.resource, action.payload));
    } else {
      nextState = state;
    }

    return Object.freeze(nextState);
  };
}

var mainReducer = {
  users: createSetterReducer('set-users'),
  settings: createSetterReducer('set-settings'),
  documents: createSetterReducer('set-documents'),
  messages: createSetterReducer('set-messages'),
  studio: createSetterReducer('set-studio')
};

exports.default = mainReducer;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function compose() {
  var fns = arguments;
  var start = fns.length - 1;
  return function composedFn() {
    var i = start;
    var result = fns[start].apply(this, arguments);
    while (i--) {
      result = fns[i].call(this, result);
    }
    return result;
  };
}

function applyMiddeware(middlewares) {

  return function (createStore) {
    return function (mainReducer, preloadedState, storeEnhancer) {
      var store = createStore(mainReducer, preloadedState, storeEnhancer);
      var _dispatch = store.dispatch;
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(args) {
          return _dispatch(args);
        }
      };

      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      var newDispatch = compose(chain)(store.dispatch);
      return {
        getState: store.getState,
        subscribe: store.subscribe,
        dispatch: newDispatch
      };
    };
  };
}

function combineReducers(reducers) {
  return function mainReducer(state, action) {
    var stateHasChanged = false;
    var nextState = {};
    Object.keys(reducers).forEach(function (reducerKey) {
      var prevStateSlice = state[reducerKey];
      var nextStateSlice = reducers[reducerKey](prevStateSlice, action);
      if (prevStateSlice != nextStateSlice) {
        stateHasChanged = true;
      }
      nextState[reducerKey] = nextStateSlice;
    });
    return stateHasChanged ? nextState : state;
  };
}

function createStore(mainReducer, preloadedState, storeEnhancer) {

  if (storeEnhancer) {
    return storeEnhancer(createStore)(mainReducer, preloadedState);
  }

  var currentState = preloadedState;
  var listeners = [];

  function dispatch(action) {
    currentState = mainReducer(currentState, action);
    listeners.forEach(function (listener) {
      return listener();
    });
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      var idx = listeners.indexOf(listener);
      listeners.splice(idx, 1);
    };
  }

  function getState() {
    return currentState;
  }

  return {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState
  };
}

var Redux = {
  createStore: createStore,
  combineReducers: combineReducers,
  applyMiddeware: applyMiddeware,
  compose: compose
};

exports.default = Redux;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var createElement = exports.createElement = function createElement(type, props) {
  return {
    type: type,
    props: props
  };
};

var div = exports.div = function div(props) {
  return createElement('div', props);
};
var ul = exports.ul = function ul(props) {
  return createElement('ul', props);
};
var li = exports.li = function li(props) {
  return createElement('li', props);
};
var textNode = exports.textNode = function textNode(props) {
  return createElement('text', props);
};
var input = exports.input = function input(props) {
  return createElement('input', props);
};
var checkbox = exports.checkbox = function checkbox(props) {
  return createElement('checkbox', props);
};

var createTree = exports.createTree = function createTree(virtualTree, container) {

  var node = void 0;

  if (typeof virtualTree.type === 'function') {
    virtualTree = new virtualTree.type(virtualTree.props).render();
    node = document.createElement(virtualTree.type);
  } else if (virtualTree.type === 'text') {
    node = document.createTextNode(virtualTree.props.text);
  } else if (virtualTree.type === 'checkbox') {
    node = document.createElement('input');
    node.type = 'checkbox';
    node.checked = virtualTree.props.checked;
  } else {
    node = document.createElement(virtualTree.type);
  }

  var virtualChildren = virtualTree.props.children;
  var clickListener = virtualTree.props.onClick;
  var changeListener = virtualTree.props.onChange;
  var className = virtualTree.props.className;

  if (clickListener) {
    node.addEventListener('click', clickListener);
  }

  if (changeListener) {
    node.addEventListener('input', changeListener);
  }

  if (className) {
    className.split(" ").forEach(function (cl) {
      return node.classList.add(cl);
    });
  }

  if (virtualChildren) {
    virtualChildren.forEach(function (vChild) {
      return createTree(vChild, node);
    });
  }

  container.appendChild(node);
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reducers = __webpack_require__(4);

var _reducers2 = _interopRequireDefault(_reducers);

var _actions = __webpack_require__(3);

var _actions2 = _interopRequireDefault(_actions);

var _redux = __webpack_require__(5);

var _redux2 = _interopRequireDefault(_redux);

var _configureInitialState = __webpack_require__(2);

var _configureInitialState2 = _interopRequireDefault(_configureInitialState);

var _virtualDom = __webpack_require__(6);

var _todoList = __webpack_require__(1);

var _todoList2 = _interopRequireDefault(_todoList);

var _selectedList = __webpack_require__(0);

var _selectedList2 = _interopRequireDefault(_selectedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // store and state container and api


//function to set intial state

// virtual dom elements and methods


// custom components


// setup our store and actions
var reduxStore = _redux2.default.createStore(_redux2.default.combineReducers(_reducers2.default), {});
var reduxActions = (0, _actions2.default)(reduxStore.dispatch);

// function to map state to dom
var renderCompleteTree = function renderCompleteTree(appState) {

  var todosDocuments = Object.keys(appState.documents).filter(function (todosDocKey) {
    return todosDocKey.includes('todos_document');
  }).map(function (todosDocKey) {
    var props = {
      appState: appState,
      todosDocKey: todosDocKey
    };
    return (0, _virtualDom.createElement)(_todoList2.default, props);
  });

  var entry = (0, _virtualDom.div)({
    className: 'wrapper',
    children: [].concat(_toConsumableArray(todosDocuments), [(0, _virtualDom.createElement)(_selectedList2.default, appState)])
  });

  var root = document.getElementById('root');
  root.innerHTML = "";
  (0, _virtualDom.createTree)(entry, root);
};

document.addEventListener('DOMContentLoaded', function () {
  var todoId = 1;

  while (todoId < 50) {
    var todosList = {
      type: 'TodoList',
      'entity-type': 'document',
      title: ' todo list ' + todoId,
      uid: 1000 + todoId,
      todos: Array(10).fill().map(function (el) {
        todoId++;
        return { type: 'Todo', id: todoId, title: 'hello' };
      })
    };

    reduxActions.setDocuments('todos_document_' + todosList.uid, todosList);
  }

  reduxActions.setSettings('todoCounter', todoId);
  reduxActions.setDocuments('selectedTodos', []);

  var currentUser = {
    'entity-type': 'user',
    'id': 'test',
    'firstName': 'Bob'
  };

  (0, _configureInitialState2.default)(currentUser, {}, reduxActions);

  reduxStore.subscribe(function () {
    return renderCompleteTree(reduxStore.getState());
  });
  renderCompleteTree(reduxStore.getState());

  window.reduxStore = reduxStore;
  window.reduxActions = reduxActions;
});

/***/ })
/******/ ]);