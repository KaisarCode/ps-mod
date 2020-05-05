/* Is datatype */
var is = {};

// Is defined
is.def = function(v){
    return typeof v !== 'undefined';
};

// Is object
is.obj = function(v){
    return typeof v == 'object';
};

// Is array
is.arr = function(v){
    return Array.isArray(v);
};

// Is string
is.str = function(v){
    return typeof v == 'string';
};

// Is number
is.num = function(v) {
    return !isNaN(v);
};

// Is function
is.fun = function(v) {
    return typeof v == 'function';
};

// Is RegEx
is.rgx = function(v) {
    return v instanceof RegExp;
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = is : true;