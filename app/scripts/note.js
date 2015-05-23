/**
 * Created by Luzius on 22.05.2015.
 *
 * Defines the Note class.
 */

// Note constructor.
function Note(title, description, importance, due, completed) {
    this.title = title;
    this.description = description;
    this.importance = Number(importance);
    this.due = new Date(due);
    this.completed = Boolean(completed);
}

// Static Note method to create an initial array of notes.
Note.createInitialNotes = function () {
    var notes = [];
    notes.push(new Note("Title1", "Description1", 3, new Date(), false));
    notes.push(new Note("Title2", "Description2", 3, new Date(), false));
    notes.push(new Note("Title3", "Description3", 3, new Date(), false));
    return notes;
};

// Static Note method to read an array of notes from the local storage.
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

    return notes;
};

// Static Note method to write an array of notes to the local storage.
Note.writeNotes = function (notes) {
    var notesString = JSON.stringify(notes);
    localStorage.setItem(Note.constants.notesKey, notesString);
};

// Static  Note method to get a note for a given id.
Note.getNote = function(id) {
    var notes = Note.readNotes();

    if (id >= notes.length) {
        throw "Invalid note id: " + id;
    }

    return notes[id];
}

// Static  Note method to set a note for a given id.
Note.setNote = function(id, note) {
    var notes = Note.readNotes();

    if (id >= notes.length) {
        throw "Invalid note id: " + id;
    }

    notes[id] = note;
    Note.writeNotes(notes);

}


// Constants of the Note class.
Note.constants = {
    notesKey: "notes"
};


function TestNote() {

    localStorage.clear();

    var notes = Note.readNotes();

    if (notes.length === 0) {
        notes = Note.createInitialNotes();
    }

    Note.writeNotes(notes);

    var notes2 = Note.readNotes();

    var n4 = Note.getNote(2);
    n4.title = "test";
    Note.setNote(2, n4);
    var n5 = Note.getNote(2);


}

//TestNote();