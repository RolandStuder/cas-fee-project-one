

// Saving funtions -> TODO: Need to be implemented on editNote.html

if (document.getElementById('submit'))
    document.getElementById('submit').addEventListener('click',submitNote);

function submitNote(event) {
    event.preventDefault();
    addNoteToStorage(getFormValues());
}

function renderList() {
    var notes = JSON.parse(localStorage.getItem('notes'));
    for (var i = 0; i < notes.length; i++) {
        renderNote(notes[i],i);
    }
}

function renderNote(note,id) {
    var element = createTag('div', '' ,{class: 'note'});
    var href = 'editNote.html?id='+id;
    element.appendChild(createTag('a', '', {href: href}));
    var childNode = element.childNodes[0];
    childNode.appendChild( createTag('h3', note.title));
    childNode.appendChild( createTag('div', note.completion, {class: 'note-completion'}))
    childNode.appendChild( createTag('div', note.date, {class: 'note-date'}));
    childNode.appendChild( createTag('p', note.description, {class: 'note-description'}))
    document.getElementsByTagName('main')[0].appendChild(element);
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

// execute on load
renderList();
