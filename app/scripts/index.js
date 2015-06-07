function renderList() {
    var settings = noteSettings.readSettings();


    var noteStorage = noteData.noteStorageSingleton.getInstance();
    var notes = noteStorage.readNotes();
    notes = orderAndFilterNotes(notes, settings);
    $(getMainElement()).empty().html(noteListTemplate(notes));

    // Note completed checkbox event handling.
    $('.completed-checkbox').change(function(event) {

        // Update the note's completed property and store
        // it in the note storage.
        var checkBox = $(event.currentTarget)[0];
        var noteElement =  $(checkBox).parents('.note')[0];
        var id = Number($(noteElement).attr('id'));
        var note = noteStorage.getNote(id);
        note.completed = checkBox.checked;
        noteStorage.updateNote(note);
    });

}

// execute on load
var noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);


function orderAndFilterNotes(notes, settings) {

    if(settings.excludeCompletedNotes) {
        notes = notes.filter(function(note) {
            return !note.completed
        });
    }
    if (settings.orderBy === noteSettings.Settings.orderByDue) {
        notes.sort(function(note1, note2) {
            // Descending.
            return note2.due - note1.due;
        })
    }
    else if(settings.orderBy === noteSettings.Settings.orderByImportance) {
        // Descending.
        notes.sort(function(note1, note2) {return note2.importance - note1.importance})
    }
    return notes;
}

function getMainElement() {
    return document.getElementsByTagName('main')[0];
}

document.getElementById("new-note").onclick = function() {
    window.location.replace('editNote.html')
};

function setNotesOrderBy(orderBy) {
    var settings = noteSettings.readSettings();
    settings.orderBy = orderBy;
    noteSettings.updateSettings(settings);
    renderList();
}

document.getElementById("order-by-due").onclick = function() {
    setNotesOrderBy(noteSettings.Settings.orderByDue);
};

document.getElementById("order-by-importance").onclick = function() {
    setNotesOrderBy(noteSettings.Settings.orderByImportance);
};

function initializeCompletedFilter() {
    var settings = noteSettings.readSettings();
    var checkBox = $('.completed-filter-checkbox')[0];
    checkBox.checked = settings.excludeCompletedNotes;

    $(checkBox).change(function() {
        var settings = noteSettings.readSettings();
        settings.excludeCompletedNotes = checkBox.checked;
        noteSettings.updateSettings(settings);
        renderList();
    });
}

// execute on load
initializeCompletedFilter();
renderList();

