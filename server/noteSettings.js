/**
 * Created by Luzius on 14.06.2015.
 */

var Storage = require('./keyValueStorage');


/**
 *  @module appSettings
 *
 *  Notes settings module. Exposes functions to read and write the notes app settings and implicitly the Settings class.
 */
var noteSettings = (function() {
    "use strict";

    /**
     * @param {string} orderBy The order by predicate for the notes in the main page. Use one of the Settings.orderBy.. predefined values.
     * @param {boolean} excludeCompletedNotes Indicates if the completed notes have to be excluded from the note list.
     * @constructor
     */
    function Settings(orderBy, excludeCompletedNotes){
        this.orderBy = String(orderBy || Settings.orderByImportance);
        this.excludeCompletedNotes = Boolean(excludeCompletedNotes);
    }

    Settings.prototype.constructor = Settings;

    /**
     * Predefined order by value
     * @type {string} Order by importance value.
     */
    Settings.orderByImportance = 'importance';

    /**
     * Predefined order by value.
     * @type {string} Order by due
     */
    Settings.orderByDue = 'due';



    var settingsKey = 'noteSettings';
    var settingsStorageName = 'noteSettings';

    function updateSettings(settings) {
        var settingsString = JSON.stringify(settings);
        var settingsStorage = new Storage(settingsStorageName);
        settingsStorage.setItem(settingsKey, settingsString);
    }


    function readSettings() {
        var settingsStorage = new Storage(settingsStorageName);
        var settingsString = settingsStorage.getItem(settingsKey);
        if(!settingsString) {
            return new Settings(Settings.orderByImportance, false);
        }
        else {
            var settingsObject = JSON.parse(settingsString);
            return new Settings(settingsObject.orderBy, settingsObject.excludeCompletedNotes);
        }
    }

    return {
        readSettings : readSettings,
        updateSettings : updateSettings,
        Settings : Settings
    }


}());

module.exports = noteSettings;