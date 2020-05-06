function on(el, ev, fn) {
    var doc = document;
    if (typeof ev == 'string' ) ev = [ev];
    typeof el != 'string' ? el = [el]:
    el = document.querySelectorAll(el);
    ev.forEach(function(ev){
        el.forEach(function(el){
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
    });
};