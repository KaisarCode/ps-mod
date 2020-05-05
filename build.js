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

// Paths
var src = './src';
var src_mod = src+'/mod';
var src_css = src+'/css';
var src_css_l = src_css+'/0-lib';
var src_css_a = src_css+'/app';
var src_js  = src+'/js';
var src_js_l  = src_js+'/0-lib';
var src_js_a  = src_js+'/app';

var dist = './app';
var modd = dist+'/mod';
var cssd = dist+'/css';
var jsdr = dist+'/js';
var styl = cssd+'/style.css';
var scrp = jsdr+'/script.js';

// Load config
var dt = new Date();
if (!fexist('conf.json'))
fcopy('conf.sample.json', 'conf.json');
cfg = fread('conf.json');
cfg = JSON.parse(cfg);

// Build MOD
var buildMOD = require(src+'/mod');

// Build CSS
var buildCSS = function(cfg) {
    var str = '';
    str += `<? var x = '${cfg.name}'; ?>`;
    // Load libraries
    fwalk(src_css_l).forEach(function(fl) {
        str += '<? '+fread(fl)+' ?>';
    });
    // Load app files
    fwalk(src_css_a).forEach(function(fl) {
        str += fread(fl);
    });
    str = rmcomm(str);
    str = t2js(str, true);
    eval(str);
    css_str = '/*'+
    cfg.displayName+' - '+
    cfg.copyright+'*/\n'+css_str;
    fwrite(styl, css_str);
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
    // Load libraries
    fwalk(src_js_l).forEach(function(fl) {
        str += '<? '+fread(fl)+' ?>';
    });
    // Load app files
    fwalk(src_js_a).forEach(function(fl) {
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