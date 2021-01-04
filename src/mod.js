const fs = require('fs');
const exec =
require('child_process').execSync;
const fwalk = require('kc-fwalk');
const fread = require('kc-fread');
const fwrite = require('kc-fwrite');
const deldir = require('kc-ddel');
const def = function(v) {
return typeof v !== 'undefined'; }
const mkdir = require('kc-mkdir');
const filex = fs.existsSync;
const copy = fs.copyFileSync;

module.exports = function(opt) {
    
    var dt = new Date();
    var yr = dt.getFullYear();
    
    // Options
    if (!def(opt)) opt = {};
    if (!def(opt.name)) opt.name = 'psmod';
    if (!def(opt.className)) opt.className = 'PSMod';
    if (!def(opt.displayName)) opt.displayName = opt.className;
    if (!def(opt.description)) opt.description = 'PS Module';
    if (!def(opt.tab)) opt.tab = 'others';
    if (!def(opt.version)) opt.version = '1.0.0';
    if (!def(opt.author)) opt.author = 'Author';
    if (!def(opt.email)) opt.email = 'author@email.com';
    if (!def(opt.copyright)) opt.copyright = yr+' '+opt.author;
    
    if (!def(opt.ext_css)) opt.ext_css = '';
    if (!def(opt.ext_js)) opt.ext_js = '';
    
    // Replace template tags
    function replTags(str = '') {
        str = str.replace(/{{NAME}}/gi, opt.name);
        str = str.replace(/{{CLASSNAME}}/gi, opt.className);
        str = str.replace(/{{CLASSUPPR}}/gi, opt.className.toUpperCase());
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
    if (!filex('app/mod')) mkdir('app/mod');

    // Create module dir
    var dir = 'app/mod/'+opt.name;
    if (!filex(dir)) mkdir(dir);
    
    // Install index.php
    var idx = fread(__dirname+'/mod/index.php');
    idx = replTags(idx);
    fwrite(dir+'/index.php', idx);
    
    // Install module.php
    var mod = fread(__dirname+'/mod/module.php');
    mod = replTags(mod);
    fwrite(dir+'/'+opt.name+'.php', mod);
    
    // Install logo
    if (!filex(dir+'/logo.png')) {
        copy(__dirname+'/mod/logo.png', dir+'/logo.png');
    }
    
    // Zip module
    exec(`cd app/mod && zip -r ${opt.name}.zip ${opt.name}`);
    
    // Notify
    console.log('MOD compiled.');
}
