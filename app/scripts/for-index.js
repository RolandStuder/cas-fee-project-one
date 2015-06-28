(function(){
    var template = {
        render: function () {
            var settings = appSettings.getSettings();
            var noteStorage = noteData.noteStorageSingleton.getInstance();
            noteStorage.readNotes(function (notes) {
                notes = orderAndFilterNotes(notes, settings);
                $('header').empty().html(indexHeaderTemplate(settings));
                $(getMainElement()).empty().html(noteListTemplate({notes: notes, settings: settings}));
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
            notes.reverse(); // reversing array here to create consistency in display between duedate and creation date. Otherwise later created notes with same duedate are displayed reversed.
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

    function toggleExcludeCompletedNotes(){
        var settings = appSettings.getSettings();
        settings.excludeCompletedNotes = !settings.excludeCompletedNotes;
        appSettings.updateSettings();
        template.render();
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

    function attachEventHandlers(){

        var noteStorage = noteData.noteStorageSingleton.getInstance();

        $("#new-note").on('click',function () {
            window.location.replace('editNote.html')
        });

        $("[data-action='order']").on('click', function(){
            var orderBy = $(this).attr('data-order-by');
            setNotesOrderBy(orderBy);
        });

        $("[data-action='exclude-completed-notes']").on('click', function(){
            toggleExcludeCompletedNotes();
        });

        $('.note-completion').on('click', function (event) {
            // Update the note's completed property and store
            // it in the note storage.
            var noteElement = $(this).parents('.note')[0];
            var id = Number($(noteElement).attr('id'));
            noteStorage.getNote(id, function (note) {
                note.completed = !note.completed;
                noteStorage.updateNote(note, function (note) {
                });
                template.render();
            });
        });


        $('.header-layout-switcher').on('click',  function() {
            themeSwitcher.toggleTheme();
        });
    }

    // execute on load
    $(function () {
        utilities.alertAjaxErrors();
        appSettings.initializeSettings(function () {
            themeSwitcher.loadTheme();
            initializeHandleBars();
            template.render();
            template.afterRender = function () { //callback function in renderPage
                attachEventHandlers();
            };
        })
    });
})();