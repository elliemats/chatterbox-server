/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// exports.requestHandler = requestHandler;

var http = require('http');

var messages = [];

var defaultCorsHeaders = {
  "Content-Type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var headers = defaultCorsHeaders;

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
}


var requestHandler = function(request, response) {
  console.log("Request url: " + request.url);
  console.log("Serving request type " + request.method + " for url " + request.url);


  if(request.url === '/') {
    //GET REQUESTS
    if(request.method === 'GET') {
      sendResponse(response, {results: messages});
    } else if(request.method === 'POST') {
      response.writeHead(201, headers);
      var body = "";
      request.on('data', function(chunk) {
        body += chunk;
      })
      request.on('end', function() {
        messages.push(JSON.parse(body))
        response.end('');
      })
    } else if(request.method === 'OPTIONS') {
      sendResponse(response, null);
    }
  } else {
    sendResponse(response, '', 404);
  }


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify({results: body}));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static fi'le serving.

exports.requestHandler = requestHandler;
