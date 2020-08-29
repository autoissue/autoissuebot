
var words = require('./words');

var types = {
  Extension: {
    convert: function() {
      return this.first.text + this.second.text.toUpperCase();
    }
  }
};

words.parse('foobar', {types: types}).convert()
// -> 'fooBAR'
