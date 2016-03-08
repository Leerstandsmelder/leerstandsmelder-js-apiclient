# Leerstandsmelder API Client

A javascript client for the [Leerstandsmelder API](https://bitbucket.org/ito-suite/leerstandsmelder-api) (Node & Browser)

## Stability

Unstable: Expect patches and features, possible api changes.

## Using the client

Both implementations only differ in the setup procedure. Other than that they work identically. (Side note: progress is not yet implemented in the node version.)

### NodeJS

```javascript
var apiConfig = {
    host: 'http://localhost:8080',
    contentType: 'application/json',
    api_key: YOUR_LEERSTANDSMELDER_API_KEY,            # optional if only anonymous requests
    access_token: YOUR_LEERSTANDSMELDER_ACCESS_TOKEN   # optional if only anonymous requests
};

var apiClient = require('leerstandsmelder-apiclient')(apiConfig);
```

### Browser

To use the client in the browser, include either `dist/leerstandsmelder-apiclient.web.js` or `dist/leerstandsmelder-apiclient.web.min.js`.

```javascript
var apiConfig = {
    host: host ? host : LEERSTANDSMELDER_API_HOST,
    contentType: 'application/json',
    api_key: YOUR_LEERSTANDSMELDER_API_KEY,            // optional if only anonymous requests
    access_token: YOUR_LEERSTANDSMELDER_ACCESS_TOKEN   // optional if only anonymous requests
};

var apiClient = LMApi(apiConfig);
```

## Making requests

To make a request use a function call like this:

```javascript
apiClient.resource('locations').action(
    'get',  // HTTP method
    null,   // optional payload object
    function (err, result) {
        console.log('api response handler', err, result);
    },
    function (bytesLoaded, bytesTotal) {
        console.log('progress handler', bytesLoaded, bytesTotal);
    }
);
```

Nested resources can be accessed by using a resource name like `locations/LOCATION_UUID/photos`.

## Authentication

To receive an Access Token from the API server:

```javascript
apiClient.getToken({ email: login, password: password }, function (err, token) {
    if (err) {
        console.log('access token error', err);
    } else {
        // You might want to store the token to use it later instead of the email/pass combo
        apiClient.setToken(token);
    }
});
```

If you have a token you can fetch your api credentials and make authenticated requests after that:

```javascript
apiClient.getCredentials(function (err, credentials) {
    console.log('credentials response', err, credentials);
});
```

## Building

To update the browser files in ``dist`` just run ``gulp``.