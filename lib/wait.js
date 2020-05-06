// Wait miliseconsd and exec
// @t: time in miliseconds
// @cb: callback
/*
Returns an object with
	- "stop" method: to clean up the last timeout process.
	- "wait" method: to chain another timeout process.
*/
function wait(t, cb) {
	this.t = 0;
	var ths = this;
	function proc(t, cb) {
		var obj = {};
		obj.wait = proc;
		ths.t = ths.t + t;
		var i = setTimeout(cb, ths.t);
		obj.stop = function(){
			clearInterval(i);
			return obj;
		}; return obj;
	}; return proc(t, cb);
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = wait : true;