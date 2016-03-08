(function () {

    'use strict';

    module.exports.request = function (config, callback, progress) {
        if (typeof XMLHttpRequest === 'undefined') {
            if (typeof callback === 'function') {
                callback(new Error('XMLHttpRequest not available'), null);
            }
            return;
        }
        var req = new XMLHttpRequest();
        req.open(config.method, config.url, true);
        req.setRequestHeader('Content-Type', config.contentType);
        if (config.auth) {
            req.setRequestHeader('Authorization', config.auth);
        }
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200 || req.status === 201) {
                    callback(null, req.responseText);
                } else {
                    callback({
                        code: req.status,
                        message: null
                    }, req.responseText);
                }
            }
        };
        req.onprogress = function (evt) {
            if (evt.lengthComputable && typeof progress === 'function') {
                progress(evt.loaded / evt.total, evt.total);
            }
        };
        if (config.data) {
            req.send(config.data);
        } else {
            req.send();
        }
    };

})();