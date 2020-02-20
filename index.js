const exec = require('child_process').execSync;
const fs = require('fs-extra');
const isset = function(v) {
    return typeof v !== 'undefined';
}
const mkdir = fs.mkdirpSync;
const filex = fs.existsSync;
const read = function(f) {
    return fs.readFileSync(f, 'utf-8');
}
const write = function(f, s = '') {
    fs.writeFileSync(f, s, { mode: 0o755 });
    return s;
}

module.exports = function(opt) {
    
    var dt = new Date();
    var yr = dt.getFullYear();
    
    // Options
    if (!isset(opt)) opt = {};
    
    if (!isset(opt.watch)) opt.watch = true;
    
    if (!isset(opt.name)) opt.name = 'psmod';
    if (!isset(opt.className)) opt.className = 'PSMod';
    if (!isset(opt.displayName)) opt.displayName = opt.className;
    if (!isset(opt.description)) opt.description = 'PS Module';
    if (!isset(opt.tab)) opt.tab = 'others';
    if (!isset(opt.version)) opt.version = '1.0.0';
    if (!isset(opt.author)) opt.author = 'Author';
    if (!isset(opt.email)) opt.email = 'author@email.com';
    if (!isset(opt.copyright)) opt.copyright = yr+' '+opt.author;
    
    if (!isset(opt.dir)) opt.dir = 'dist/mod';
    if (!isset(opt.ext_css)) opt.ext_css = '';
    if (!isset(opt.ext_js)) opt.ext_js = '';
    
    // Replace template tags
    function replTags(str = '') {
        str = str.replace(/{{NAME}}/gi, opt.name);
        str = str.replace(/{{CLASSNAME}}/gi, opt.className);
        str = str.replace(/{{DISPLAYNAME}}/gi, opt.displayName);
        str = str.replace(/{{DESCRIPTION}}/gi, opt.description);
        str = str.replace(/{{TAB}}/gi, opt.tab);
        str = str.replace(/{{VERSION}}/gi, opt.version);
        str = str.replace(/{{AUTHOR}}/gi, opt.author);
        str = str.replace(/{{EMAIL}}/gi, opt.email);
        str = str.replace(/{{COPYRIGHT}}/gi, opt.copyright);
        str = str.replace(/{{EXTCSS}}/gi, opt.ext_css);
        str = str.replace(/{{EXTJS}}/gi, opt.ext_js);
        str = str.replace(/{{EXTWS}}/gi, opt.ext_ws);
        return str;
    }
    
    // Create root dir
    if (!filex(opt.dir)) mkdir(opt.dir);

    // Create module dir
    var dir = opt.dir+'/'+opt.name;
    if (!filex(dir)) mkdir(dir);
    
    // Install index.php
    var idx = read(__dirname+'/src/mod/index.php');
    idx = replTags(idx);
    write(dir+'/index.php', idx);
    
    // Install module.php
    var mod = read(__dirname+'/src/mod/module.php');
    mod = replTags(mod);
    write(dir+'/'+opt.name+'.php', mod);
    
    // Install logo
    if (!filex(dir+'/logo.png')) {
        fs.copySync(__dirname+'/src/mod/logo.png', dir+'/logo.png');
    }
    
    // Zip module
    exec(`cd ${opt.dir} && zip -r ${opt.name}.zip ${opt.name}`);
    
}
