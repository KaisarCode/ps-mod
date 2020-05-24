var fs = require('fs');

// Writes string to some path
function fwrite(file, str = '', mod = 0o755) {
    str = str+'';
    return fs.writeFileSync(file, str, { mode: mod });
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = fwrite : true;