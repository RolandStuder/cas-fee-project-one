/**
 * Created by Luzius on 22.05.2015.
 */

/**
 * Sets the note input fields from a Note instance.
 *
 * @param {Note} note The source note.
 */
function setNote(note) {

    document.getElementById("title").value = note.title;
    document.getElementById("note-text").value = note.description;
    
    document.getElementById("due").value = 
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
    note.title = document.getElementById("title").value;
    note.description = document.getElementById("note-text").value;
    note.due = new Date(document.getElementById("due").value);
    note.importance = Number(document.querySelector('input[name="importance"]:checked').value);
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
 * Page initialization.
 */
function initialize() {

    var id = 0;
    var parameters = getParametersFromSearchString(window.location.search);

    if("id" in parameters) {
        id = parameters.id;
    }

    var note = Note.getNote(id);

    setNote(note);

    function backToStartPage() {
        window.location.replace("index.html");
    }

    document.getElementById("save").onclick = function() {
        getNote(note);
        Note.setNote(Number(id), note);
        backToStartPage();
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