/**
 * The notes list handle bar template.
 */
var noteListTemplate;


function renderList() {
    var settings = noteSettings.getSettings();

    var noteStorage = noteData.noteStorageSingleton.getInstance();
    var notes = noteStorage.readNotes(function (notes) {
        notes = orderAndFilterNotes(notes, settings);
        $(getMainElement()).empty().html(noteListTemplate(notes));

        // Note completed checkbox event handling.
        $('.completed-checkbox').change(function (event) {

            // Update the note's completed property and store
            // it in the note storage.
            var checkBox = $(event.currentTarget)[0];
            var noteElement = $(checkBox).parents('.note')[0];
            var id = Number($(noteElement).attr('id'));
            noteStorage.getNote(id, function (note) {
                note.completed = checkBox.checked;
                noteStorage.updateNote(note, function (note) {
                });

            });
        });
    });

}


function orderAndFilterNotes(notes, settings) {

    if (settings.excludeCompletedNotes) {
        notes = notes.filter(function (note) {
            return !note.completed
        });
    }
    if (settings.orderBy === noteSettings.Settings.orderByDue) {
        notes.sort(function (note1, note2) {
            // Descending.
            return note2.due - note1.due;
        })
    }
    else if (settings.orderBy === noteSettings.Settings.orderByImportance) {
        // Descending.
        notes.sort(function (note1, note2) {
            return note2.importance - note1.importance
        })
    }
    return notes;
}

function getMainElement() {
    return document.getElementsByTagName('main')[0];
}

document.getElementById("new-note").onclick = function () {
    window.location.replace('editNote.html')
};

function setNotesOrderBy(orderBy) {
    var settings = noteSettings.getSettings();
    settings.orderBy = orderBy;
    noteSettings.updateSettings(settings);
    renderList();
}

document.getElementById("order-by-due").onclick = function () {
    setNotesOrderBy(noteSettings.Settings.orderByDue);
};

document.getElementById("order-by-importance").onclick = function () {
    setNotesOrderBy(noteSettings.Settings.orderByImportance);
};

function initializeCompletedFilter() {
    var settings = noteSettings.getSettings();
    var checkBox = $('.completed-filter-checkbox')[0];
    checkBox.checked = settings.excludeCompletedNotes;

    $(checkBox).change(function () {
        var settings = noteSettings.getSettings();
        settings.excludeCompletedNotes = checkBox.checked;
        noteSettings.updateSettings();
        renderList();
    });
}

// execute on load

$(function () {
    noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);
    noteSettings.initializeSettings(function() {
        initializeCompletedFilter();
        renderList();
    });
});
