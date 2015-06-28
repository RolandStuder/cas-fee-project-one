/**
 * Created by rstuder on 11.06.15.
 */

var http = require('http');
var Router = require('./Router');
var noteData = require('./noteStorage');
var noteSettings = require('./appSettings');
var Storage = require('./keyValueStorage');


var router = new Router();
var notes = new noteData.NoteStorage();

router.newRoute('GET', '/notes', function (req, res, params) {
    res.statusCode = 200;
    res.end(JSON.stringify(notes.readNotes()));
});

/**
 * Creates a new without writing it to the database.
 */
router.newRoute('GET', '/notes/new', function (req, res, params) {
    res.statusCode = 200;
    var note = notes.newNote();
    res.end(JSON.stringify(note));
});

router.newRoute('GET', '/notes/:id', function (req, res, params) {
    res.statusCode = 200;
    var note = notes.getNote(params['id']);
    res.end(JSON.stringify(note));
});

router.newRoute('POST', '/notes', function (req, res, params) {
    res.statusCode = 200;
    var body = '';
    req.on('data', function (data) {
        body += data.toString()
    });
    req.on('end', function () {
        var newNote = notes.newNote();
        var postedNote = JSON.parse(noteData.stringToNote(body));
        newNote.initializeFromNote(postedNote);
        notes.updateNote(newNote);
        res.end("updated");
    });
});


/**
 * Updates a note, also used to put new notes
 */
router.newRoute('PUT', '/notes/:id', function (req, res, params) {
    res.statusCode = 200;
    var body = '';
    req.on('data', function (data) {
        body += data.toString()
    });
    req.on('end', function () {
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
 * Updates the notes settings
 */
router.newRoute('PUT', '/settings', function (req, res, params) {
    res.statusCode = 200;
    var body = '';
    req.on('data', function (data) {
        body += data.toString()
    });
    req.on('end', function () {
        noteSettings.updateSettings(JSON.parse(body));
        res.end("updated");
    });
});

// wildcard that tries to return files from /app if it does not match any other route
router.newRoute('GET', '.*', router.static);


var server = http.createServer(router.requestHandler);

// initialize dbs on startup
new Storage('noteStorage');
new Storage('appSettings');

server.listen('3000');
console.log('running server on localhost:3000');