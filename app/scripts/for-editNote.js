/**
 * Created by Luzius on 22.05.2015.
 */

/**
 * Sets the note input fields from a Note instance.
 *
 * @param {Note} note The source note.
 */
function displayNoteDataInForm(note) {

    $(titleElement()).val(note.title);
    $(descriptionElement()).val(note.description);

    if(hasInputType("date")) {
        // Chrome, format the date as YYYY-MM-DD
        $(dueElement()).val(
            note.due.getFullYear() + "-" +
            utilities.padLeft(String((note.due.getMonth() + 1)), 2, "0") + "-" +
            utilities.padLeft(String(note.due.getDate()), 2, "0"));
    }
    else {
        // Date is not supported, format the date as DD.MM.YYYY
        $(dueElement()).val(
            utilities.padLeft(String(note.due.getDate()), 2, "0") + "." +
            utilities.padLeft(String((note.due.getMonth() + 1)), 2, "0") + "." +
            note.due.getFullYear());
    }

    $('#importance-' + note.importance).prop('checked', true);
}

/**
 * Checks if the browser supports an input type.
 *
 * @param type {string}
 * @returns {boolean} true is the input type is supported, false if not.
 */
function hasInputType(type) {
    var input = document.createElement("input");
    input.setAttribute("type", type);
    return input.type == type;
}


/**
 * Stores the note input fields in a Note instance.
 *
 * @param {Note} note - The destination note.
 */
function getNote(note) {
    note.title = $(titleElement()).val();
    note.description = $(descriptionElement()).val();
    note.due = parseDateString($(dueElement()).val());
    note.importance = Number($('input[name="importance"]:checked').val());
}

function titleElement() {
    return $("#title");
}
function descriptionElement() {
    return $("#note-text");
}
function dueElement() {
    return $("#due");
}



/**
 * Parses a date string of format YYYY-MM-DD or DD.MM.YYYY
 *
 * @param {string} dateString The string to parse.
 * @returns {Date} The parsed date or null if the date string is invalid.
 */
function parseDateString(dateString) {

    // This works if dateString is YYYY-MM-DD (Chrome!)
    var date = new Date(dateString);

    if (isNaN(date.getTime())) {
        // Browser does not know the date tag => parse the input manually.
        // Expected format: DD.MM.YYYY
        var dateElements = dateString.split('.');
        if (dateElements.length === 3) {
            date = new Date();
            date.setFullYear(dateElements[2]);
            date.setMonth(dateElements[1] - 1);
            date.setDate(dateElements[0]);
            if(date.getFullYear() != dateElements[2] || date.getMonth() != dateElements[1] -1 || date.getDate() != dateElements[0])
            {
                date = null;
            }
        }
        else {
            date = null;
        }
    }
    return date;
}

/**
 * Validates the inputs.
 *
 * @returns {boolean} true if valid, false if invalid.
 */
function validate() {
    if ($(titleElement()).val() === "") {
        $('#title-error').html("Titel muss eingegeben werden");
        titleElement().focus();
        return false;
    }

    var dateString = $(dueElement()).val();
    if (parseDateString(dateString) == null) {
        $('#date-error').html("Ungültiges Datum. Erwartetes Format: dd.mm.jjjj, z.B. 23.11.2014");
        dueElement().val("dd.mm.jjjj");
        dueElement().focus();
        return false;
    }

    return true;

}


/**
 * Page initialization.
 */
function initialize() {


    // Command intialization (uses handlebar).

    function initializeCommands() {

        // The available commands.
        var commands = [
            {'commandId' : 'save', type: 'submit', 'caption' : 'Speichern', click : save, class: 'primary-action'},
            {'commandId' : 'cancel', type: 'button', 'caption' : 'Abbruch', click : backToStartPage, class: 'secondary-action'}
        ];

        // Set the commands html with handle bar.
        var commandsTemplateText = $('#commands-template').html();
        var createCommandsHtml = Handlebars.compile(commandsTemplateText);
        $('.commands').html(createCommandsHtml(commands));

        // Assign the event handlers.
        commands.forEach(function(command) {
            $('#' + command.commandId).on('click', command.click);
        });
        $('form').submit(function(){save()});
    }

    function enableFloatingLabels() {
        var targets = $($('input').add('textarea'));
        targets.each(function(){
            if (this.value.length > 0)
                $('[for='+this.id+']').addClass('is-floated');
        });
        targets.on('focus', function(){
            $('[for='+this.id+']').addClass('is-floated');
        });
        targets.on('blur', function() {
            if (this.value.length === 0) $('[for='+this.id+']').removeClass('is-floated');
        });
    }


    var noteStorage = noteData.noteStorageSingleton.getInstance();

    var parameters = utilities.getParametersFromQueryString(window.location.search);

    var note;

    function noteAvailable(noteFromStorage) {
        note = noteFromStorage;
        displayNoteDataInForm(note);
        enableFloatingLabels();
    }

    if ('id' in parameters) {
        noteStorage.getNote(Number(parameters.id), noteAvailable);
    }
    else {
        noteStorage.newNote(noteAvailable);
    }

    appSettings.initializeSettings(function(){
        themeSwitcher.loadTheme('style2');
        $('.header-layout-switcher').on('click',function(){
            themeSwitcher.toggleTheme()
        });
    });
    initializeCommands();

    // Button event handlers.
    function backToStartPage() {
        window.location.replace('index.html');
    }

    function save (event) {
        event.preventDefault();
        if (validate()) {
            getNote(note);
            noteStorage.updateNote(note, function(note){});
            backToStartPage();
        }
    }
}

$(function () {
        try {

            // Initialize ajax.
            utilities.initializeAjax();

            // Initialize page.
            initialize();


        }
        catch (exception) {
            console.error(exception);
            alert('Es ist ein Fehler aufgetreten:\n' + exception.toString());
        }
    }
);