var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var queryString = require("querystring");

var commonHeaders = {'Content-Type': 'text/html'};

//Handle HTTP routes GET / and POST / (i.e. Home)
function home(request, response) {  
  if (request.url === "/" ) { //&& GET    
    if (request.method.toLowerCase() === "get") {
      //show search
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      ///if (url == "/" && POST)
      //get the post data from the body
      request.on("data", function(postBody) {
         //extract username
        var query = queryString.parse(postBody.toString());
         //redirect to /:username
        response.writeHead(303, {"Location": "/" + query.username});
        response.end();       
      });
    }
  }
  

}
//Handle HTTP route GET /:username (e.g. /chalkers)
function user(request, response) {
  //if (url == "/.....")
  var username = request.url.replace("/", "");
  if (username.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);
    //get JSON from Treehouse
    var studentProfile = new Profile(username);
    //on "end"    
    studentProfile.on("end", function(profileJSON){
      //show profile
      
      //Store the values we need
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      //Simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    
    //on "error"
    studentProfile.on("error", function(error){
      //show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });

  }
}

module.exports.home = home;
module.exports.user = user;
