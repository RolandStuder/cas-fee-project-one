// Storage functions

function isLocalStorageSupported() {
  if (typeof localStorage !== 'undefined') {
    return true;
  } 
  console.error( "localStorage not supported, sorry this does not work without this feature" );
}

function notesExist() {
  if ( !!localStorage.getItem('notes')) {
    return true;
  } else {
    return false;
  }
}

function putInitialNotes() {
  var initialNotes = [
    {id: 1, title: 'Note one', description: "some description", importance: 1},
    {id: 2, title: 'Note two', description: "some description", importance: 2},
    {id: 3, title: 'Note three', description: "some description", importance: 3}
  ]

  if (notesExist() === false) {
    var notes = JSON.stringify(initialNotes);
    localStorage.setItem('notes', notes);
    console.log("some notes added");
  }
}

// Saving funtions

if (document.getElementById('submit'))
  document.getElementById('submit').addEventListener('click',submitNote);

function submitNote(event) {
  event.preventDefault();
  addNoteToStorage(getFormValues());
}

function getFormValues() {
  var result =  {}
  result.title = document.getElementById('title').value;
  result.description = document.getElementById('note-text').value;
  result.due = document.getElementById('due').value;
  return result;
}

function addNoteToStorage (obj) { 
  var notes = JSON.parse(localStorage.getItem('notes'));
  notes.push(obj);
  notes = JSON.stringify(notes);
  console.log(notes);
  localStorage.setItem('notes',notes);
}

// Rendering functions

function renderList() {
  var notes = JSON.parse(localStorage.getItem('notes'));
  for (var i = 0; i < notes.length; i++) {
    renderNote(notes[i]);
  }
}

function renderNote(note) {
  var element = createTag('div', '' ,{class: 'note'});
  element.appendChild(createTag('a', '', {href: 'EditNote.html'}));
  var childNode = element.childNodes[0];
  childNode.appendChild( createTag('h3', note.title));
  childNode.appendChild( createTag('div', note.completion, {class: 'note-completion'}))
  childNode.appendChild( createTag('div', note.date, {class: 'note-date'}));
  childNode.appendChild( createTag('p', note.description, {class: 'note-description'}))
  document.getElementsByTagName('main')[0].appendChild(element);
}

function createTag(tagName, content, attributes) {
  var element = document.createElement(tagName);
  attributes ? attributes : attributes = {};
  content ? content : content = '';

  element.innerText = content;    
  
  for (var prop in attributes ) {
      element.setAttribute(prop,attributes[prop])
  }
  return element;
}

// execute on load

if ( isLocalStorageSupported() ) {
  putInitialNotes();
  renderList();  
}
