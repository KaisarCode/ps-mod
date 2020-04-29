// Simple minify (Remove new lines and multiple spaces)
function strmin(str) {
    str = str.replace(/\s+/g, ' ');
    str = str.trim();
    return str;
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = strmin : true;