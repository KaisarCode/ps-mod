// RegExp chars escape
function regesc(str) {
    return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = regesc : true;