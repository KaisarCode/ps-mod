const watch = require('chokidar').watch;
var topless = require('topless');
var psmod = require('./index');
var t2js = require('t2js');

// Compile module
function buildMOD() {
    psmod({
        dir: 'dist/mod',
        name: 'mymodule',
        className: 'MyModule',
        displayName: 'My Module',
        description: 'This is my module',
        tab: 'others',
        version: '1.0.0',
        author: 'KaisarCode',
        email: 'kaisar@kaisarcode.com',
        copyright: '2020 KaisarCode',
        ext_css: 'https://cdn.jsdelivr.net/gh/KaisarCode/PSMod/dist/css/style.css',
        ext_js: 'https://cdn.jsdelivr.net/gh/KaisarCode/PSMod/dist/js/script.js',
        ext_ws: ''  // External Webservice
    });
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