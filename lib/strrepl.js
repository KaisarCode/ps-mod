// Replace all in string
function strrepl(srch, repl, str, flag) {
    srch = srch.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
    flag = flag || 'gim';
    var rx = new RegExp(srch, flag);
    return str.replace(rx, repl);
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = strrepl : true;