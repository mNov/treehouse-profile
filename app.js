var router = require("./router.js");
//Problem: Need a simple way to look at a user's badge count & JS points from a web browser
//Solution: Use Node.js to perform the profile lookups and serve the templates via HTTP

//Create a web server

var http = require('http');
http.createServer(function (request, response) {
  router.home(request, response);
  router.user(request, response);
}).listen(3000);
console.log('Server running at localhost:3000');
