var fs = require('fs');

// Read file wrapper
function fread(fl, cb) {
    cb = cb || null;
    if (!cb) {
        return fs.readFileSync(fl)+'';
    } else { fs.readFile(fl, cb); }
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = fread : true;