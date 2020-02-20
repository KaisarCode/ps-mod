const watch = require('chokidar').watch;
const topless = require('topless');
const psmod = require('./index');
const t2js = require('t2js');
const fs = require('fs');
const dt = new Date();

// Compile module
function buildMOD() {
    var cnf = {};
    if (fs.existsSync('conf.json')) {
        cnf = fs.readFileSync('conf.json', 'utf-8');
        cnf = JSON.parse(cnf);
    } cnf = cnf || {};
    cnf.dir = cnf.dir || 'dist/mod';
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
        cnf.ext_css = `https://cdn.jsdelivr.net/gh/${cnf.author}/${cnf.className}/dist/css/style.css`;
    }
    if (typeof cnf.ext_js == 'undefined') {
        cnf.ext_js = `https://cdn.jsdelivr.net/gh/${cnf.author}/${cnf.className}/dist/js/script.js`;
    }
    cnf.ext_ws = cnf.ext_ws || '';
    psmod(cnf);
    console.log('MOD compiled. Waiting for changes...');
} buildMOD();
watch('src/mod', {
  ignored: /\.gout.*/,
  persistent: true
})
.on('change', buildMOD)
.on('unlink', buildMOD);

// Compile JS
function buildJS() {
    t2js.bundle('src/js', {
        output: 'dist/js/script.js',
        minify: true,
        enclose: true,
        init: 'initApp',
        lib: ['node_modules/jpesos/j$.js'],
        oncompiled: function(){
            console.log('JS compiled. Waiting for changes...');
        }
    });
} buildJS();
watch('src/js', {
  ignored: /\.gout.*/,
  persistent: true
})
.on('change', buildJS)
.on('unlink', buildJS);

// Compile CSS
function buildCSS() {
    topless('src/css', {
        minify: true,
        output: 'dist/css',
        oncompiled: function(){
            console.log('CSS compiled. Waiting for changes...');
        }
    });
} buildCSS();
watch('src/css', {
  ignored: /\.gout.*/,
  persistent: true
})
.on('change', buildCSS)
.on('unlink', buildCSS);