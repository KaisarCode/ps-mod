/**
# T2JS
String templates to JS.

## Params:
@str: [string] Template string
@cfg: [object] Configuration object
    - @otag: [string]  Open tag (dft: '<?')
    - @ctag: [string]  Close tag (dft: '?>')
    - @mini: [boolean] Minify output (dft: false)
    - @mode: [string] Switch parse mode (dft: 'raw')
*/
var t2js = (function(){
    
    function t2js(str, cfg) {
        str = str || '';
        str = str+'';
        
        // Legacy (Minify as second param)
        if (typeof cfg !== 'object') {
        var min = cfg || false;
        cfg = {}; cfg.mini = min; }
        
        // Config
        cfg = cfg || {};
        cfg.mini = cfg.mini || false;
        cfg.otag = cfg.otag || '<?';
        cfg.ctag = cfg.ctag || '?>';
        cfg.mode = cfg.mode || 'raw';
        var tplv = '_T2JSTPLV_';
        
        // Inner vars
        var otg = cfg.otag;
        var ctg = cfg.ctag;
        var ot  = resc(otg);
        var ct  = resc(ctg);
        
        // Prepare output
        var out = '';
        var rx  = '';
        var rxs = '';
        
        var nl = resc('_T2JSNEWLINE_');
        if (cfg.mini) str = strmin(str);
        str = str.replace(/\n+/g, nl);
        str += otg+ctg;
        str += otg+ctg;
        
        // Trim consecutive tags
        rx  = resc("+"+ctg+otg+"+");
        rx  = new RegExp(rx, 'gm');
        str = str.replace(rx, '+');
        
        // Trim spaced consecutive tags
        rx  = resc("+"+ctg+" "+otg+"+");
        rx  = new RegExp(rx, 'gm');
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
                    b = b.replace(/\\'/gm, "'");
                    htm = htm.replace(a, "'+("+b+")+'", str);
                })};
                
                // Add htm to tpl variable
                if (cfg.mode == 'tpl') {
                    htm = " "+tplv+"+="+htm;
                }
                
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
        out = out.replace(/';,/g, "',");  // fix string in function param
        out = out.replace(/';;/g, "';");  // fix double semicolon
        
        if (cfg.mode == 'tpl') {
            out = '(function(){var '+tplv+'=\'\'; '+out+' return '+tplv+'})();';
        }
        
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