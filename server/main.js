/**
 * Created by rstuder on 11.06.15.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var Router = require('./Router');
var noteData = require('./noteStorage');
var noteSettings = require('./noteSettings');

var router = new Router();
var notes = new noteData.NoteStorage(); // was not able to do this via the singleton, as it does not return a function.


router.newRoute('GET', '/notes', function (req, res, params) {
    res.statusCode = 200;
//    res.setHeader('cache-control', 'no-cache')
    res.end(JSON.stringify(notes.readNotes()));
});

router.newRoute('GET', '/notes/:id', function (req, res, params) {
    res.statusCode = 200;
    var note = notes.getNote(params['id']);
    res.end(JSON.stringify(note));
});


/**
 * Creates a new note.
 */
router.newRoute('POST', '/notes', function (req, res, params) {
    res.statusCode = 200;
//    console.log(req.body);
    var note = notes.createNote(); // need to read post data here
    res.end(JSON.stringify(note));
});

router.newRoute('POST', '/notes/:id', function (req, res, params) {
    res.statusCode = 200;
    var body = '';
    req.on('data', function(data) {body += data.toString()});
    req.on('end', function() {
//        console.log(body);
        notes.updateNote(noteData.stringToNote(body));
        res.end("updated");

    });
});


/**
 * Gets the notes settings.
 */
router.newRoute('GET', '/settings', function (req, res, params) {
    res.statusCode = 200;
//    res.setHeader('cache-control', 'no-cache')
    res.end(JSON.stringify(noteSettings.readSettings()));
});

/**
 * Puts the notes settings
 */
router.newRoute('POST', '/settings', function (req, res, params) {
    res.statusCode = 200;
    var body = '';
    req.on('data', function(data) {body += data.toString()});
    req.on('end', function() {
        noteSettings.updateSettings(JSON.parse(body));
        res.end("updated");
    });
});


// wildcard that tries to return files from /app if it does not match any other route
router.newRoute('GET', '.*', function (req, res, params) {
    if(req == undefined) {
        var b = 1;
    }
    var pathname = url.parse(req.url).pathname;
    if(pathname === '/') {
        pathname = '/index.html'
    }
    pathname = "../app" + pathname;
//    console.log(pathname);
    fs.readFile(pathname, 'utf-8', function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.end('404 not found');
        }
        res.statusCode = 200;

        var extension = path.extname(pathname);
        if( extension === '.css') {
            res.setHeader("Content-Type", 'text/css');
        }
        else if(extension === '.js') {
            res.setHeader("Content-Type", 'text/javascript');

        }
        res.end(data);
    })
});


var server = http.createServer(router.requestHandler);

server.listen('3000');
console.log('running server on localhost:3000');

// some tests

function testRequest(method, path, postData) {
    var options = {
        host: 'localhost',
        port: 3000,
        path: path,
        method: method
    };


    if (method === 'GET') {
        http.get(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log("Response to", method, path, ':', chunk);
            })
        });
    }
    else {
        var request = http.request(options, function (response) {
            //When we receive data, we want to store it in a string
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            //On end of the request, run what we need to
            response.on('end', function () {
                //Do Something with the data
                console.log(body);
            });
        });

        if (postData != undefined) {
            request.write(JSON.stringify(postData));
        }
        request.end();
    }
}

testRequest('GET', '/settings');
//testRequest('POST', '/settings', new noteSettings.Settings(noteSettings.Settings.orderByDue, true));

//testRequest('GET', '/notes');
//testRequest('GET', '/notes/1');
//testRequest('POST', '/notes');
//testRequest('POST', '/notes/1', new noteData.Note(1,"","",3,new Date(), false));

//Routes to be defined
//GET /notes - Retrieves a list of notes
//GET /notes/12 - Retrieves a specific ticket
//POST /notes - Creates a new ticket
//PUT /notes/12 - Updates ticket #12
//PATCH /notes/12 - Partially updates ticket #12
//DELETE /notes/12 - Deletes ticket #12
//OTHERs should try to serve files