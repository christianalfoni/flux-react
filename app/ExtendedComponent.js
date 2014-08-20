
function ExtendedComponent (dispatcher, stores, props) {
	var componentStores = [];
	if (props.stores) {
		props.stores.forEach(function (storeName) {
			componentStores.push(typeof storeName === 'string' ? stores[storeName]: storeName);
		});

		if (props.getInitialState) {
			this.getInitialState = function () {
				return props.getInitialState.apply(this, componentStores);
			};
		}

		if (props.storesDidUpdate) {
			/* Only update the stores on first event from the stores, then block until
			next tick. This is due to storesDidUpdate() should only be called once and
			the stores has synchronous behaviour in terms of triggering the event */
			var doUpdate = true;
			this.storesDidUpdate = function () {
				if (doUpdate) {
					props.storesDidUpdate.apply(this, componentStores);
					doUpdate = false;
					process.nextTick(function () {
						doUpdate = true;
					});	
				}
			};
			this.componentDidMount = function () {
				componentStores.forEach(function (store) {
					store.on('update', this.storesDidUpdate);
				}, this);
				if (props.componentDidMount) props.componentDidMount.call(this);
			};
			this.componentWillUnmount = function () {
				componentStores.forEach(function (store) {
					store.removeListener('update', this.storesDidUpdate);
				}, this);		
				if (props.componentWillUnmount) props.componentWillUnmount.call(this);
			};

		}
	}
}

module.exports = ExtendedComponent;