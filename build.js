const fs = require('fs');
const psmod = require('./src/mod');
const dwalk = require('./lib/dwalk');
const fwalk = require('./lib/fwalk');
const fread = require('./lib/fread');
const fwrite = require('./lib/fwrite');

const t2js = require('./lib/t2js');
const rmcomm = require('./lib/rmcomm');
const strmin = require('./lib/strmin');
const strrepl = require('./lib/strrepl');

var src_mod = 'src/mod';
var src_css = 'src/css';
var src_js = 'src/js';
if (!fs.existsSync(src_mod)) fs.mkdirSync(src_mod);
if (!fs.existsSync(src_css)) fs.mkdirSync(src_css);
if (!fs.existsSync(src_js)) fs.mkdirSync(src_js);

var pfx  = 'mod';
var dist = 'app';
var modd = dist+'/mod';
var cssd = dist+'/css';
var jsdr = dist+'/js';
var styl = cssd+'/style.css';
var scrp = jsdr+'/script.js';
if (!fs.existsSync(dist)) fs.mkdirSync(dist);
if (!fs.existsSync(modd)) fs.mkdirSync(modd);
if (!fs.existsSync(cssd)) fs.mkdirSync(cssd);
if (!fs.existsSync(jsdr)) fs.mkdirSync(jsdr);
if (!fs.existsSync(styl)) fwrite(styl, '');
if (!fs.existsSync(scrp)) fwrite(scrp, '');

var cnf = {};
var dt = new Date();
function getConf() {
    if (fs.existsSync('conf.json')) {
        cnf = fread('conf.json');
        cnf = JSON.parse(cnf);
    } cnf = cnf || {};
    cnf.dir = cnf.dir || modd;
    cnf.name = cnf.name || 'psmod';
    cnf.className = cnf.name || 'PSMod';
    cnf.displayName = cnf.displayName || 'PS Module';
    cnf.description = cnf.description || 'PrestaShop Module';
    cnf.tab = cnf.tab || 'others';
    cnf.version = cnf.version || '1.0.0';
    cnf.author = cnf.author || 'KaisarCode';
    cnf.email = cnf.email || 'kaisar@kaisarcode.com';
    cnf.copyright = cnf.copyright || (dt.getFullYear()+' '+cnf.author);
    if (typeof cnf.ext_css == 'undefined') {
        cnf.ext_css = `https://cdn.jsdelivr.net/gh/${cnf.author}/${cnf.className}/${dist}/css/style.css`;
    }
    if (typeof cnf.ext_js == 'undefined') {
        cnf.ext_js = `https://cdn.jsdelivr.net/gh/${cnf.author}/${cnf.className}/${dist}/js/script.js`;
    }
    cnf.ext_ws = cnf.ext_ws || '';
} getConf();

// Compile module
function buildMOD() {
    psmod(cnf);
    console.log('MOD compiled.');
}

// Compile CSS
function buildCSS() {
    var str = '';
    var files = fwalk(src_css);
    str += `<? var x = '${pfx}'; ?>`;
    files.forEach(function(fl) {
    str += fread(fl); });
    str = rmcomm(str);
    str = t2js(str);
    eval(str);
    CSSSTR = '/*'+
    cnf.displayName+' - '+
    cnf.copyright+'*/\n'+CSSSTR;
    fwrite(styl, CSSSTR);
    console.log('CSS compiled.');
}

// Compile JS
function buildJS() {
    var str = '';
    var files = fwalk(src_js);
    str += `<? var x = '${pfx}'; ?>`;
    files.forEach(function(fl) {
    str += fread(fl); });
    str = rmcomm(str);
    str = t2js(str, true);
    str = '(function(){ '+str+' })();';
    str = '/*'+
    cnf.displayName+' - '+
    cnf.copyright+'*/\n'+str;
    fwrite(scrp, str);
    console.log('JS compiled.');
}

// Build MOD
var dirs = dwalk(src_mod);
dirs.unshift(src_mod);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildMOD();
}); }); buildMOD();

// Build CSS
var dirs = dwalk(src_css);
dirs.unshift(src_css);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildCSS();
}); }); buildCSS();

// Build JS
var dirs = dwalk(src_js);
dirs.unshift(src_js);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildJS();
}); }); buildJS();