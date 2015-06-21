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
     * @param {string} description The description of the note.
     * @param {number} importance The importance level of the note (1-5).
     * @param {Date} due The due date of the note.
     * @param {boolean} completed Indicates if the note has been completed.
     * @param {Date} creationDate The creation date of the note.
     * @constructor
     */
    function Note(id, title, description, importance, due, completed, creationDate) {
        this.title = title;
        this.description = description;
        this.importance = Number(importance);
        this.due = new Date(due);
        this.completed = Boolean(completed);
        this.id = Number(id);
        this.creationDate = new Date(creationDate);
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
        $.ajaxSetup({
            // Disable caching of AJAX responses.
            cache: false
        });


    }

    /**
     * Converts a JSON notes string to an array of instances of the Note class.
     *
     * @param {string} notesString  The string to convert.
     */
    function notesStringToNotes(notesString) {
        var notes = [];
        var notesArray = JSON.parse(notesString);
        if (notesArray != null) {
            notesArray.forEach(function (noteObject) {
                // Convert the noteObject to an instance of the class Note.
                var note = new Note(
                    noteObject.id,
                    noteObject.title,
                    noteObject.description,
                    noteObject.importance,
                    new Date(noteObject.due),
                    noteObject.completed,
                    new Date(noteObject.creationDate));

                notes.push(note);
            });
        }
        return notes;
    }

    /**
     * Converts a JSON note string to an instance of the Note class.
     *
     * @param {string} noteString
     */
    function noteStringToNote(noteString) {
        var noteObject = JSON.parse(noteString);
        return new Note(
            noteObject.id,
            noteObject.title,
            noteObject.description,
            noteObject.importance,
            new Date(noteObject.due),
            noteObject.completed,
            new Date(noteObject.creationDate));
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

        $.get('http://localhost:3000/notes', function (data, status) {
            if (typeof notesCallback != 'undefined') {
                var notes = notesStringToNotes(data);
                notesCallback(notes);
            }
            else {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
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

        $.get('http://localhost:3000/notes/' + id, function (data, status) {
            if (typeof noteCallback != 'undefined') {
                var note = noteStringToNote(data);
                noteCallback(note);
            }
            else {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
    };

    /**
     * @callback doneCallback A simple callback without parameter that indicates that a async function has completed.
     */


    /**
     * Updates an existing note.
     *
     * @param {Note}  note   The note to update.
     * @param {doneCallback} doneCallback Called when the note is updated.
     */
    NoteStorage.prototype.updateNote = function (note, doneCallback) {
        var noteString = JSON.stringify(note);

        $.ajax({
                url: 'http://localhost:3000/notes/' + note.id,
                type: 'PUT',
                data: noteString,
                success: function (data, textStatus, jqXHR) {
                    if (typeof doneCallback != 'undefined') {
                        doneCallback();
                    }
                }
            }
        );
    };

    /**
     * Creates a new note with a unique id.
     *
     * @param {noteCallback} noteCallback The callback function that is called when the new note is created.
     */
    NoteStorage.prototype.createNote = function (noteCallback) {
        $.post('http://localhost:3000/notes', function (data, status) {
            if (typeof noteCallback != 'undefined') {
                var note = noteStringToNote(data);
                noteCallback(note);
            }
            else {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
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
        /**
         * The note storage singleton.
         */
        noteStorageSingleton: noteStorageSingleton,

        /**
         * The Note Class.
         */
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