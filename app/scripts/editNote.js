/**
 * Created by Luzius on 22.05.2015.
 */

/**
 * Sets the note input fields from a Note instance.
 *
 * @param {Note} note The source note.
 */
function setNote(note) {

    titleElement().value = note.title;
    descriptionElement().value = note.description;

    dueElement().value =
        note.due.getFullYear() + "-" +
        padLeft(String((note.due.getMonth() + 1)), 2, "0") + "-" +
        padLeft(String(note.due.getDate()), 2, "0");

    document.getElementById("importance-" + note.importance).checked = true;
}

/**
 * Stores the note input fields in a Note instance.
 *
 * @param {Note} note - The destination note.
 */
function getNote(note) {
    note.title = titleElement().value;
    note.description = descriptionElement().value;
    note.due = new Date(dueElement().value);
    note.importance = Number(document.querySelector('input[name="importance"]:checked').value);
}

function titleElement() {
    return document.getElementById("title");
}
function descriptionElement() {
    return document.getElementById("note-text");
}
function dueElement() {
    return document.getElementById("due");
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
    if(titleElement().value == "") {
        titleElement().placeholder = "Titel muss eingegeben werden";
        titleElement().focus();
        return false;
    }
    if(isNaN(new Date(dueElement().value).getTime())) {
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

    var id = 0;
    var parameters = getParametersFromSearchString(window.location.search);

    var note;

    if("id" in parameters) {
        id = parameters.id;
        note = noteStorage.getNote(Number(parameters.id));
    }
    else {
        note = noteStorage.getNewNote();
    }

    setNote(note);

    function backToStartPage() {
        window.location.replace("index.html");
    }

    document.getElementById("save").onclick = function() {
        if(validate()) {
            getNote(note);
            noteStorage.putNote(note);
            backToStartPage();
        }
    };

    document.getElementById("cancel").onclick = backToStartPage;

    function toggleColor(element) {
        if(element.style.backgroundColor == "") {
            element.style.backgroundColor = "black";
        }
        else {
            element.style.backgroundColor = "";
        }

        if(element.style.color == "") {
            element.style.color = "white";
        }
        else {
            element.style.color = "";
        }
    }

    function setStyle() {
        var elements = document.getElementsByTagName("*");
        [].slice.call(elements).forEach(function(element) {toggleColor(element)});
    }

    document.getElementById("style").onclick = setStyle;

}

try {
    initialize();
}
catch(exception) {
    alert("Es ist ein Fehler aufgetreten:\n" + exception.toString());
}