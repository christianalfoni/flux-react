var expect = require('chai').expect;
var ReactDispatcher = require('react-flux-dispatcher');
var ReactStore = require('react-flux-store');

describe('ExendedComponent', function() {
  it('should add create an empty object if no "storesDidUpdate" method is passed', function() {
    var ExtendedComponent = require('../app/ExtendedComponent.js');
    var Dispatcher = new ReactDispatcher();
    var stores = [{name: 'storeA'}, {name: 'storeB'}];
    var extendedComponent = new ExtendedComponent(Dispatcher, stores, {});
    expect(extendedComponent).to.eql({});
  });
  it('should call storesDidUpdate if any of the stores passed triggers an update event', function() {
    var ExtendedComponent = require('../app/ExtendedComponent.js');
    var Dispatcher = new ReactDispatcher();
    var stores = {
      'storeA': ReactStore.create('storeA', Dispatcher, {dispatch: function () { this.flush(); }}), 
      'storeB': ReactStore.create('storeB', Dispatcher, {dispatch: function () { this.flush(); }})
    };
    var storesDidUpdateCalled = false;
    var extendedComponent = new ExtendedComponent(Dispatcher, stores, {
      stores: ['storeA', 'storeB'],
      storesDidUpdate: function () {
        storesDidUpdateCalled = true;
      }
    });
    extendedComponent.componentDidMount();
    Dispatcher.dispatch();
    expect(storesDidUpdateCalled).to.equal(true);
  });
  it('should run original componentDidMount() and componentWillUnmount() though overriden', function() {
    var ExtendedComponent = require('../app/ExtendedComponent.js');
    var Dispatcher = new ReactDispatcher();
    var stores = {
      'storeA': ReactStore.create('storeA', Dispatcher, {dispatch: function () { this.flush(); }}), 
      'storeB': ReactStore.create('storeB', Dispatcher, {dispatch: function () { this.flush(); }})
    };
    var storesDidUpdateCalled = false;
    var componentDidMountCalled = false;
    var componentDidUnmountCalled = false;
    var extendedComponent = new ExtendedComponent(Dispatcher, stores, {
      stores: ['storeA', 'storeB'],
      componentDidMount: function () {
        componentDidMountCalled = true;
      },
      componentWillUnmount: function () {
        componentDidUnmountCalled = true;
      },
      storesDidUpdate: function () {
        storesDidUpdateCalled = true;
      }
    });
    extendedComponent.componentDidMount();
    expect(componentDidMountCalled).to.equal(true);
    Dispatcher.dispatch();
    expect(storesDidUpdateCalled).to.equal(true);
    extendedComponent.componentWillUnmount();
    expect(componentDidUnmountCalled).to.equal(true);
    // Set updateCalled back to false to test that it does not trigger again
    storesDidUpdateCalled = false;
    Dispatcher.dispatch();
    expect(storesDidUpdateCalled).to.equal(false);
  });
  it('should pass registered stores to storesDidUpdate()', function() {
    var ExtendedComponent = require('../app/ExtendedComponent.js');
    var Dispatcher = new ReactDispatcher();
    var stores = {
      'storeA': ReactStore.create('storeA', Dispatcher, {dispatch: function () { this.flush(); }}), 
      'storeB': ReactStore.create('storeB', Dispatcher, {dispatch: function () { this.flush(); }})
    };
    var storesDidUpdateCalled = false;
    var componentDidMountCalled = false;
    var componentDidUnmountCalled = false;
    var extendedComponent = new ExtendedComponent(Dispatcher, stores, {
      stores: ['storeA', 'storeB'],
      storesDidUpdate: function (storeA, storeB) {
        expect(storeA).to.equal(stores.storeA);
        expect(storeB).to.equal(stores.storeB);
      }
    });
    extendedComponent.componentDidMount();
    Dispatcher.dispatch();
  });
  it('should only call storesDidUpdate() once, regardless of number of stores', function() {
    var ExtendedComponent = require('../app/ExtendedComponent.js');
    var Dispatcher = new ReactDispatcher();
    var stores = {
      'storeA': ReactStore.create('storeA', Dispatcher, {dispatch: function () { this.flush(); }}), 
      'storeB': ReactStore.create('storeB', Dispatcher, {dispatch: function () { this.flush(); }})
    };
    var storesDidUpdateCalled = false;
    var componentDidMountCalled = false;
    var componentDidUnmountCalled = false;
    var calledCount = 0;
    var extendedComponent = new ExtendedComponent(Dispatcher, stores, {
      stores: ['storeA', 'storeB'],
      storesDidUpdate: function (storeA, storeB) {
        calledCount++;
      }
    });
    extendedComponent.componentDidMount();
    Dispatcher.dispatch();
    expect(calledCount).to.equal(1);
  });
});
