// Remove comments
function rmcomm(str) {
    var rx = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
    return str.replace(rx, '');
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = rmcomm : true;