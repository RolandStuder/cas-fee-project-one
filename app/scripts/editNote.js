/**
 * Created by Luzius on 22.05.2015.
 */

/**
 * Sets the note input fields from a Note instance.
 *
 * @param {Note} note - The source note.
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
 * Extracts from a GET search string a value for a given key.
 *
 * @param {String} searchString - The input search string.
 * @param {String} key - The key.
 * @param {String} defaultValue - The value to return if the key is not found in the search string.
 *
 */
function getParameterFromSearchString(searchString, key, defaultValue) {
    var noQuestionMark = searchString.substr(1);
    var keyValuePairs = noQuestionMark.split("&");

    var resultKeyValuePairs = keyValuePairs
        .map(function (keyValuePair) {
            var keyAndValue = keyValuePair.split("=");
            return {key: keyAndValue[0], value: keyAndValue.length === 2 ? keyAndValue[1] : undefined};
        })
        .filter(function (keyValuePair) {
            return keyValuePair.key === key;
        });

    if (resultKeyValuePairs.length === 1) {
        return resultKeyValuePairs[0].value;
    }
    else if (resultKeyValuePairs.length === 0) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        else {
            throw "Key " + key + " not found in search string"
        }
    }
    else {
        throw "Key " + key + " not unique in search string"
    }
}

/**
 * Left string padding.
 *
 * @param {String} toPad - The string to pad.
 * @param {Number} targetLength - The final length of padded string.
 * @param {String} padChar - The char to pad with.
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
 *
 */
function initialize() {

    var id = Number(getParameterFromSearchString(window.location.search, "id", "0"));
    var note = Note.getNote(id);

    setNote(note);

    function backToStartPage() {
        window.location.replace("index.html")
    }

    document.getElementById("save").onclick = function() {
        getNote(note);
        Note.setNote(id, note);
        backToStartPage();
    };

    document.getElementById("cancel").onclick = backToStartPage;

}


initialize();
