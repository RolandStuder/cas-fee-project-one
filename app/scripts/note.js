/**
 * Created by Luzius on 22.05.2015.
 *
 * Defines the Note class.
 */

/**
 * Note constructor.
 *
 * @param {number} id The id of the note.
 * @param {string} title The title of the note.
 * @param {string} description
 * @param {number} importance
 * @param {Date} due
 * @param {boolean} completed
 * @constructor
 */
function Note(id, title, description, importance, due, completed) {
    this.title = title;
    this.description = description;
    this.importance = Number(importance);
    this.due = new Date(due);
    this.completed = Boolean(completed);
    this.id = Number(id);
}

Note.prototype.constructor = Note;

