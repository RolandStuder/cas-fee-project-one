function renderList(orderBy) {
    if (!orderBy) orderBy = 'importance';
    var noteStorage = noteData.noteStorageSingleton.getInstance();
    var notes = noteStorage.readNotes();
    notes = orderListBy(notes, orderBy);
    $(getMainElement()).empty().html(noteListTemplate(notes));
}

// execute on load
var noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);


function orderListBy(list, orderBy) {
    if (orderBy === orderByDue) {
        list.sort(function(note1, note2) {
            // Descending.
            return note2.due - note1.due;
        })
    }
    else if(renderList.orderBy == orderByImportance) {
        // Descending.
        notes.sort(function(note1, note2) {return note2.importance - note1.importance})
    }
    return list;
}

function getMainElement() {
    return document.getElementsByTagName('main')[0];
}


document.getElementById("new-note").onclick = function() {
    window.location.replace('editNote.html')
};

document.getElementById("order-by-due").onclick = function() {
    renderList(orderByDue);
};

document.getElementById("order-by-importance").onclick = function() {
    renderList(orderByImportance);
};

var orderByImportance = 'importance';
var orderByDue = 'due';

// execute on load
renderList();
