// Load dependencies
var fs = require('fs');
var dwalk   = require('./lib/dwalk');
var fwalk   = require('./lib/fwalk');
var fread   = require('./lib/fread');
var fwrite  = require('./lib/fwrite');
var t2js    = require('./lib/t2js');
var rmcomm  = require('./lib/rmcomm');
var strmin  = require('./lib/strmin');
var strrepl = require('./lib/strrepl');
var fexist  = fs.existsSync;
var fcopy   = fs.copyFileSync;
var dt = new Date();

// Paths
var src = './src';
var src_mod = src+'/mod';
var src_css = src+'/css';
var src_js  = src+'/js';

var dist = './app';
var modd = dist+'/mod';
var cssd = dist+'/css';
var jsdr = dist+'/js';
var styl = cssd+'/style.css';
var scrp = jsdr+'/script.js';

// Load libs
var lib = fread('lib.json');
lib = JSON.parse(lib);

// Load config
var cfg = fread('mod.json');
cfg = JSON.parse(cfg);

// Build MOD
var buildMOD = require(src+'/mod');

// Build CSS
var buildCSS = function(cfg) {
    var str = '';
    str += `<?
    var r = '${cfg.name}';
    var x = '${cfg.name}-';
    var CSSSTR = '';
    function CSS(str) {
        CSSSTR += str;
        return CSSSTR;
    };
    ?>`;
    fwalk(src_css).forEach(function(fl) {
        str += fread(fl);
    });
    str = rmcomm(str);
    str = t2js(str, true);
    eval(str);
    CSSSTR = '/*'+
    cfg.displayName+' - '+
    cfg.copyright+'*/\n'+CSSSTR;
    fwrite(styl, );
    console.log('CSS compiled.');
}

// Build JS
function buildJS(cfg) {
    var str = '';
    str += `<?
    var x = '${cfg.name}';
    var cfg = {
        name: '${cfg.displayName}',
        description: '${cfg.description}',
        version: '${cfg.version}',
        author: '${cfg.author}',
        email: '${cfg.email}'
    };
    ?>`;
    
    // Load libs
    lib.front.forEach(function(url){
        var l = url.split('/').pop();
        str += '<? '+fread('./lib/'+l)+'?>';
    });
    
    // Load source
    fwalk(src_js).forEach(function(fl) {
        str += fread(fl);
    });
    str = rmcomm(str);
    str = t2js(str, true);
    str = '(function(){ '+str+' })();';
    str = '/*'+
    cfg.displayName+' - '+
    cfg.copyright+'*/\n'+str;
    fwrite(scrp, str);
    console.log('JS compiled.');
}

// Watch MOD
var dirs = dwalk(src_mod);
dirs.unshift(src_mod);
dirs.forEach(function(d) {
    fs.watch(d, function(e, f) {
        if (!f.match(/^\..*/g)) {
            buildMOD(cfg);
        }
    });
}); buildMOD(cfg);

// Watch CSS
var dirs = dwalk(src_css);
dirs.unshift(src_css);
dirs.forEach(function(d) {
    fs.watch(d, function(e, f) {
        if (!f.match(/^\..*/g)) {
            buildCSS(cfg);
        }
    });
}); buildCSS(cfg);

// Watch JS
var dirs = dwalk(src_js);
dirs.unshift(src_js);
dirs.forEach(function(d) {
    fs.watch(d, function(e, f) {
        if (!f.match(/^\..*/g)) {
            buildJS(cfg);
        }
    });
}); buildJS(cfg);