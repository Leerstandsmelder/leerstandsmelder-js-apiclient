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