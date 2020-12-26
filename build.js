var watch = require('kc-watch');
var dwalk = require('kc-dwalk');
var fwalk = require('kc-fwalk');
var fread = require('kc-fread');
var fwrite = require('kc-fwrite');
var strmin = require('kc-strmin');
var rmcomm = require('kc-rmcomm');

// Build CSS
function buildCSS() {
    var str = '';
    fwalk('src/css').forEach(function(f){
        str += fread(f);
    });
    str = rmcomm(str);
    str = strmin(str);
    fwrite('app/css/style.css', str);
    console.log('CSS Compiled.');
}

// Build JS
function buildJS() {
    var str = '';
    fwalk('src/js').forEach(function(f){
        str += fread(f);
    });
    str = rmcomm(str);
    str = strmin(str);
    str = str.trim();
    fwrite('app/js/script.js', str);
    console.log('JS Compiled.');
}

// Build MOD
function buildMOD() {
    var opt = fread('mod.json');
    opt = JSON.parse(opt);
    require('./src/mod')(opt);
}

// Watch and exec
watch('src/css', function(d,f){
if (f.match(/\.css$/g)) {
    buildCSS();
}});buildCSS();

watch('src/js', function(){
if (f.match(/\.js$/g)) {
    buildJS();
}});buildJS();

watch('src/mod', function(){
if (f.match(/\.php$/g)) {
    buildMOD();
}});buildMOD();
