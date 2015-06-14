var template = {
    render: function () {
        var settings = noteSettings.getSettings();
        if (settings.orderBy === 'due') {settings.due = true} else { settings.due = false };
        if (settings.orderBy === 'importance') {settings.importance = true} else { settings.importance = false };

        var noteStorage = noteData.noteStorageSingleton.getInstance();
        var notes = noteStorage.readNotes(function(notes) {
            notes = orderAndFilterNotes(notes, settings);
            $('header').empty().html(indexHeaderTemplate(settings));
            $(getMainElement()).empty().html(noteListTemplate(notes));

            // Note completed checkbox event handling.
            $('.completed-checkbox').change(function (event) {

                // Update the note's completed property and store
                // it in the note storage.
                var checkBox = $(event.currentTarget)[0];
                var noteElement = $(checkBox).parents('.note')[0];
                var id = Number($(noteElement).attr('id'));
                noteStorage.getNote(id, function(note) {
                    note.completed = checkBox.checked;
                    noteStorage.updateNote(note, function(note) {});

                });
            });
            template.afterRender();
        });
    }
};

function orderAndFilterNotes(notes, settings) {

  //  alert(notes[2].completed)

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



function setNotesOrderBy(orderBy) {
    var settings = noteSettings.getSettings();
    settings.orderBy = orderBy;
    noteSettings.updateSettings();
    template.render();
}

function initializeCompletedFilter() {
    var settings = noteSettings.getSettings();
    var checkBox = $('.completed-filter-checkbox')[0];
    checkBox.checked = settings.excludeCompletedNotes;

    $(checkBox).change(function() {
        var settings = noteSettings.getSettings();
        settings.excludeCompletedNotes = checkBox.checked;
        noteSettings.updateSettings();
        template.render();
    });
}

/**
 * Initializes Handelbars stuff.
 */
function initializeHandleBars() {

    /**
     *  The date formatter.
     */
    Handlebars.registerHelper("formatDate", function (date) {
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    });

    /**
     *  The importance formatter. Converts the importance number to stars.
     */
    Handlebars.registerHelper("formatImportance", function (importance) {
        return Array(importance + 1).join('*' /*String.fromCharCode(0x26A1)*/);
    });
    
    var noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);
    var indexHeaderTemplate = Handlebars.compile(document.getElementById('indexHeader').innerHTML);

}

// execute on load
noteSettings.initializeSettings(function() {
    initializeHandleBars();
    template.render();

    template.afterRender = function() { //callback function in renderPAge

        initializeCompletedFilter();

        document.getElementById("new-note").onclick = function () {
            window.location.replace('editNote.html')
        };
        document.getElementById("order-by-due").onclick = function () {
            setNotesOrderBy(noteSettings.Settings.orderByDue);
        };

        document.getElementById("order-by-importance").onclick = function () {
            setNotesOrderBy(noteSettings.Settings.orderByImportance);
        };
    };

});
