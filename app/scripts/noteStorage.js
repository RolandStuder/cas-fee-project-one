/**
 * Created by Luzius on 29.05.2015.
 */

/**
 * NoteStorage constructor.
 *
 * NoteStorage stores notes in the local storage. Methods are available to read/write all notes and
 * to get and put single note or to create a new note.
 * Note the the notes are identified by their id. NoteStorage assigns new created notes an unique id.
 *
 * @constructor
 */
function NoteStorage() {

    /**
     * Stores an array of notes in the local storage.
     *
     * @param notes {Note[]} The notes to store.
     */
    this.writeNotes = function (notes) {
        var notesString = JSON.stringify(notes);
        localStorage.setItem(notesKey, notesString);
    };

    /**
     * Reads the notes from the local storage.
     *
     * @returns {Note[]} The notes from the local storage.
     */
    this.readNotes = function () {
        var notes = [];
        var notesString = localStorage.getItem(notesKey);
        var notesArray = JSON.parse(notesString);
        if(notesArray != null) {
            notesArray.forEach(function (noteElement) {
                var note = new Note(noteElement.id, noteElement.title, noteElement.description, noteElement.importance, new Date(noteElement.due), noteElement.completed);
                notes.push(note);
            });
        }
        return notes;
    };


    /**
     * Creates a new note with a unique id without putting it into local storage
     *
     * @returns {Note} The new note.
     */
    this.createNewNote = function () {
        var note = new Note(getNextId(), "", "", 3, new Date(), false);
        return note;
    };

    /**
     * Gets the note for an id.
     *
     * @param {number} id The id of the note.
     * @returns {Note} The note for the id.
     */
    this.getNote = function(id) {
        var notes = this.readNotes();
        var note = notes.filter(function(note) {return note.id === id});
        if(note.length === 0) {
            throw "Note not found for id " + id;
        }
        return note[0];
    };

    this.putNote = function(note) {
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
            //if ID does not exist add the new note
            //throw "Note not found for id " + note.id;
        }

        this.writeNotes(notes);
    };

// Private stuff.

    var self = this;

    function hasStore() {
        return localStorage.getItem(notesKey) != null;
    }

    var notesKey = "noteStorage";
    var noteIdKey = "notesStorageNextId";

    function createInitialNotes() {
        for(var iNote = 0; iNote < 3; iNote++) {
            var note = self.createNewNote();
            note.title = "Title" + (iNote + 1);
            note.description = "Description" + (iNote + 1);
            self.putNote(note);
        }
    }

    function getNextId() {
        var nextId = JSON.parse(localStorage.getItem(noteIdKey));
        if (nextId == null) {
            nextId = 1;
        }

        // Store the next nextId.
        localStorage.setItem(noteIdKey, JSON.stringify(nextId+1));
        return nextId;
    }

    // Ensure that some notes are available.
    if (!hasStore()) {
        createInitialNotes();
    }

}

//noinspection JSUnusedGlobalSymbols
/**
 *
 */
function testNoteStorage() {

    localStorage.clear();
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
    //noteStorage.putNote(note);
    //
    //note = noteStorage.getNote(note.id);
}

// testNoteStorage();