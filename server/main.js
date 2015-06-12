/**
 * Created by rstuder on 11.06.15.
 */

var http = require('http');
var Router = require('./Router');

var router = new Router();
console.log (router);

router.newRoute('GET','/notes',function(req,res,params){
    res.statusCode = 200;
    res.end(JSON.stringify(params));
});

router.newRoute('GET','/notes/:id',function(req,res,params){
    res.statusCode = 200;
    res.end(JSON.stringify(params));
});

router.newRoute('GET','.*',function(req,res,params){
    res.statusCode = 200;
    res.end("wildcard route");
});

var server = http.createServer(router.requestHandler);

server.listen('3000');

// some tests

function testRequest(method,path) {
    var options = {
        host: 'localhost',
        port: 3000,
        path: path,
        method: method
    };

    http.get(options,function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log ("Response to", method, path, ':', chunk);
        })
    });
}

testRequest('GET', '/notes');
testRequest('GET', '/notes/45740578');

//Routes to be defined
//GET /notes - Retrieves a list of notes
//GET /notes/12 - Retrieves a specific ticket
//POST /notes - Creates a new ticket
//PUT /notes/12 - Updates ticket #12
//PATCH /notes/12 - Partially updates ticket #12
//DELETE /notes/12 - Deletes ticket #12
//OTHERs should try to serve files