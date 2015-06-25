var template = {
    render: function () {
        var settings = appSettings.getSettings();
        loadTheme();
        var noteStorage = noteData.noteStorageSingleton.getInstance();
        noteStorage.readNotes(function (notes) {
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
                noteStorage.getNote(id, function (note) {
                    note.completed = checkBox.checked;
                    noteStorage.updateNote(note, function (note) {
                    });

                });
            });
            template.afterRender();
        });
    }
};

function orderAndFilterNotes(notes, settings) {

    //  alert(notes[2].completed)

    if (settings.excludeCompletedNotes) {
        notes = notes.filter(function (note) {
            return !note.completed;
        });
    }
    if (settings.orderBy === appSettings.Settings.orderByDue) {
        notes.sort(function (note1, note2) {
            // Descending.
            return note2.due - note1.due;
        })
    }
    else if (settings.orderBy === appSettings.Settings.orderByCreationDate) {
        notes.sort(function (note1, note2) {
            // Descending.
            return note2.creationDate - note1.creationDate;
        })
    }
    else if (settings.orderBy === appSettings.Settings.orderByImportance) {
        // Descending.
        notes.sort(function (note1, note2) {
            return note2.importance - note1.importance;
        })
    }
    return notes;
}

function getMainElement() {
    return document.getElementsByTagName('main')[0];
}


function setNotesOrderBy(orderBy) {
    var settings = appSettings.getSettings();
    settings.orderBy = orderBy;
    appSettings.updateSettings();
    template.render();
}

function toggleCSS() {
    var settings = appSettings.getSettings();
    if (settings.theme === 'style') {
        settings.theme = 'style2';
    } else {
        settings.theme = 'style';
    }
    appSettings.updateSettings(settings);
    template.render();
}

function initializeCompletedFilter() {
    var settings = appSettings.getSettings();
    var checkBox = $('.completed-filter-checkbox')[0];
    checkBox.checked = settings.excludeCompletedNotes;

    $(checkBox).change(function () {
        var settings = appSettings.getSettings();
        settings.excludeCompletedNotes = checkBox.checked;
        appSettings.updateSettings();
        template.render();
    });
}

var noteListTemplate;
var indexHeaderTemplate;

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
        return new Handlebars.SafeString(Array(importance + 1).join('<i class="fa fa-star"></i>'));
    });

    var isActive = 'is-active';
    var isNotActive = 'is-not-active';

    function getIsActiveClass(orderBy) {
        var settings = appSettings.getSettings();
        if(settings.orderBy == orderBy){
            return isActive;
        }
        else {
            return isNotActive;
        }
    }

    /**
     * Returns the is-active / is-not-active class of the due order by button.
     */
    Handlebars.registerHelper("orderByDueIsActive", function () {
        return getIsActiveClass(appSettings.Settings.orderByDue)
    });

    /**
     * Returns the is-active / is-not-active class of the importance order by button.
     */
    Handlebars.registerHelper("orderByImportanceIsActive", function () {
        return getIsActiveClass(appSettings.Settings.orderByImportance)
    });

    /**
     * Returns the is-active / is-not-active class of the creation date order by button.
     */
    Handlebars.registerHelper("orderByCreationDateIsActive", function () {
        return getIsActiveClass(appSettings.Settings.orderByCreationDate)
    });

    noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);
    indexHeaderTemplate = Handlebars.compile(document.getElementById('indexHeader').innerHTML);

}

function loadTheme(){
    var settings = appSettings.getSettings();
    var themePath = "css/" + settings.theme + ".css";
    var linkThemeCss = $('head link[name="theme"]');
    if (linkThemeCss.attr('href') != themePath) { // only change path, if it is actually different, otherwise flashing occurs on every render
        linkThemeCss.attr('href', themePath)
    }
}

// execute on load

$(function () {

    utilities.alertAjaxErrors();

    appSettings.initializeSettings(function () {
        initializeHandleBars();
        template.render();

        template.afterRender = function () { //callback function in renderPage
            initializeCompletedFilter();

            document.getElementById("new-note").onclick = function () {
                window.location.replace('editNote.html')
            };

            document.getElementById("order-by-due").onclick = function () {
                setNotesOrderBy(appSettings.Settings.orderByDue);
            };

            document.getElementById("order-by-creation-date").onclick = function () {
                setNotesOrderBy(appSettings.Settings.orderByCreationDate);
            };

            document.getElementById("order-by-importance").onclick = function () {
                setNotesOrderBy(appSettings.Settings.orderByImportance);
            };
            $('.header-layout-switcher').on('click',  function() {
                toggleCSS();
            });

        };
    })
});
