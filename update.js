/*Update JSUtils from CDN*/
var fs = require('fs');
var https = require('https');
var exist = fs.existsSync;
var mkdir = fs.mkdirSync;
var write = fs.writeFileSync;
var fread = fs.readFileSync;
var wrtmd = { mode: 0o755 };

var libs = [
'dwalk',
'fwalk',
'fread',
'fwrite',
't2js',
'rmcomm',
'strmin',
'strrepl',
'domobserve',
];

if (!exist('lib')) mkdir('lib');
var ldl = 0;
var lbl = libs.length;
libs.forEach(function(a){
    var fl = `${a}.js`;
    var url = ''+
    'https://cdn.jsdelivr.net'+
    `/gh/KaisarCode/JSUtils/${fl}`;
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
