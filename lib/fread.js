var fs = require('fs');

// Read file
function fread(fl) { return fs.readFileSync(fl)+''; };

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = fread : true;