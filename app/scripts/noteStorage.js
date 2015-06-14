/**
 * Created by Luzius on 29.05.2015.
 */


/**
 * Note data module. Exposes the note storage singleton (to read and write notes) and the note Class (to store notes).
 * @type {{noteStorageSingleton, Note}}
 */
var noteData = (function () {
    "use strict";

    /**
     * Note constructor.
     *
     * @param {number} id The id of the note.
     * @param {string} title The title of the note.
     * @param {string} description
     * @param {number} importance
     * @param {Date} due
     * @param {boolean} completed
     * @constructor
     */
    function Note(id, title, description, importance, due, completed) {
        this.title = title;
        this.description = description;
        this.importance = Number(importance);
        this.due = new Date(due);
        this.completed = Boolean(completed);
        this.id = Number(id);
    }

    Note.prototype.constructor = Note;

    /**
     * NoteStorage constructor.
     *
     * NoteStorage stores notes in the local storage. Methods are available to read/write all notes and
     * to get and put single note or to create a new note.
     * Note that the notes are identified by their id. NoteStorage assigns an unique id to new created notes.
     *
     * @constructor
     */
    function NoteStorage() {


// Private stuff.

        // I would like to have this private, but I don't know how ...
        this.notesKey = "noteStorage";
        this.noteIdKey = "notesStorageNextId";

        this.useLocalStorage = false;
        $.ajaxSetup({
            // Disable caching of AJAX responses.
            cache: false
        });


    }

    /**
     * Stores an array of notes in the local storage.
     *
     * @param notes {Note[]} The notes to store.
     */
    NoteStorage.prototype.writeNotes = function (notes) {
        var notesString = JSON.stringify(notes);
        localStorage.setItem(this.notesKey, notesString);
    };

    /**
     * Converts a JSON notes string to an array of instances of the Note class.
     *
     * @param (string) notesString
     */
    function notesStringToNotes(notesString) {
        var notes = [];
        var notesArray = JSON.parse(notesString);
        if (notesArray != null) {
            notesArray.forEach(function (noteObject) {
                //noteObject.__proto__ = Note.prototype;
                //noteObject.log();

                // Convert the noteObject to an instance of the class Note.
                var note = new Note(noteObject.id, noteObject.title, noteObject.description, noteObject.importance, new Date(noteObject.due), noteObject.completed);
                notes.push(note);
            });
        }
        return notes;
    }

    /**
     * Converts a JSON note string to an instance of the Note class.
     *
     * @param (string) noteString
     */
    function noteStringToNote(noteString) {
        var noteObject = JSON.parse(noteString);
        return new Note(noteObject.id, noteObject.title, noteObject.description, noteObject.importance, new Date(noteObject.due), noteObject.completed);
    }

    /**
     * @callback notesCallback The function that is called when notes are read from the storage.
     * @param  {Note[]} notes The notes from the storage.
     */

    /**
     * Reads the notes from the local storage.
     *
     * @param {notesCallback} notesCallback The callback function that is called when the notes are read.
     */
    NoteStorage.prototype.readNotes = function (notesCallback) {

        if (this.useLocalStorage) {
            var notesString = localStorage.getItem(this.notesKey);
            var notes = notesStringToNotes(notesString);
            notesCallback(notes);
        }
        else {
            $.get('http://localhost:3000/notes', function (data, status) {
                if (notesCallback != undefined) {
                    var notes = notesStringToNotes(data);
                    notesCallback(notes);
                }
                else {
                    alert("Data: " + data + "\nStatus: " + status);
                }
            });
        }
    };

    /**
     * @callback noteCallback The function that is called when notes are read from the storage.
     * @param  {Note} note The note from the storage.
     */

    /**
     * Gets the note for an id.
     *
     * @param {number} id The id of the note.
     * @param {noteCallback} noteCallback The callback function that is called when the notes are read.
     */
    NoteStorage.prototype.getNote = function (id, noteCallback) {

        if(this.useLocalStorage) {
            var notes = this.readNotes();
            var note = notes.filter(function (note) {
                return note.id === id
            });
            if (note.length === 0) {
                throw "Note not found for id " + id;
            }
            noteCallback(note[0]);
        }
        else {
            $.get('http://localhost:3000/notes/' + id, function (data, status) {
                if (noteCallback != undefined) {
                    var note = noteStringToNote(data);
                    noteCallback(note);
                }
                else {
                    alert("Data: " + data + "\nStatus: " + status);
                }
            });
        }
    };


    /**
     * Updates an existing note.
     *
     * @param {Note}  note   The note to update.
     */
    NoteStorage.prototype.updateNote = function (note, noteCallback) {
        if(this.useLocalStorage) {
            var noteFound = false;
            var notes = this.readNotes();
            for (var iNote = 0; iNote < notes.length; iNote++) {
                if (notes[iNote].id === note.id) {
                    notes[iNote] = note;
                    noteFound = true;
                    break;
                }
            }

            if (!noteFound) {
                notes.push(note);
            }

            this.writeNotes(notes);
        }
        else {
            var noteString = JSON.stringify(note);

            $.post('http://localhost:3000/notes/' + note.id, noteString, function (data, status) {
                if (noteCallback != undefined) {
                    console.log("Data: " + data + "\nStatus: " + status);

                    noteCallback();
                }
                else {
                    alert("Data: " + data + "\nStatus: " + status);
                }
            });
        }
    };

    /**
     * Creates a new note with a unique id.
     *
     * @param {noteCallback} noteCallback The callback function that is called when the notes the new note is created.
     */
    NoteStorage.prototype.createNote = function (noteCallback) {
        function getNextId() {
            var nextId = JSON.parse(localStorage.getItem(this.noteIdKey));
            if (nextId == null) {
                nextId = 1;
            }

            // Store the next nextId.
            localStorage.setItem(this.noteIdKey, JSON.stringify(nextId + 1));
            return nextId;
        }
        if(this.useLocalStorage) {

            var note = new Note(getNextId(), "", "", 3, new Date(), false);
            noteCallback(note);
        }
        else {
            $.post('http://localhost:3000/notes', function (data, status) {
                if (noteCallback != undefined) {
                    var note = noteStringToNote(data);
                    noteCallback(note);
                }
                else {
                    alert("Data: " + data + "\nStatus: " + status);
                }
            });
        }
    };

    NoteStorage.prototype.constructor = NoteStorage;


    /**
     *  @return The note storage singleton.
     */
    var noteStorageSingleton = (new function () {
        var noteStorage;

        function init() {
            noteStorage = new NoteStorage();
            return noteStorage;
        }

        return {
            getInstance: function () {
                if (!noteStorage) {
                    noteStorage = init();
                }
                return noteStorage;
            }
        }
    }());

    return {
        noteStorageSingleton: noteStorageSingleton,
        Note: Note
    }
}());


//// Play with a derived class NoteStorageExt.
//
//function NoteStorageExt() {
//    NoteStorage.call(this);
//}
//
//NoteStorageExt.prototype = Object.create(NoteStorage.prototype);
//NoteStorageExt.prototype.constructor = NoteStorageExt;
//
//
////noinspection JSUnusedGlobalSymbols
///**
// *
// */
//function testNoteStorage() {
//
//    //  localStorage.clear();
//
//    var ns = new NoteStorage();
//
//    var nsExt = new NoteStorageExt();
//
//    var nts = nsExt.readNotes();
//
//    var t = nsExt instanceof NoteStorage;
//
////    localStorage.clear();
//    //var note2 = new Note();
//    //console.log(note2.title);
//    //
//    //var noteStorage = new NoteStorage();
//    //
//    //var notes = noteStorage.readNotes();
//    //
//    //
//    //var note = notes[0];
//    //
//    //note.title = "My title";
//    //noteStorage.updateNote(note);
//    //
//    //note = noteStorage.getNote(note.id);
//}

//testNoteStorage();