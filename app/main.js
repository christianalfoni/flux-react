var React = require('react');
var ReactDispatcher = require('flux-react-dispatcher');
var ReactStore = require('flux-react-store');
var ReactRouter = require('flux-react-router');
var merge = require('react/lib/merge');

var ExtendedComponent = require('./ExtendedComponent.js');
var dispatcher = new ReactDispatcher();

React.debug = function () {
	window.React = React;
};

var createClass = React.createClass;
React.createClass = function (props) {
		var componentClass = merge(props, new ExtendedComponent(dispatcher, props));
		return createClass.call(React, componentClass);
};

React.createRouter = function (routes) {
	return ReactRouter(routes);
};

React.createStore = function (props) {
	props = props || {};
	return ReactStore.create(dispatcher, props);
};

React.dispatch = dispatcher.dispatch.bind(dispatcher),

module.exports = React;