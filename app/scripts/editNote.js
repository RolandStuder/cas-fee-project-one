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

    $(dueElement()).val(
        note.due.getFullYear() + "-" +
        padLeft(String((note.due.getMonth() + 1)), 2, "0") + "-" +
        padLeft(String(note.due.getDate()), 2, "0"));
    $('#importance-' + note.importance).prop('checked', true);
}

/**
 * Stores the note input fields in a Note instance.
 *
 * @param {Note} note - The destination note.
 */
function getNote(note) {
    note.title = $(titleElement()).val();
    note.description = $(descriptionElement()).val();
    note.due = new Date($(dueElement()).val());
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

function validate() {
    if ($(titleElement()).val() == "") {
        $('#title-error').html("Titel muss eingegeben werden");
//        titleElement().placeholder = "Titel muss eingegeben werden";
        titleElement().focus();
        return false;
    }
    if (isNaN(new Date($(dueElement()).val()).getTime())) {
        dueElement().placeholder = "Ung�ltiges Datum. Erwartetes Format: YYYY-MM-DD";
        dueElement().focus();
        return false;
    }


    return true;

}

/**
 * Page initialization.
 */
function initialize() {

    var noteStorage = new NoteStorage();

    var parameters = getParametersFromSearchString(window.location.search);

    var note;

    if ("id" in parameters) {
        note = noteStorage.getNote(Number(parameters.id));
    }
    else {
        note = noteStorage.getNewNote();
    }

    setNote(note);

    function backToStartPage() {
        window.location.replace("index.html");
    }

    $('#save').on('click', function (event) {
        if (validate()) {
            getNote(note);
            noteStorage.putNote(note);
            backToStartPage();
        }
    });

    $('#cancel').on('click', backToStartPage);

    function setStyle() {

        var styleSheet1 = 'css/style.css';
        var styleSheet2 = 'css/style2.css';

        var stylesheet = $('#stylesheet');
        var inputsToSwap = $('.label-field>input, .label-field>textarea');

        if ($(stylesheet).attr('href') === styleSheet1) {
            $(stylesheet).attr('href', styleSheet2);

            $(inputsToSwap).each(function(index, element) {
                $(element).insertAfter($(element).next())
            });

        }
        else {
            $(stylesheet).attr('href', styleSheet1);
            $(inputsToSwap).each(function(index, element) {
                $(element).insertBefore($(element).prev())
            });

        }
    }

    $('#style').on('click', setStyle);

}

try {
    initialize();
}
catch (exception) {
    alert('Es ist ein Fehler aufgetreten:\n' + exception.toString());
}