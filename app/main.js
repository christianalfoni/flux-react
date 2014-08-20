var React = require('react');
var ReactDispatcher = require('react-flux-dispatcher');
var ReactStore = require('react-flux-store');
var merge = require('react/lib/merge');
var mergeInto = require('react/lib/mergeInto');

var ExtendedComponent = require('./ExtendedComponent.js');
var stores = {};
var dispatcher = new ReactDispatcher(stores);

var FLUX = {
	React: React,
	debug: function () {
		window.React = React;
	},
	renderComponent: React.renderComponent.bind(React),
	unmountComponentAt: React.unmountComponentAtNode.bind(React),
	createComponent: function (props) {
		var componentClass = this.copy(props, new ExtendedComponent(dispatcher, stores, props));
		return React.createClass(componentClass);
	},
	createStore: function (name, props) {
		if (typeof name !== 'string') {
			throw new Error('First argument to createStore() has to be a string');
		}
		props = props || {};
		stores[name] = ReactStore.create(name, dispatcher, props);
		return stores[name];
	},
	dispatch: dispatcher.dispatch.bind(dispatcher),
	copy: merge,
	mergeInto: mergeInto
};

module.exports = FLUX;