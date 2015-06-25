/**
 * Created by Luzius on 14.06.2015.
 */

var Storage = require('./keyValueStorage');


/**
 *  @module appSettings
 *
 *  App settings module. Exposes functions to read and write the notes app settings and implicitly the Settings class.
 */
var appSettings = (function() {
    "use strict";

    /**
     * @param {string} orderBy The order by predicate for the notes in the main page. Use one of the Settings.orderBy.. predefined values.
     * @param {boolean} excludeCompletedNotes Indicates if the completed notes have to be excluded from the note list.
     * @constructor
     */
    function Settings(orderBy, excludeCompletedNotes, theme){
        this.orderBy = String(orderBy || Settings.orderByImportance);
        this.excludeCompletedNotes = Boolean(excludeCompletedNotes);
        this.theme = theme || 'style';
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



    var settingsKey = 'appSettings';
    var settingsStorageName = 'appSettings';

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
            return new Settings(settingsObject.orderBy, settingsObject.excludeCompletedNotes, settingsObject.theme);
        }
    }

    return {
        readSettings : readSettings,
        updateSettings : updateSettings,
        Settings : Settings
    }


}());

module.exports = appSettings;