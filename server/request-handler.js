/*************************************************************
REQUEST HANDLER FUNCTION!
**************************************************************/
var http = require('http');

var messages = [];

var headers = {
  "Content-Type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// HELPER FUNCTION

var sendResponse = function( response, data, statusCode ){
  statusCode = statusCode || 200;
  response.writeHead( statusCode, headers );
  response.end( JSON.stringify(data) );
}


var requestHandler = function(request, response) {

  if(request.url === '/') {

    if( request.method === 'GET' ) {
      sendResponse( response, {results: messages} );
    }

    else if( request.method === 'POST') {
      response.writeHead( 201, headers );
      var body = "";

      request.on('data', function( chunk ) {
        body += chunk;
      })
      request.on('end', function() {
        messages.push(JSON.parse(body))
        response.end('');
      })
    }

    else if( request.method === 'OPTIONS' ) {
      sendResponse( response, null );
    }

  } else {
    sendResponse( response, '', 404 );
  }
};

exports.requestHandler = requestHandler;

  // Make sure to always call response.end()
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  //*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.


