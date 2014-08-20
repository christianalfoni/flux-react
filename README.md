react-flux
==========

A library extending React to develop with a FLUX architecture. Read more about FLUX over at [Facebook Flux](http://facebook.github.io/flux/).

## Scope
* Uses the [react-flux-dispatcher](https://github.com/christianalfoni/react-flux-dispatcher) and the [react-flux-store](https://github.com/christianalfoni/react-flux-store)
* A simple API for using React JS in a FLUX architecture
* Supports common module loaders

## What is it all about?
Read my post on [React JS and FLUX](http://christianalfoni.github.io/javascript/2014/08/20/react-js-and-flux.html) to know more about this.

## API
**React.debug()**: Puts React on the window object to trigger Chrome React dev-tools

**React.createStore(name, props)**: Creates a FLUX store

**React.dispatch**: Dispatch a new intent (action) through your app (read more below)

## How to install
Download from **dist/**: [FLUX.min.js](https://rawgithub.com/christianalfoni/react-flux/master/dist/FLUX.min.js) or use
`npm install flux-react`.

## Example
*main.js*
```javascript
var React = require('react-flux');
var App = require('./App.js');

React.debug(); // Show the Chrome React dev-tools
React.renderComponent(<App/>, document.body);
```
*stores/UserStore.js*
```javascript
var React = require('react-flux');
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
var React = require('react-flux');
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
