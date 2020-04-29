const psmod = require('./src/mod');
const dwalk = require('./lib/dwalk');
const fread = require('./lib/fread');
const fwrite = require('./lib/fwrite');
const fs = require('fs');
const dt = new Date();

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

// Compile module
function buildMOD() {
    var cnf = {};
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
    cnf.ext_ws = cnf.ext_ws || ''; psmod(cnf);
    console.log('MOD compiled.');
}

// Compile CSS
function buildCSS() {
    
    console.log('CSS compiled.');
}

// Compile JS
function buildJS() {
    
    console.log('JS compiled.');
}

// Build MOD
var dir = 'src/mod';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
var dirs = dwalk(dir);
dirs.unshift(dir);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildMOD();
}); }); buildMOD();

// Build CSS
var dir = 'src/css';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
var dirs = dwalk(dir);
dirs.unshift(dir);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildCSS();
}); }); buildCSS();

// Build JS
var dir = 'src/js';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
var dirs = dwalk(dir);
dirs.unshift(dir);
dirs.forEach(function(d){
fs.watch(d, function(e, f){
if (!f.match(/^\..*/g)) buildJS();
}); }); buildJS();