react-flux
==========

A library combining tools to develop with a FLUX architecture

# Scope
* Uses the [react-flux-dispatcher](https://github.com/christianalfoni/react-flux-dispatcher) and the [react-flux-store](https://github.com/christianalfoni/react-flux-store)
* Includes React JS v 0.11.1
* A simple API for using React JS in a FLUX architecture
* Supports common module loaders

# What is it all about?
Read my post on [React JS and FLUX](http://www.christianalfoni.com/) to know more about this.

# API
**FLUX.debug()**: Puts React on the window object to trigger Chrome React dev-tools

**FLUX.React**: The React JS lib

**FLUX.renderComponent(ComponentClass, node)**: Short for FLUX.React.renderComponent()

**FLUX.unmountComponentAtNode(node)**: Short for FLUX.React.unmountComponentAtNode()

**FLUX.createComponent(props)**: Creates an extended React JS Component Class (read more below)

**FLUX.createStore(name, props)**: Creates a FLUX store

**FLUX.dispatch**: Dispatch a new intent (action) through your app (read more below)

**FLUX.copy(obj1-obj5)**: Creates a new object and merges up to five passed objects into that new object

**FLUX.mergeInto(target, source)**: Merges source object into target object

# How to install
Download from **dist/**: [FLUX.min.js](https://rawgithub.com/christianalfoni/react-flux/master/dist/FLUX.min.js) or use
`npm install react-flux`.

# Example
*main.js*
```javascript
var FLUX = require('react-flux');
var userStore = require('./stores/user.js');
var App = require('./App.js');

FLUX.debug(); // Show the Chrome React dev-tools
FLUX.createStore('UserStore', userStore);
FLUX.renderComponent(<App/>, document.body);
```
*stores/UserStore.js*
```javascript
var FLUX = require('react-flux');
var user = { name: 'Bob', active: true };
module.exports = {

	// A getter which returns a copy of the user object to prevent
	// mutation
	getUser: function () {
		return FLUX.copy(user);
	},

	// Dispatch is called on every dispatch call to FLUX.
	// The typical thing to do is switch between the payload
	// types
	dispatch: function (payload) {
		switch (payload.type) {
			case 'USER_CHANGE':
				FLUX.mergeInto(user, payload.user);
				this.flush(); // Tell the components dependant of this store to update
				break;
		}
	}
};
```

*App.js*
```javascript
var FLUX = require('react-flux');
var App = FLUX.createComponent({
	stores: ['UserStore'], // An array of stores to be dependant of

	// Now getInitialState gets the stores as arguments
	getInitialState: fuction (UserStore) { 
		return {
			user: UserStore.getUser()
		}
	},

	// New method that will be called when a dependant
	// store has flushed. The stores are received as arguments
	storesDidUpdate: function (UserStore) {
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
		FLUX.dispatch({
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
