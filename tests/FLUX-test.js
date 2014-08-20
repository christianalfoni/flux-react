/** @jsx React.DOM */
var expect = require('chai').expect;

describe('FLUX', function() {
  it('should create a component with merged properties', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;

    var FLUX = require('../app/main.js');
    var Component = FLUX.createComponent({
      foo: 'bar',
      render: function () {
        return (
          <div/>
        )
      }
    });
    var component = TestUtils.renderIntoDocument(
      <Component/>
    );
    expect(component.foo).to.equal('bar');
  });
  it('should create a store with props passed', function() {
    var FLUX = require('../app/main.js');
    var store = FLUX.createStore('StoreA', {
      foo: 'bar'
    });
    expect(store.foo).to.equal('bar');
  });
  it('should trigger storesDidUpdate() on components when stores flush', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;

    var FLUX = require('../app/main.js');
    var storeA = FLUX.createStore('storeA', {dispatch: function () { this.flush(); }});
    var storesDidUpdateCalled = false;
    var Component = FLUX.createComponent({
      stores: ['storeA'],
      storesDidUpdate: function () {
        storesDidUpdateCalled = true;
      },
      render: function () {
        return (
          <div/>
        )
      }
    });
    var component = TestUtils.renderIntoDocument(
      <Component/>
    );
    storeA.dispatch();
    expect(storesDidUpdateCalled).to.equal(true); 
  });
});
