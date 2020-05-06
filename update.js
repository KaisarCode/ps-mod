/*Update JSUtils from CDN*/
var fs = require('fs');
var https = require('https');
var exist = fs.existsSync;
var mkdir = fs.mkdirSync;
var write = fs.writeFileSync;
var fread = fs.readFileSync;
var wrtmd = { mode: 0o755 };

// Load libs definition
var libjs = fread('lib.json')+'';
libjs = JSON.parse(libjs);
var libs = libjs.back;
libs = libs.concat(libjs.front);
if (!exist('lib')) mkdir('lib');
var ldl = 0;
var lbl = libs.length;

// Load libs
libs.forEach(function(a){
    var fl = `${a}.js`;
    var url = ''+
    'https://raw.githack.com/KaisarCode'+
    `/JSUtils/master/${fl}`;
    https.get(url, function(res){
        var f = `lib/${fl}`;
        var c = '';
        res.on('data', function(d){
            c += d+'';
        });
        res.on('end', function(d){
            write(f, c, wrtmd);
            ldl++;
            if (ldl >= lbl)
            console.log('Libs updated.');
        });
    });
});
