function domObserve(el, cb) {
    var mo = new MutationObserver(function(mu) {
        mu.forEach(function(m) {
            for (var i = 0; i < m.addedNodes.length; i++) {
                var o = m.addedNodes[i];
                if (o.tagName) cb('add', m.addedNodes[i]);
            }
            for (var i = 0; i < m.removedNodes.length; i++) {
                var o = m.removedNodes[i];
                if (o.tagName) cb('del', m.removedNodes[i]);
            }
            if (m.type == 'attributes') {
                cb('atr', m.target);
            }
        });
    });
    mo.observe(el, {
        attributes: true,
        childList: true,
        subtree: true
    }); return mo;
};