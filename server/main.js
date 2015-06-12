/**
 * Created by rstuder on 11.06.15.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var Router = require('./Router');
var NoteStorage = require('./noteStorage');

var router = new Router();
var notes = new NoteStorage(); // was not able to do this via the singleton, as it does not return a function.


router.newRoute('GET','/notes',function(req,res,params){
    res.statusCode = 200;
    res.end(JSON.stringify(notes.readNotes()));
});

router.newRoute('GET','/notes/:id',function(req,res,params){
    res.statusCode = 200;
    var note = notes.getNote(params['id']);
    res.end(JSON.stringify(note));
});

router.newRoute('POST','/notes', function(req,res,params){
    res.statusCode = 200;
    console.log(req.body);
    var note = notes.updateNote({}); // need to read post data here
    res.end('posted');
});




// wildcard that tries to return files from /app if it does not match any other route
router.newRoute('GET','.*',function(req,res,params){
    var pathname = url.parse(req.url).pathname;
    pathname = "./app" + pathname;
    fs.readFile(pathname,'utf-8',function(err,data){
        if (err) {
            res.statusCode = 404;
            res.end('404 not found');
        }
        res.statusCode = 200;
        res.end(data);
    })
});




var server = http.createServer(router.requestHandler);

server.listen('3000');
console.log('running server on localhost:3000');

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
testRequest('GET', '/notes/1');
testRequest('POST', '/notes');

//Routes to be defined
//GET /notes - Retrieves a list of notes
//GET /notes/12 - Retrieves a specific ticket
//POST /notes - Creates a new ticket
//PUT /notes/12 - Updates ticket #12
//PATCH /notes/12 - Partially updates ticket #12
//DELETE /notes/12 - Deletes ticket #12
//OTHERs should try to serve files