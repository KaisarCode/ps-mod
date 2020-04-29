var fs = require('fs');

// Get list of all files in the desired paths
function fwalk(path, recursive = true, files = []) {
    var fls = fs.readdirSync(path);
    if (fls.length) {
        fls.forEach(function(fl) {
            var fl = path+'/'+fl;
            if (!isdir(fl)) {
                files.push(fl);
            }
        });
        if (recursive) {
            fls.forEach(function(dir) {
                var dir = path+'/'+dir;
                if (isdir(dir)) {
                    files = fwalk(dir, recursive, files);
                }
            });
        }
    }
    return files;
};

// Is directory
function isdir(pth) {
    return fs.lstatSync(pth).isDirectory();
};

// Export module
(typeof process !== 'undefined') &&
(typeof process.versions !== 'undefined') &&
(typeof process.versions.node !== 'undefined') ?
module.exports = fwalk : true;