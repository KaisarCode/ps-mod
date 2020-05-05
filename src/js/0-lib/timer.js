// Wait miliseconsd and exec iteratively
// @t: time in miliseconds
// @cb: callback
/*
Returns an object with a "stop" method
to clean up the interval. 
*/
function timer(t, cb) {
    var tm = setInterval(cb, t);
    var o = {};
    o.id = tm;
    o.stop = function() {
        clearInterval(tm);
    }; return o;
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = timer : true;