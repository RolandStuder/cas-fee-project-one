/**
 * Created by Luzius on 22.05.2015.
 */

/**
 * Sets the note input fields from a Note instance.
 *
 * @param {Note} note The source note.
 */
function setNote(note) {

    $(titleElement()).val(note.title);
    $(descriptionElement()).val(note.description);

    if(hasInputType("date")) {
        // Chrome, format the date as YYYY-MM-DD
        $(dueElement()).val(
            note.due.getFullYear() + "-" +
            padLeft(String((note.due.getMonth() + 1)), 2, "0") + "-" +
            padLeft(String(note.due.getDate()), 2, "0"));
    }
    else {
        // Date is not supported, format the date as DD.MM.YYYY
        $(dueElement()).val(
            padLeft(String(note.due.getDate()), 2, "0") + "." +
            padLeft(String((note.due.getMonth() + 1)), 2, "0") + "." +
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
 * Left string padding.
 *
 * @param {string} toPad The string to pad.
 * @param {number} targetLength The final length of padded string.
 * @param {string} padChar The char to pad with.
 *
 */
function padLeft(toPad, targetLength, padChar) {
    var result = toPad.toString();
    while (result.length < targetLength) {
        result = padChar + result;
    }
    return result;
}

/**
 * Parses a date string of format YYYY-MM-DD or DD.MM.YYYY
 *
 * @param {string} dateString The string to parse.
 * @returns {Date} The parsed date or null if the date string is invalid.
 */
function parseDateString(dateString) {
    var date = new Date(dateString);

    if (isNaN(date.getTime())) {
        // Browser does not know the date tag => parse the input manually.
        var dateElements = dateString.split('.');
        if (dateElements.length === 3) {
            date = new Date(dateElements[2], dateElements[1] - 1, dateElements[0]);
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
            {'commandId' : 'save', type: 'submit', 'caption' : 'Speichern', click : save},
            {'commandId' : 'toggle-style', type: 'button', 'caption' : 'Toggle Style', click : toggleStyle},
            {'commandId' : 'cancel', type: 'button', 'caption' : 'Abbruch', click : backToStartPage}
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
        })
        targets.on('focus', function(){
            $('[for='+this.id+']').addClass('is-floated');
        });
        targets.on('blur', function() {
            if (this.value.length === 0) $('[for='+this.id+']').removeClass('is-floated');
        });
    }


    var noteStorage = new NoteStorage();

    var parameters = getParametersFromSearchString(window.location.search);

    var note;

    if ('id' in parameters) {
        note = noteStorage.getNote(Number(parameters.id));
    }
    else {
        note = noteStorage.createNewNote();
    }

    setNote(note);

    initializeCommands();
    enableFloatingLabels();

    // Button event handlers.

    function toggleStyle() {

        var styleSheet1 = 'css/style.css';
        var styleSheet2 = 'css/style2.css';

        var stylesheet = $('#stylesheet');
        var inputsToSwap = $('.label-field>input, .label-field>textarea');

        if ($(stylesheet).attr('href') === styleSheet1) {
            $(stylesheet).attr('href', styleSheet2);

            $(inputsToSwap).each(function (index, element) {
                $(element).insertAfter($(element).next())
            });

        }
        else {
            $(stylesheet).attr('href', styleSheet1);
            $(inputsToSwap).each(function (index, element) {
                $(element).insertBefore($(element).prev())
            });

        }
    }

    function backToStartPage() {
        window.location.replace('index.html');
    }

    function save () {
        if (validate()) {
            event.preventDefault();
            getNote(note);
            noteStorage.putNote(note);
            backToStartPage();
        }
    }
}

$(function () {
        try {
            initialize();
        }
        catch (exception) {
            alert('Es ist ein Fehler aufgetreten:\n' + exception.toString());
        }
    }
);