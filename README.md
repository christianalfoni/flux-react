[![Build Status](https://travis-ci.org/christianalfoni/flux-react.svg?branch=master)](https://travis-ci.org/christianalfoni/flux-react)

flux-react
==========

A React JS flux expansion based on experiences building [www.jsfridge.com](http://www.jsfridge.com) and [www.jflux.io](http://www.jflux.io). Read more about FLUX over at [Facebook Flux](http://facebook.github.io/flux/). I wrote an article about it here: []()

- [What is it all about?](#whatisitallabout)
- [How to install](#howtoinstall)
- [API](#api)
	- [flux.debug()](#debug)
	- [flux.createActions()](#actions)
	- [flux.createStore()](#store)
		- [getInitialState()](#getinitialstate)
		- [actions](#storeactions)
		- [handlers](#handlers)
		- [events](#events)
		- [exports](#exports)
		- [mixins](#mixins)
		- [changeListener](#changelistener)
		- [listener](#listener)

## <a name="whatisitallabout">What is it all about?</a>
It can be difficult to get going with React JS and FLUX as there is no complete framework with all the tools you need. This project will help you get going with the FLUX parts and it has a boilerplate with the other tools you need, like a router, ajax handling etc. [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate).

## <a name="howtoinstall">How to install</a>
Download from **release/** folder of the repo or use `npm install flux-react`, but I recommend using the boilerplate located here: [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate). It has everything set up for you.

## <a name="api">API</a>

### <a name="debug">flux.debug</a>
```javascript
var flux = require('flux-react');
flux.debug();
```
Puts React on the global scope, which triggers the React dev tools in Chrome

### <a name="actions">flux.createActions()</a>
```javascript
var flux = require('flux-react');
flux.createActions([
	'addTodo',
	'removeTodo'
]);
flux.action.addTodo(); // Trigger action
flux.action.removeTodo(0); // Pass any number of arguments
```
Makes actions available on the flux object. Use them inside components or other parts of your architecture. The only
way to reach a store is through an action.

### <a name="store">flux.createStore()</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({});
```
Creates a store.

#### <a name="getinitialstate">getInitialState()</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	getInitialState: function () {
		return {
			todos: []
		};
	}
});
```
A method that returns the initial state of the store.

#### <a name="storeactions">actions</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	getInitialState: function () {
		return {
			todos: []
		};
	},
	actions: [
		'addTodo'
	]
});
```
List what actions the store should handle. They will map to handler with the same name.

#### <a name="handlers">handler</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	getInitialState: function () {
		return {
			todos: []
		};
	},
	actions: [
		'addTodo'
	],
	addTodo: function (title) {
		this.state.todos.push({title: title, completed: false});
	}
});
```
Based on the name of the action, add a handler that will run when the action is triggered. Any arguments passed to the action will be available in the handler.

#### <a name="events">events</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	getInitialState: function () {
		return {
			todos: []
		};
	},
	actions: [
		'addTodo',
		'removeTodo'
	],
	addTodo: function (title) {
		this.state.todos.push({title: title, completed: false});
		this.emitChange();
		this.emit('added');
	}
});
```
Run **emitChange** to notify about a general change in the store. Run **emit** with a named event to notify components to trigger something. In this example, maybe you wanted to play an animation in a component whenever a todo was added.

#### <a name="exports">exports</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	getInitialState: function () {
		return {
			todos: []
		};
	},
	actions: [
		'addTodo'
	],
	addTodo: function (title) {
		this.state.todos.push({title: title, completed: false});
		this.emitChange();
		this.emit('added');
	},
	exports: {
		getTodos: function () {
			return this.todos
		}
	}
});
```
Methods defined in exports will be returned by **createStore**. Components or other parts of the architecture can use it to get state from the store. The methods are bound to the state object of the store, meaning "this.todos" points to the state "todos". 

**Note!** Values returned by an export method will be deep cloned. Meaning that the state of a store is immutable. You can not do changes to a returned value and expect that to be valid inside your store also. You have to trigger an action to change the state of a store.

#### <a name="mixins">mixins</a>
```javascript
var flux = require('flux-react');

var MyMixin = {
	getInitialState: function () {
		return {};
	},
	actions: [
		'removeTodo'
	],
	removeTodo: function (index) {
		this.state.todos.splice(index, 1);
		this.emitChange();
	},
	exports: {}
};

var MyStore = flux.createStore({
	mixins: [MyMixin],
	getInitialState: function () {
		return {
			todos: []
		};
	},
	actions: [
		'addTodo'
	],
	addTodo: function (title) {
		this.state.todos.push({title: title, completed: false});
		this.emitChange();
	},
	exports: {
		getTodos: function () {
			return this.todos
		}
	}
});
```
Mixins helps you handle big stores. You do not want to divide your stores within one section of your application as they very quickly become dependant on each other. That can result in circular dependency problems. Use mixins instead and create big stores. **getInitialState**, **actions**, **handlers** and **exports** will be merged with the main store.

**ProTip!** In big stores it is a good idea to create a StatesMixin that holds all possible state properties in your store. That makes it very easy to look up what states are available to you.

```javascript
var flux = require('flux-react');

var StateMixin = {
	getInitialState: function () {
		return {
			someState: true,
			stateA: 'foo',
			stateB: 'bar',
			stateC: []
		};
	}
};

var MyStore = flux.createStore({
	mixins: [StateMixin, OtherMixin, MoreMixin],
	exports: {
		getSomeState: function () {
			return this.someState;
		}
	}
});
```
#### <a name="changelistener">changeListener</a>
```javascript
var React = require('react');
var MyStore = require('./MyStore.js');
var MyComponent = React.createClass({
	getInitialState: function () {
		return {
			todos: MyStore.getTodos()
		};
	},
	componentWillMount: function () {
		MyStore.addChangeListener(this.update);
	},
	componentWillUnmount: function () {
		MyStore.removeChangeListener(this.update);
	},
	update: function () {
		this.setState({
			todos: MyStore.getTodos()
		});
	},
	render: function () {
		return (
			<div>Number of todos: {MyStore.getTodos().length}</div>
		);
	}
});
```
Add and remove change listener to react to general change events in stores.

#### <a name="changelistener">listener</a>
```javascript
var React = require('react');
var MyStore = require('./MyStore.js');
var MyComponent = React.createClass({
	getInitialState: function () {
		return {
			playAnimation: false
		};
	},
	componentWillMount: function () {
		MyStore.addListener('added', this.playAnimation);
	},
	componentWillUnmount: function () {
		MyStore.removeListener('added', this.playAnimation);
	},
	playAnimation: function () {
		this.setState({
			playAnimation: true
		});
		setTimeout(function () {
			this.setState({
				playAnimation: false
			});
		}.bind(this), 2000);
	},
	render: function () {
		return (
			<div className={this.state.playAnimation ? 'animation' : ''}></div>
		);
	}
});
```
Add and remove listener to react to specific events in stores.