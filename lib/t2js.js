/**
# T2JS
String templates to JS.
*/
var t2js = (function(){
    
    function t2js(str, min) {
        
        var out = '';
        str = str || '';
        min = min || false;
        otg = '<?';
        ctg = '?>';
        
        var ot = resc(otg);
        var ct = resc(ctg);
        
        var rx = '';
        var rxs = '';
        
        var nl = resc('_t2js_newline_');
        if (min) str = strmin(str);
        str = str.replace(/\n+/g, nl);
        str += otg+ctg;
        str += otg+ctg;
        
        // Trim consecutive tags
        rx = resc("+"+ctg+otg+"+");
        rx = new RegExp(rx, 'gm');
        str = str.replace(rx, '+');
        
        // Trim spaced consecutive tags
        rx = resc("+"+ctg+" "+otg+"+");
        rx = new RegExp(rx, 'gm');
        str = str.replace(rx, "+' '+");
        
        // JS tags regex
        rxs = '';
        rxs += resc(otg);
        rxs += '(.+?)';
        rxs += resc(ctg);
        rx = new RegExp(rxs, 'gm');
        
        // Get positions of JS tags
        var pos = [];
        while (m = rx.exec(str)) {
            var i0 = m.index;
            var i1 = rx.lastIndex;
            pos.push([i0, i1]);
        }
        var pi = 0;
        
        // Replace blocks
        pos.forEach(function(p){
            
            // HTML blocks
            var htm = str.substring(pi, p[0]);
            //htm = htm.trim();
            if (htm) {
                
                // Replace html blocks
                htm  = htm.replace(/'/g, "\\'");
                rx = new RegExp(nl, 'g');
                htm  = htm.replace(rx, "\\\n");
                htm  = "'"+htm+"';";
                htm  = htm.trim();
                
                // String literals
                var rx = /\${(.*?)}/gim;
                var m = htm.match(rx);
                if (m) { m.forEach(function(a){
                    var b = a.replace(/^\${/g, '');
                    b = b.replace(/}$/g, '');
                    b = b.replace(/\n/gm, '');
                    b = b.replace(/\\\s/gm, '');
                    htm = htm.replace(a, "'+("+b+")+'", str);
                })};
                
                // Out htm
                out += htm;
            }
            
            // JS blocks
            var js = str.substring(p[0], p[1]);
            if (js) {
                js = js.replace(new RegExp(ot, 'ig'), '');
                js = js.replace(new RegExp(ct, 'ig'), '');
                js = js.trim();
                rx = new RegExp(nl, 'g');
                js  = js.replace(rx, "\n");
                out += js;
            }
            pi = p[1];

        });
        
        // Fix special cases
        out = out.replace(/';\s?\+/ig, "'+"); // <?+ something +?>
        out = out.replace(/';\)/g, "')"); // fix string in function param
        out = out.replace(/';,/g, "',"); // fix string in function param
        out = out.replace(/';;/g, "';"); // fix double semicolon
        
        return out;
    }

    // Is defined
    function isdef(v) {
        return typeof v !== 'undefined';
    }

    // Regular expression escape
    function resc(str = '') {
        return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
    }
    
    // Minify
    function strmin(str) {
        str = str.replace(/\s+/g, ' ');
        str = str.trim();
        return str;
    }
    
    // Export module
    try {(typeof process !== 'undefined') &&
    (typeof process.versions !== 'undefined') &&
    (typeof process.versions.node !== 'undefined') ?
    module.exports = t2js : true; } catch (err) {};
    
    return t2js;

})();