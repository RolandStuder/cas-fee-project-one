/**
 * Created by Luzius on 29.05.2015.
 */

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
 * Reads the notes from the local storage.
 *
 * @returns {Note[]} The notes from the local storage.
 */
NoteStorage.prototype.readNotes = function () {
    var notes = [];
    var notesString = localStorage.getItem(this.notesKey);
    var notesArray = JSON.parse(notesString);
    if(notesArray != null) {
        notesArray.forEach(function (noteObject) {
            //noteObject.__proto__ = Note.prototype;
            //noteObject.log();

            // Convert the noteObject to an instance of the class Note.
            var note = new Note(noteObject.id, noteObject.title, noteObject.description, noteObject.importance, new Date(noteObject.due), noteObject.completed);
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
NoteStorage.prototype.getNote = function(id) {
    var notes = this.readNotes();
    var note = notes.filter(function(note) {return note.id === id});
    if(note.length === 0) {
        throw "Note not found for id " + id;
    }
    return note[0];
};



/**
 * Updates an existing note.
 *
 * @param {Note}  note   The note to update.
 */
NoteStorage.prototype.updateNote = function(note) {
    var noteFound = false;
    var notes = this.readNotes();
    for(var iNote = 0; iNote < notes.length; iNote++) {
        if(notes[iNote].id === note.id) {
            notes[iNote] = note;
            noteFound = true;
            break;
        }
    }

    if(!noteFound) {
        notes.push(note);
    }

    this.writeNotes(notes);
};

/**
 * Creates a new note with a unique id.
 *
 * @returns {Note} The new note.
 */
NoteStorage.prototype.createNote = function() {

    var self = this;

    function getNextId () {
        var nextId = JSON.parse(localStorage.getItem(self.noteIdKey));
        if (nextId == null) {
            nextId = 1;
        }

        // Store the next nextId.
        localStorage.setItem(self.noteIdKey, JSON.stringify(nextId+1));
        return nextId;
    }

    var note = new Note(getNextId(), "", "", 3, new Date(), false);
    return note;
};

NoteStorage.prototype.constructor = NoteStorage;


// Play with a derived class NoteStorageExt.

function NoteStorageExt() {
    NoteStorage.call(this);
}

NoteStorageExt.prototype = Object.create(NoteStorage.prototype);
NoteStorageExt.prototype.constructor = NoteStorageExt;


//noinspection JSUnusedGlobalSymbols
/**
 *
 */
function testNoteStorage() {

    //  localStorage.clear();

    var ns = new NoteStorage();

    var nsExt = new NoteStorageExt();

    var nts = nsExt.readNotes();

    var t = nsExt instanceof NoteStorage;

//    localStorage.clear();
    //var note2 = new Note();
    //console.log(note2.title);
    //
    //var noteStorage = new NoteStorage();
    //
    //var notes = noteStorage.readNotes();
    //
    //
    //var note = notes[0];
    //
    //note.title = "My title";
    //noteStorage.updateNote(note);
    //
    //note = noteStorage.getNote(note.id);
}

//testNoteStorage();