(function(){
var r=function(){var e="function"==typeof require&&require,r=function(i,o,u){o||(o=0);var n=r.resolve(i,o),t=r.m[o][n];if(!t&&e){if(t=e(n))return t}else if(t&&t.c&&(o=t.c,n=t.m,t=r.m[o][t.m],!t))throw new Error('failed to require "'+n+'" from '+o);if(!t)throw new Error('failed to require "'+i+'" from '+u);return t.exports||(t.exports={},t.call(t.exports,t,t.exports,r.relative(n,o))),t.exports};return r.resolve=function(e,n){var i=e,t=e+".js",o=e+"/index.js";return r.m[n][t]&&t?t:r.m[n][o]&&o?o:i},r.relative=function(e,t){return function(n){if("."!=n.charAt(0))return r(n,t,e);var o=e.split("/"),f=n.split("/");o.pop();for(var i=0;i<f.length;i++){var u=f[i];".."==u?o.pop():"."!=u&&o.push(u)}return r(o.join("/"),t,e)}},r}();r.m = [];
r.m[0] = {
"apiclient.js": function(module, exports, require){
(function () {

    'use strict';

    var config = {},
        parser = {},
        http = {};

    module.exports.client = function (httpService, dataParser, apiConfig) {
        var auth = require('./util/auth-header');
        http = httpService;
        parser = dataParser;
        config = apiConfig;
        return {
            authUtil: auth,
            resource: function (resourceName, query) {
                return {
                    action: function (method, data, callback, progress) {
                        var path = '/' + resourceName;

                        if (data === null) {
                            data = undefined;
                        }
                        if (typeof data === 'string') {
                            // supplied data is a resource id
                            path += '/' + data;
                            data = null;
                        } else if (typeof data === 'object' && typeof data.uuid === 'string') {
                            if (method.toLowerCase() !== 'post') {
                                // check if resource object contains id
                                path += '/' + data.uuid;
                                delete data.uuid;
                            }
                        }
                        var queryString = '';
                        if (typeof query === 'object') {
                            var queryParts = [];
                            for (var key in query) {
                                queryParts.push(key + '=' + encodeURIComponent(query[key]));
                            }
                            queryString = '?' + queryParts.join('&');
                        }

                        http.request(
                            {
                                url: config.host + path + queryString,
                                auth: auth.getTokenHeader(config.access_token),
                                method: method,
                                contentType: config.contentType,
                                query: query,
                                data: data ? parser.unparse(data, config.contentType) : undefined
                            },
                            function (err, result) {
                                if (typeof callback === 'function') {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    parser.parse(result, config.contentType, function (err, object) {
                                        callback(err, object);
                                    });
                                }
                            },
                            function (bytesLoaded, bytesTotal) {
                                if (typeof progress === 'function') {
                                    progress(bytesLoaded, bytesTotal);
                                }
                            }
                        );
                    }
                };
            },
            getToken: function (credentials, callback) {
                http.request(
                    {
                        url: config.host + '/users/me/access_tokens',
                        method: 'post',
                        contentType: config.contentType,
                        data: parser.unparse(credentials, config.contentType)
                    },
                    function (err, result) {
                        if (typeof callback === 'function') {
                            if (err) {
                                return callback(err, null);
                            }
                            parser.parse(result, config.contentType, function (err, access_token) {
                                if (!err && access_token) {
                                    config.access_token = access_token;
                                }
                                callback(err, access_token);
                            });
                        }
                    }
                );
            },
            getCredentials: function (callback) {
                http.request(
                    {
                        url: config.host + '/users/me/api_keys',
                        method: 'get',
                        contentType: config.contentType,
                        auth: auth.getTokenHeader(config.access_token)
                    },
                    function (err, result) {
                        if (typeof callback === 'function') {
                            if (err) {
                                return callback(err, null);
                            }
                            parser.parse(result, config.contentType, function (err, api_keys) {
                                if (!config.api_key) {
                                    config.api_key = {};
                                }
                                config.api_key.key = api_keys[0].key;
                                config.api_key.secret = api_keys[0].secret;
                                callback(err, api_keys[0]);
                            });
                        }
                    }
                );
            },
            setCredentials: function (apiKey, apiSecret) {
                config.api_key.key = apiKey;
                config.api_key.secret = apiSecret;
            },
            authenticate: function (callback) {
                if (config.access_token) {
                    callback(null, config.access_token.token);
                } else {
                    http.request(
                        {
                            url: config.host + '/users/me/access_tokens',
                            method: 'post',
                            contentType: config.contentType,
                            data: parser.unparse(config.api_key, config.contentType)
                        },
                        function (err, result) {
                            if (typeof callback === 'function') {
                                if (err) {
                                    return callback(err, null);
                                }
                                parser.parse(result, config.contentType, function (err, access_token) {
                                    if (!err && access_token) {
                                        config.access_token = access_token;
                                    }
                                    callback(err, access_token);
                                });
                            }
                        }
                    );
                }
            }
        };
    };

})();
},
"http/xmlhttp.js": function(module, exports, require){
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
},
"util/data-parser.js": function(module, exports, require){
(function () {

    'use strict';

    module.exports.parse = function (input, format, callback) {
        var result = null,
            error = null;
        try {
            result = JSON.parse(input);
        } catch (e) {
            error = e;
        }
        callback(error, result);
    };

    module.exports.unparse = function (input, format) {
        return JSON.stringify(input);
    };

})();
},
"util/auth-header.js": function(module, exports, require){
(function () {

    'use strict';

    module.exports.getTokenHeader = function (access_token) {
        if (access_token && typeof access_token === 'object' && typeof access_token.token === 'string') {
            return 'bearer ' + access_token.token;
        } else {
            return null;
        }
    };

    module.exports.getBasicHeader = function (login, password) {
        if (typeof login === 'string' && typeof password === 'string') {
            return 'Basic ' + atob(login + ':' + password);
        } else {
            return null;
        }
    };

})();
},
"web-leerstandsmelder-apiclient.js": function(module, exports, require){
(function () {

    'use strict';

    module.exports = function (config) {
        var httpService = require('./http/xmlhttp'),
            apiClient = require('./apiclient'),
            parser = require('./util/data-parser');

        return apiClient.client(httpService, parser, config);
    };

})();
}
};
LMApi = r("web-leerstandsmelder-apiclient.js");}());
