/**
 * Created by Luzius on 07.06.2015.
 */


/**
 *  Notes settings module. Exposes functions to read and write the notes app settings and implicitly the Settings class.
  * @type {{readSettings, updateSettings, Settings}}
 */
var noteSettings = (function() {
    "use strict";

    /**
     *
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


    function settingsStringToSettings(settingsString) {
        var settingsObject = JSON.parse(settingsString);
        return new Settings(settingsObject.orderBy, settingsObject.excludeCompletedNotes);
    }

    function settingsStringFromSettings(settings) {
        return JSON.stringify(settings);
    }

    /**
     * @callback settingsCallback The function that is called when the settings are read from the storage.
     * @param  {Settings} settings The settings from the storage.
     */

    /**
     * @callback doneCallback A simple callback without parameter that indicates that a async function has completed.
     */

    function updateSettings(settings, doneCallback) {
        var settingsString = settingsStringFromSettings(settings);
        $.post('http://localhost:3000/settings', settingsString, function (data, status) {
            if (doneCallback != undefined) {
                doneCallback();
            }
            else {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
    }


    function readSettings(settingsCallback) {
        $.get('http://localhost:3000/settings', function (data, status) {
            if (settingsCallback != undefined) {
                var settings = settingsStringToSettings(data);
                settingsCallback(settings);
            }
            else {
                alert("Data: " + data + "\nStatus: " + status);
            }
        });
    }

    var settingsSingleton;

    function initializeSettings(doneCallback) {
        readSettings(function (settings) {
            settingsSingleton = settings;
            doneCallback();
        });
    }

    return {
        initializeSettings : initializeSettings,
        getSettings : function () {return settingsSingleton},
        updateSettings : function () {updateSettings(settingsSingleton, function(){})},
        Settings : Settings
    }


}());