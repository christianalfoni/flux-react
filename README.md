[![Build Status](https://travis-ci.org/christianalfoni/flux-react.svg?branch=master)](https://travis-ci.org/christianalfoni/flux-react)

react-flux
==========

A React JS expansion with dispatcher, stores and a router. Read more about FLUX over at [Facebook Flux](http://facebook.github.io/flux/).

## Scope
* Uses the [flux-react-dispatcher](https://github.com/christianalfoni/flux-react-dispatcher), the [flux-react-router](https://github.com/christianalfoni/flux-react-router) and the [flux-react-store](https://github.com/christianalfoni/flux-react-store)
* A simple API for using React JS in a FLUX architecture
* Supports common module loaders

## What is it all about?
Read my post on [React JS and FLUX](http://christianalfoni.github.io/javascript/2014/08/20/react-js-and-flux.html) to know more about this. I wanted to create a very simple API that integrates with the React JS lib. The reason for not wrapping it is how React JS behaves in browserify with JSX transforms etc. It made more sense to add a few more methods to the library itself.

## API
**React.debug()**: Puts React on the window object to trigger Chrome React dev-tools

**React.createStore(props)**: Creates a FLUX store

**React.dispatch**: Dispatch a new intent (action) through your app (read more below)

**React.createRoute(path, callback)**: Create a route

**React.goToRoute(path)**: Go instantly to a path

**React.deferToRoute(path)**: Returns a function when triggered goes to path defined

**React.run(optional:callback)**: Will run callback, if defined, when document is loaded and trigger the router. Return value of callback can be a promise

## How to install
Download from **dist/**: [FLUX.min.js](https://rawgithub.com/christianalfoni/flux-react/master/dist/FLUX.min.js) or use
`npm install flux-react`, but I recommend using the boilerplate located here: [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate). It has everything set up for you.

## Example
*main.js*
```javascript
var React = require('flux-react');
React.debug(); // Show the Chrome React dev-tools

var App = require('./App.js');

React.createRoute('/', function () {
	React.unmountComponentAtNode(document.body);
	React.renderComponent(<App/>, document.body);	
});

React.createRoute('*', '/');

React.run(); // Triggers the router
```

*stores/UserStore.js*
```javascript
var React = require('flux-react');
var user = { name: 'Bob', active: true };
module.exports = React.createStore({

	// A getter which returns a new object with user 
	// properties to avoid mutation
	getUser: function () {
		return {
			name: user.name,
			active: user.active
		};
	},

	// Dispatch is called on every dispatch call to FLUX.
	// The typical thing to do is switch between the payload
	// types
	dispatch: function (payload) {
		switch (payload.type) {
			case 'USER_CHANGE':
				user.name = payload.user.name;
				user.active = payload.user.active;
				this.flush(); // Tell the components dependant of this store to update
				break;
		}
	}
});
```

*App.js*
```javascript
var React = require('flux-react');
var UserStore = require('./stores/UserStore.js');

var App = React.createClass({

	stores: [UserStore], // An array of stores to be dependant of
	getInitialState: fuction () { 
		return {
			user: UserStore.getUser()
		}
	},

	// New method that will be called when a dependant
	// store has flushed
	storesDidUpdate: function () {
		this.setState({
			user: UserStore.getUser()
		});
	},
	changeName: function () {
		this.state.user.name = this.refs.name.getDOMNode().value;
	},
	changeActive: function () {
		this.state.user.active = this.refs.active.getDOMNode().checked;
	},
	dispatchChange: function () {
		React.dispatch({
			type: 'USER_CHANGE',
			user: this.state.user
		});
	},
	render: function () {
		return (
			<div>
				<input ref="name" type="text" value={this.state.user.name} onChange={this.changeName}/>
				<input ref="active" type="checkbox" checked={this.state.user.active} onChange={this.changeActive}/>
				<button onClick={this.dispatchChange}>Save</button>
			</div>
		)
	}
});
module.exports = App;
```
