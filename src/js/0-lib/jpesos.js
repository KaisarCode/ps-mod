/*
# JPesos
Simplest DOM manipulation library with optional prefixed selectors
*/
function jPesos(opts) {
    
    var j$ = {};
    opts = opts || {};
    // Prefix
    opts.pfx = opts.pfx || '';
    // Prefix replacer
    opts.pfxr = opts.pfxr || '$x';
    // Expose opts
    j$.opts = opts;
    
    // Is datatype
    var is = {};
    is.def = function(v){
        return typeof v !== 'undefined';
    };
    is.obj = function(v){
        return typeof v == 'object';
    };
    is.arr = function(v){
        return Array.isArray(v);
    };
    is.str = function(v){
        return typeof v == 'string';
    };
    is.num = function(v) {
        return !isNaN(v);
    };
    is.fun = function(v) {
        return typeof v == 'function';
    };
    is.rgx = function(v) {
        return v instanceof RegExp;
    };
    
    // Replace in string
    function rplc(srch, repl, str, flag) {
        srch = srch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        flag = flag || 'gim';
        var rx = new RegExp(srch, flag);
        return str.replace(rx, repl);
    };
    
    // Find (or select)
    j$.find = function(s, p){
        var out = {};
        out.length = 0;
        var x = opts.pfx;
        var pfxr = opts.pfxr;
        var p = p || document;
        var ts = typeof s;
        
        // If selector is undefined
        if (ts == 'undefined') {
            out.type = ts;
            out.length = 0;
            out.type = ts;
        } else
        
        // If selector is null
        if (s == null) {
            out[0] = s;
            out.length = 1;
            out.type = 'object';
        } else
        
        // If selector is regexp
        if (s instanceof RegExp) {
            out[0] = s;
            out.length = 1;
            out.type = 'regexp';
        } else {
            
            // If explicitly defined that is html
            // fill output with html elems array
            if (s.isj$ && s.type == 'html') {
                for (var i = 0; i < s.length; i++) {
                    out[out.length] = s[i];
                    out.length++;
                    out.type = 'html';
                }
            } else
            
            // If selector is an array
            if (is.arr(s)) {
                s.forEach(function(l){
                    out[out.length] = l;
                    out.length++;
                }); out.type = 'array';
            } else
            
            // If selector is a Node list
            if (NodeList.prototype.isPrototypeOf(s)) {
                s.forEach(function(l){
                    out[out.length] = l;
                    out.length++;
                }); out.type = 'html';
            } else
            
            // If selector is event
            if (s instanceof Event) {
                out[0] = s;
                out.length = 1;
                out.type = 'event';
            } else
            
            // If selector is a html elem
            if (s.tagName || s == document || s == window) {
                out[0] = s;
                out.length = 1;
                out.type = 'html';
            } else
            
            // If selector is an object
            if (ts == 'object') {
                out[0] = s;
                for (var n in s) { out.length++; }
                out.type = 'object';
            } else
            
            // If selector is a string
            // treat it as a queryselector
            if (ts == 'string') {
                var tmp = [];
                var pq = j$.find(p);
                var x = opts.pfx;
                var xr = opts.pfxr;
                s = rplc(xr, x, s);
                pq.each(function(q){
                    try {
                    var rs = q.querySelectorAll(s);
                    rs.forEach(function(l){
                        if (!tmp.indexOf(l) > -1) tmp.push(l);
                    }); } catch (err) {};
                });
                tmp.forEach(function(l){
                    out[out.length] = l;
                    out.length++;
                }); out.type = 'html';
            }
            
            // If selector is anything else
            // fill output with the input var
            else {
                out[0] = s;
                out.length = 1;
                out.type = ts;
            }
        }
        
        // Denote is a j$ collection
        if (s !== null) {
            out.isj$ = true;
        }
        
        // Iterate selected elems
        if (ts !== 'undefined') {
            out.each = function(cb) {
                for (var i = 0; i < out.length; i++) {
                    cb(out[i], i);
                }
            };
        }
        
        // Select element from out
        if (ts !== 'undefined') {
            out.eq = function(i) {
                return j$.find(out[i]);
            };
        }
        
        // Select elems in out
        if (out.type == 'html') {
            out.find = function(s) {
                var p = [];
                var x = opts.pfx;
                var l = out.length;
                for (var i = 0; i < l; i++) {
                    p.push(out[i]);
                } p.type = 'html';
                return j$.find(s, p, x);
            };
        }
        
        // Add element
        if (out.type == 'html') {
            out.add = function(tag) {
                var o = [];
                tag = tag || 'div';
                out.each(function(p){
                    if (!is.def(tag.nodeName)) {
                        var el = document.createElement(tag);
                    } else { var el = tag; }
                    p.appendChild(el);
                    o.push(el);
                });
                o.type = 'html';
                o.isj$ = true;
                return j$.find(o);
            };
        }
        
        // Delete element
        if (out.type == 'html') {
            out.del = function() {
                out.each(function(el){
                    try {
                        el.parentNode.removeChild(el);
                    } catch (err) {};
                }); return out;
            };
        }
        
        // Get parent
        if (out.type == 'html') {
            out.parent = function() {
                var o = [];
                out.each(function(el){
                    var tkn = false;
                    var p = el.parentNode;
                    o.forEach(function(t){
                        if (t === p) tkn = true;
                    }); if (!tkn && p) o.push(p);
                });
                o.type = 'html';
                o.isj$ = true;
                return j$.find(o);
            };
        }
        
        // Get previous sibling
        if (out.type == 'html') {
            out.prev = function() {
                var o = [];
                out.each(function(el){
                    var tkn = false;
                    var p = el.previousElementSibling;
                    o.forEach(function(t){
                        if (t === p) tkn = true;
                    }); if (!tkn && p) o.push(p);
                });
                o.type = 'html';
                o.isj$ = true;
                return j$.find(o);
            };
        }
        
        // Get nexts sibling
        if (out.type == 'html') {
            out.next = function() {
                var o = [];
                out.each(function(el){
                    var tkn = false;
                    var p = el.nextElementSibling;
                    o.forEach(function(t){
                        if (t === p) tkn = true;
                    }); if (!tkn && p) o.push(p);
                });
                o.type = 'html';
                o.isj$ = true;
                return j$.find(o);
            };
        }
        
        // Add HTML to element
        if (out.type == 'html') {
            out.addHTML = function(htm, pfx) {
                if (htm !== 0) htm = htm || '';
                htm = htm.toString();
                
                // Replace prefix
                if (!is.def(pfx)) pfx = x;
                htm = rplc('\\'+pfxr, '$j$PFXR', htm);
                htm = rplc(pfxr, pfx, htm);
                htm = rplc('$j$PFXR', pfxr, htm);
                
                // Add contents
                out.each(function(el){
                    el.innerHTML += htm;
                }); return out;
            };
        }
        
        // Empty HTML of element
        if (out.type == 'html') {
            out.delHTML = function() {
                out.each(function(el){
                    el.innerHTML = '';
                }); return out;
            };
        }
        
        // Add attributes
        // @attr: string or object with keys:values
        // @val: value (if @attr is string)
        if (out.type == 'html') {
            out.addAttr = function(atr, val) {
                atr = atr || {};
                out.each(function(el){
                    if (is.str(atr)) {
                        el.setAttribute(atr, val);
                    } else {
                        for (var k in atr) {
                            el.setAttribute(k, atr[k]);
                        }
                    }
                }); return out;
            };
        }
        
        // Del attributes
        // Each argument passed is an attribute name
        if (out.type == 'html') {
            out.delAttr = function() {
                var atr = arguments;
                out.each(function(el){
                    for (var i = 0; i < atr.length; i++) {
                        el.removeAttribute(atr[i]);
                    }
                }); return out;
            };
        }
        
        // Add CSS classes
        // @cls: string with classes
        // @pfx: prefix classes
        if (out.type == 'html') {
            out.addClass = function(cls, pfx) {
                if (!is.def(pfx)) pfx = x;
                if (pfx) pfx += '-';
                cls = cls || '';
                if (is.arr(cls)) {
                    cls = cls.join(' ');
                }
                cls = cls.replace('\n', ' ');
                cls = cls.replace(/\s+/g,' ');
                cls = cls.split(' ');
                out.each(function(el){
                    cls.forEach(function(cls){
                        cls = cls.trim();
                        if (cls) el.classList.add(pfx+cls);
                    });
                    
                    // Remove empty class attr
                    if (
                    !el.classList.length &&
                    is.def(el.attributes['class'])
                    ) { el.removeAttribute('class'); }
                    
                }); return out;
            };
        }
        
        // Delete CSS classes
        // @cls: string with classes
        // @pfx: prefix classes
        if (out.type == 'html') {
            out.delClass = function(cls, pfx) {
                if (!is.def(pfx)) pfx = x;
                if (pfx) pfx += '-';
                cls = cls || '';
                if (is.arr(cls)) {
                    cls = cls.join(' ');
                }
                cls = cls.replace('\n', ' ');
                cls = cls.replace(/\s+/g,' ');
                cls = cls.split(' ');
                out.each(function(el){
                    cls.forEach(function(cls){
                        cls = cls.trim();
                        if (cls) el.classList.remove(pfx+cls);
                    });
                    
                    // Remove empty class attr
                    if (
                    !el.classList.length &&
                    is.def(el.attributes['class'])
                    ) { el.removeAttribute('class'); }
                    
                }); return out;
            };
        }
        
        // Prefix CSS classes
        // @pfx: prefix classes
        if (out.type == 'html') {
            out.pfxClass = function(pfx) {
                if (!is.def(pfx)) pfx = x;
                out.each(function(el){
                    var cls = el.classList;
                    clss = [];
                    cls.forEach(function(cls){
                        cls = cls.replace(pfx+'-', '');
                        clss.push(cls);
                    }); el.className = '';
                    j$.find(el).addClass(clss, pfx);
                }); return out;
            };
        }
        
        // Add inline CSS
        // @cls: string or object with keys:values
        // @val: value (if @attr is string)
        if (out.type == 'html') {
            out.addCSS = function(cls, val) {
                cls = cls || {};
                out.each(function(el){
                    if (is.str(cls)) {
                        el.style[cls] = val;
                    } else {
                        for (var k in cls) {
                            el.style[k] = cls[k];
                        }
                    }
                }); return out;
            };
        }
        
        // ON event
        // @ev: Event name
        // @fn: Function
        if (out.type == 'html') {
            out.on = function(ev, fn) {
                var doc = document;
                if (is.str(ev)) ev = [ev];
                ev.forEach(function(ev){
                    out.each(function(el){
                        if (!is.def(el.j$EventListeners)) {
                            el.j$EventListeners = {};
                            el.j$EventListeners.length = 0;
                        } var j$ls = el.j$EventListeners;
                        j$ls.length++;
                        j$ls['f'+j$ls.length] = fn;
                        if (el == doc && ev == 'ready') {
                            ev = 'DOMContentLoaded';
                            doc.readyState != 'loading' ?
                            fn(null, el) :
                            el.addEventListener(ev, function(e){
                                fn(e, el);
                            });
                        } else {
                            el.addEventListener(ev, function(e){
                                fn(e, el);
                            });
                        }
                    });
                }); return out;
            };
        }
        
        // OFF event
        // @ev: Event name
        // @fn: Function name
        if (out.type == 'html') {
            out.off = function(ev, fn) {
                var doc = document;
                if (is.str(ev)) ev = [ev];
                ev.forEach(function(ev){
                    out.each(function(el){
                        if (!is.def(el.j$EventListeners)) {
                            el.j$EventListeners = {};
                            el.j$EventListeners.length = 0;
                        } var j$ls = el.j$EventListeners;
                        if (el == doc && ev == 'ready') {
                            ev = 'DOMContentLoaded';
                        }
                        if (is.def(fn)) {
                            el.removeEventListener(ev, fn);
                        } else {
                            for (var i = 0; i < j$ls.length; i++) {
                                el.removeEventListener(ev, j$ls['f'+i]);
                            }  el.j$EventListeners = {};
                        }
                    });
                }); return out;
            };
        }
        
        // TRIGGER event
        // @ev: Event name
        // @data: Pass data to event
        if (out.type == 'html') {
            out.trigger = function(ev, data) {
                var doc = document;
                data = data || null;
                if (is.str(ev)) ev = [ev];
                ev.forEach(function(ev){
                    out.each(function(el){
                        try {
                            var event = document.createEvent('HTMLEvents');
                            event.initEvent(ev, true, false);
                            event.detail = data;
                        } catch (err) {
                            if (window.CustomEvent && is.fun(window.CustomEvent)) {
                                var event = new CustomEvent(ev, { detail: data });
                            } else {
                                var event = document.createEvent('CustomEvent');
                                event.initCustomEvent(ev, true, true, data);
                            }
                        } el.dispatchEvent(event);
                    });
                }); return out;
            };
        }
        
        // Stop event bubbling
        if (out.type == 'event') {
            out.stop = function() {
                out.each(function(e){
                    var evt = e ? e:window.event;
                    if (evt.stopPropagation) evt.stopPropagation();
                    if (evt.cancelBubble != null) evt.cancelBubble = true;
                }); return out;
            };
        }
        
        // Return output
        return out;
        
    };
    
    // jQuery-like wrapper
    j$.$ = j$.find;
    for (var k in j$) {
        j$.$[k] = j$[k];
    }
    
    // Return
    return j$;
};
