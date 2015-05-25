/**
 * Created by Luzius on 22.05.2015.
 *
 * Defines the Note class.
 */

// Note constructor.


/**
 * Note constructor.
 *
 * @param {string} title The title of the note.
 * @param {string} description
 * @param {number} importance
 * @param {Date} due
 * @param {boolean} completed
 * @constructor
 */
function Note(title, description, importance, due, completed) {
    this.title = title;
    this.description = description;
    this.importance = Number(importance);
    this.due = new Date(due);
    this.completed = Boolean(completed);
}

// .

/**
 * Static Note method to create an initial array of notes.
 *
 * @returns {Note[]}
 */
Note.createInitialNotes = function () {
    var notes = [];
    notes.push(new Note("Title1", "Description1", 3, new Date(), false));
    notes.push(new Note("Title2", "Description2", 3, new Date(), false));
    notes.push(new Note("Title3", "Description3", 3, new Date(), false));
    return notes;
};

// Static Note method to read an array of notes from the local storage.

/**
 * Static Note method to read an array of notes from the local storage.
 *
 * @returns {Note[]} The notes from the local storage.
 */
Note.readNotes = function () {
    var notes = [];
    var notesString = localStorage.getItem(Note.constants.notesKey);
    if (notesString != null) {
        var notesArray = JSON.parse(notesString);
        notesArray.forEach(function (noteElement) {
            var note = new Note(noteElement.title, noteElement.description, noteElement.importance, new Date(noteElement.due), noteElement.completed);
            notes.push(note);
        });
    }

    if(notes.length === 0) {
        notes = Note.createInitialNotes();
        Note.writeNotes(notes);
    }

    return notes;
};

/**
 * Method that takes an Note and adds the note to the local storage.
 * @param note {Note} The note to add.
 */
Note.insertNote = function(note) {
    var notes = Note.readNotes();
    notes.push(note);
    Note.writeNotes(notes);
};

/**
 * Static Note method to store an array of notes in the local storage.
 *
 * @param notes {Note[]} The notes to store.
 */
Note.writeNotes = function (notes) {
    var notesString = JSON.stringify(notes);
    localStorage.setItem(Note.constants.notesKey, notesString);
};

//

/**
 * Static Note method to get a note from the local storage for a given id.
 *
 * @param {number} id The id of the note.
 * @returns {Note} The note.
 */
Note.getNote = function(id) {
    var notes = Note.readNotes();

    if (id >= notes.length) {
        throw "Invalid note id: " + id;
    }

    return notes[id];
};

/**
 * Static  Note method to store a note in the local storage for a given id.
 *
 * @param id {number} The id of the note.
 * @param note {Note} The note to store.
 */
Note.setNote = function(id, note) {
    var notes = Note.readNotes();

    if (id >= notes.length) {
        throw "Invalid note id: " + id;
    }

    notes[id] = note;
    Note.writeNotes(notes);

};

/**
 * Constant values of the Note class.
 *
 * @type {{notesKey: string}}
 */
Note.constants = {
    notesKey: "notes"
};

//noinspection JSUnusedGlobalSymbols
/**
 * Tests for the Note class.
 */
function testNote() {

    localStorage.clear();

    var notes = Note.readNotes();

    if (notes.length === 0) {
        notes = Note.createInitialNotes();
    }

    Note.writeNotes(notes);

    //noinspection JSUnusedLocalSymbols
    var notes2 = Note.readNotes();

    var n4 = Note.getNote(2);
    n4.title = "test";
    Note.setNote(2, n4);
    //noinspection JSUnusedLocalSymbols
    var n5 = Note.getNote(2);


}

//testNote();
