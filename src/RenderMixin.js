var isObject = function (obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

var deepCompare = function (a, b) {

 var compare = function (valueA, valueB) {

    if (Array.isArray(valueA) || isObject(valueA)) {
      var isTheSame = deepCompare(valueA, valueB);
      if (!isTheSame) {
        return false;
      }
    } else if (valueA !== valueB) {
      return false;
    }
    return true;
  };

  if (Array.isArray(a) && Array.isArray(b) && a !== b && a.length === b.length) {

    for (var x = 0; x < a.length; x++) {
      var isSame = compare(a[x], b[x]);
      if (!isSame) {
        return false;
      }
    }
    return true;

  } else if (isObject(a) && isObject(b) && a !== b) {

    // If number of properties has changed, it has changed, making them not alike
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }


    for (var prop in a) {
      if (a.hasOwnProperty(prop)) {
        var isSame = compare(a[prop], b[prop]);
        if (!isSame) {
          return false;
        }
      }
    }

    return true;

  } else {

    return false;

  }

};

module.exports = {
  update: function () {
    this.setState({});
  },
  shouldComponentUpdate: function (nextProps) {
    
    var currentPropsLength = Object.keys(this.props).length;
    var nextPropsLength = Object.keys(nextProps).length;

    if (!currentPropsLength && !nextPropsLength) {
      return false;
    } else if (currentPropsLength !== nextPropsLength) {
      return true;
    } else {
      return !deepCompare(nextProps, this.props);
    }

  }
};
