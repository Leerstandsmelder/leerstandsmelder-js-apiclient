(function () {

    'use strict';

    module.exports = function (config) {
        var httpService = require('./http/xmlhttp'),
            apiClient = require('./apiclient'),
            parser = require('./util/data-parser');

        return apiClient.client(httpService, parser, config);
    };

})();