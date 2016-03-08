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