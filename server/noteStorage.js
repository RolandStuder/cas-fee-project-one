/**
 * Created by Luzius on 29.05.2015.
 */

var Storage = require('./keyValueStorage');
var storage = new Storage('noteStorage');

/**
 * Note data module. Exposes the note storage singleton (to read and write notes) and the note Class (to store notes).
 * @type {{noteStorageSingleton, Note}}
 */
var noteData = (function () {
    "use strict";

    /**
     * Note constructor.
     *
     * Notice: I am not sure if server and app should should share the note class definition.
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
        if(typeof creationDate == 'undefined') {
         // Legacy note without creation date => use due.
            this.creationDate = new Date(due);
        }
        else {
            this.creationDate = new Date(creationDate);
        }
    }

    Note.prototype.constructor = Note;


    /**
     * Converts a JSON note string to an instance of the Note class.
     *
     * @param (string) noteString
     */
    function stringToNote(noteString) {
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

        this.notesKey = "noteStorage";
        this.noteIdKey = "notesStorageNextId";

    }


    /**
     * Stores an array of notes in the local storage.
     *
     * @param notes {Note[]} The notes to store.
     */
    NoteStorage.prototype.writeNotes = function (notes) {
        var notesString = JSON.stringify(notes);
        storage.setItem(this.notesKey, notesString);
    };

    /**
     * Reads the notes from the local storage.
     *
     * @returns {Note[]} The notes from the local storage.
     */
    NoteStorage.prototype.readNotes = function () {
        var notes = [];
        var notesString = storage.getItem(this.notesKey);
        if (notesString != undefined) {
            var notesArray = JSON.parse(notesString);
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
    };

    /**
     * Gets the note for an id.
     *
     * @param {number} id The id of the note.
     * @returns {Note} The note for the id.
     */
    NoteStorage.prototype.getNote = function (id) {
        var notes = this.readNotes();
        var note = notes.filter(function (note) {
            return note.id === Number(id)
        });
        if (note.length === 0) {
            throw "Note not found for id " + id;
        }
        return note[0];
    };


    /**
     * Updates an existing note.
     *
     * @param {Note}  note   The note to update.
     */
    NoteStorage.prototype.updateNote = function (note) {
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
    };

    /**
     * Creates a new note with a unique id.
     *
     * @returns {Note} The new note.
     */
    NoteStorage.prototype.createNote = function () {

        function getNextId() {
            var nextId = 1;
            var nextIdString = storage.getItem(self.noteIdKey);
            if(nextIdString != undefined) {
                nextId = JSON.parse(nextIdString);
            }

            // Store the next nextId.
            storage.setItem(self.noteIdKey, JSON.stringify(nextId + 1));
            return nextId;
        }

        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);

        var note = new Note(getNextId(), "", "", 3, tomorrow, false, today);
        return note;
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
        NoteStorage: NoteStorage,
        Note: Note,
        stringToNote: stringToNote
    }
}());

module.exports = noteData;


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
//    //  storage.clear();
//
//    var ns = new NoteStorage();
//
//    var nsExt = new NoteStorageExt();
//
//    var nts = nsExt.readNotes();
//
//    var t = nsExt instanceof NoteStorage;
//
////    storage.clear();
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