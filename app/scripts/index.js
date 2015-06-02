function renderList() {
    var notes = Note.readNotes();
    document.getElementsByTagName('main')[0].innerHTML = noteListTemplate(notes);
}

// execute on load
var noteListTemplate = Handlebars.compile(document.getElementById('noteListTemplate').innerHTML);

window .onload = function() {
    renderList();
}
