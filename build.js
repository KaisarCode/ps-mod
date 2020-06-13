var fs = require('fs');
var vm = require('vm');
var t2js = require('t2js');
var dwalk = require('kc-dwalk');
var fwalk = require('kc-fwalk');
var fread = require('kc-fread');
var fwrite = require('kc-fwrite');
var strmin = require('kc-strmin');
var rmcomm = require('kc-rmcomm');

// Watch
function watch(src, cb) {
    var dirs = dwalk(src);
    dirs.unshift(src);
    dirs.forEach(function(d){
        fs.watch(d, function(e, f){
            if (
            !f.match(/^\..*/g) &&
            !f.match(/^index.php$/g)
            ) { cb(); }
        });
    }); cb();
};

// Build CSS
watch('src/css', function(){
    var str = '';
    fwalk('src/css').forEach(function(f){
        str += fread(f);
    });
    str = t2js(str, {
        mode: 'tpl'
    });
    str = rmcomm(str);
    str = strmin(str);
    str = vm.runInNewContext(str);
    fwrite('app/css/style.css', str);
    console.log('CSS Compiled');
});

// Build JS
watch('src/js', function(){
    var str = '';
    fwalk('src/js').forEach(function(f){
        str += fread(f);
    });
    str = rmcomm(str);
    str = strmin(str);
    str = str.trim();
    fwrite('app/js/script.js', str);
    console.log('JS Compiled');
});

// Build MOD
watch('src/mod', function(){
    var opt = fread('mod.json');
    opt = JSON.parse(opt);
    require('./src/mod')(opt);
});