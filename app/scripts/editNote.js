/**
 * Created by Luzius on 22.05.2015.
 */

function setNote(note) {

    document.getElementById("title").value = note.title;
    document.getElementById("note-text").value = note.description;
    document.getElementById("due").value = note.due;  // Not working, wrong format.
    document.getElementById("importance-" + note.importance).checked = true;
}


// The note to edit.
var note;

// Workaround: If the current note is not set: Use the first note from the local store.
if(window.currentNote == undefined) {
    var notes = Note.readNotes();
    note = notes[0];
}
else {
    note = window.currentNote;
}


setNote(note);

