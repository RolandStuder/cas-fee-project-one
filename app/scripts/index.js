

// Saving funtions -> TODO: Need to be implemented on editNote.html

if (document.getElementById('submit'))
    document.getElementById('submit').addEventListener('click',submitNote);

function submitNote(event) {
    event.preventDefault();
    addNoteToStorage(getFormValues());
}

function renderList() {

    // TODO: orderby is lost when comming back from edit note.
    if(renderList.orderBy == undefined) {
        renderList.orderBy = orderByImportance;
    }

    var noteStorage = new NoteStorage();
    var notes = noteStorage.readNotes();

    if(renderList.orderBy == orderByDue) {
        notes.sort(function(note1, note2) {
            // Descending.
            return note2.due - note1.due;
        })
    }
    else if(renderList.orderBy == orderByImportance) {
        // Descending.
        notes.sort(function(note1, note2) {return note2.importance - note1.importance})
    }

    $(getMainElement()).empty();

    notes.forEach(function(note) {
        renderNote(note);
    });
}

function getMainElement() {
    return document.getElementsByTagName('main')[0];
}
function renderNote(note) {
    var element = createTag('div', '' ,{class: 'note'});
    var href = 'editNote.html?id='+ note.id;
    element.appendChild(createTag('a', '', {href: href}));
    var childNode = element.childNodes[0];
    childNode.appendChild( createTag('h3', note.title));
    childNode.appendChild( createTag('div', "Erledigt: " + note.completed, {class: 'note-completion'}));
    childNode.appendChild( createTag('div', "Bis: " + note.due.toLocaleDateString(), {class: 'note-date'}));
    childNode.appendChild( createTag('div', "Wichtigkeit: " + note.importance, {class: 'note-date'}));
    childNode.appendChild( createTag('p', note.description, {class: 'note-description'}));
    getMainElement().appendChild(element);
}

// creates a DOM element, pass an object as the attribues argument to add any attributes.
function createTag(tagName, content, attributes) {
    var element = document.createElement(tagName);
    attributes ? attributes : attributes = {}; // TODO: is there a better way to write this? Webstorm does not like it.
    content ? content : content = '';

    element.innerText = content;

    for (var prop in attributes ) {
        element.setAttribute(prop,attributes[prop])
    }
    return element;
}

document.getElementById("new-note").onclick = function() {
    window.location.replace('editNote.html')
};

document.getElementById("order-by-due").onclick = function() {
    renderList.orderBy = orderByDue;
    renderList();
};

document.getElementById("order-by-importance").onclick = function() {
    renderList.orderBy = orderByImportance;
    renderList();
};

var orderByImportance = 'importance';
var orderByDue = 'due';

// execute on load
renderList();
