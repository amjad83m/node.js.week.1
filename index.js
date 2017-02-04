var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');


var server = http.createServer(function (request, response) {
    
    var requestUrl = url.parse(request.url, true);
    var requestPath = 'www' + requestUrl.pathname;

    if (requestPath.charAt(requestPath.length - 1) === '/') {
        requestPath += 'index.html';
    }
    
    fs.readFile(requestPath, function(error, contents) {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404, 'The file or resource you\'re looking for was not found on this server!');
                response.end();
            } else {
                console.log('Error detected!');
                console.log('Details: ' + error);
            }
        } else {
            response.writeHead(200, { 'Content-Type': getContentType(requestPath) });
            response.write(contents);
            if (requestUrl.search) {
                var searchPhrase = requestUrl.search.split('=');
                response.write("<p>Hello, " + searchPhrase[1] + ", this is my page.<p>");
            }
            response.end();
        }
    });
});

server.listen(8080, function() {
    console.log("listening for incoming connections on port 8080...");
});

function getContentType(requestPath) {
    switch (path.extname(requestPath)) {
        case '.html':
            return 'text/html';
            break;
        case '.css':
            return 'text/css';
            break;
        default:
            return 'text/plain';
    }
}