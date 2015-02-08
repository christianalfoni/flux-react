var isObject = function (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

var isSame = function (a, b) {
  var keys = Object.keys(a);
  for (var x = 0; x < keys.length; x++) {
    if (!b[keys[x]] || a[keys[x]] !== b[keys[x]]) {
      return false;
    }
  }
  return true;
};

module.exports = {
  update: function () {
    this.setState({});
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    
    var currentPropsLength = this.props ? Object.keys(this.props).length : 0; 
    var nextPropsLength = nextProps ? Object.keys(nextProps).length : 0;
    var currentStateLength = this.state ? Object.keys(this.state).length : 0;
    var nextStateLength = nextState ? Object.keys(nextState).length : 0;

    if (!currentPropsLength && !nextPropsLength && !currentStateLength && !nextStateLength) {
      return false;
    } else if (currentPropsLength !== nextPropsLength || currentStateLength !== nextStateLength) {
      return true;
    } else {
      return !isSame(nextProps, this.props) || !isSame(nextState, this.state);
    }

  }
};
