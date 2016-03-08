(function () {

    'use strict';

    var http = require('http'),
        url = require('url');

    module.exports.request = function (config, callback, progress) {

        var parsedUrl = url.parse(config.url);
        var requestSetup = {
            host: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: config.method,
            headers: {
                'Content-Type': config.contentType
            }
        };

        if (config.auth) {
            requestSetup.headers.Authorization = config.auth;
        }

        var req = http.request(requestSetup, function (res) {
            var error = null,
                result = '';
            if (res.statusCode !== 200 && res.statusCode !== 201) {
                error = {
                    code: res.statusCode,
                    message: res.statusCode
                };
            }

            res.setEncoding('utf8');

            res.on('data', function (data) {
                result += data;
            });

            res.on('end', function () {
                callback(error, result);
            });

        });

        req.on('error', function (err) {
            console.log('problem with request: ' + err.message);
            callback(err, null);
        });

        if (config.data) {
            req.write(config.data);
        }

        req.end();
    };

})();