(function () {

    'use strict';

    var httpService = require('./http/node-http'),
        apiClient = require('./apiclient'),
        parser = require('./util/data-parser');

    module.exports = function (config) {
        return apiClient.client(httpService, parser, config);
    };

})();