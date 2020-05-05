// JSON HTTP Request
function jreq(mth, url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open(mth, url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (typeof data == 'object') data = JSON.stringify(data);
    xhr.send(data); xhr.onreadystatechange = function() {
        if (xhr.readyState === 4){
            var res = xhr.response;
            cb(res, xhr.state);
        }
    }; return xhr;
};