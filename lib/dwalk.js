var fs = require('fs');

// Get list of all dirs in the desired paths
function dwalk(path, recursive = true, dirs = []) {
    var drs = fs.readdirSync(path);
    if (drs.length) {
        drs.forEach(function(dr) {
            var dr = path+'/'+dr;
            if (isdir(dr)) {
                dirs.push(dr);
            }
        });
        if (recursive) {
            drs.forEach(function(dir) {
                var dir = path+'/'+dir;
                if (isdir(dir)) {
                    dirs = dwalk(dir, recursive, dirs);
                }
            });
        }
    }
    return dirs;
};

// Is directory
function isdir(pth) {
    return fs.lstatSync(pth).isDirectory();
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = dwalk : true;