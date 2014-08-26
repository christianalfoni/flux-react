var React = require('react');
var ReactDispatcher = require('flux-react-dispatcher');
var ReactStore = require('flux-react-store');
var ReactRouter = require('flux-react-router');
var merge = require('react/lib/merge');
var Promise = require('es6-promise').Promise;

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

React.createStore = function (props) {
	props = props || {};
	return ReactStore.create(dispatcher, props);
};

React.dispatch = dispatcher.dispatch.bind(dispatcher);

React.createRoute = ReactRouter.createRoute;
React.goToRoute = ReactRouter.goTo;
React.deferToRoute = ReactRouter.deferTo;

React.run = function (callback) {
	callback = callback || function () {};
	var onReady = function () {
		if (document.readyState === 'complete') {
			Promise.resolve(callback())
			.then(ReactRouter.init)
			.catch(function (err) { 
				process.nextTick(function () { throw err; }) 
			});
		}
	};

	if (document.readyState !== 'complete') {
		document.onreadystatechange = onReady;
	} else {
		onReady();
	}
};

module.exports = React;