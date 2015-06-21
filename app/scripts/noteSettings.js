/**
 * Created by Luzius on 07.06.2015.
 */


/**
 *  Notes settings module. Exposes functions to read and write the notes app settings and implicitly the Settings class.
 * @type {{readSettings, updateSettings, Settings}}
 */
var noteSettings = (function () {
    "use strict";

    /**
     *
     * @param {string} orderBy The order by predicate for the notes in the main page. Use one of the Settings.orderBy.. predefined values.
     * @param {boolean} excludeCompletedNotes Indicates if the completed notes have to be excluded from the note list.
     * @constructor
     */
    function Settings(orderBy, excludeCompletedNotes) {
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

    /**
     * Predefined order by value.
     * @type {string} Order by creation date.
     */
    Settings.orderByCreationDate = 'creationDate';

    /**
     * Converts a settings string to an instance of the class Settings.
     *
     * @param {string} settingsString
     * @returns {Settings} The converted settings string.
     */
    function settingsStringToSettings(settingsString) {
        var settingsObject = JSON.parse(settingsString);
        return new Settings(settingsObject.orderBy, settingsObject.excludeCompletedNotes);
    }

    /**
     * Converts an instance of the Settings class to a settings string.
     *
     * @param {Settings} settings  The settings to convert.
     */
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


    /**
     * Updates the settings on the server.
     *
     * @param {Settings} settings The settings to update.
     * @param {doneCallback} doneCallback  The callback that is called when the settings are stored.
     */
    function updateSettings(settings, doneCallback) {
        var settingsString = settingsStringFromSettings(settings);

        $.ajax({
            url: 'http://localhost:3000/settings',
            type: 'PUT',
            data: settingsString,
            success: function (data, textStatus, jqXHR) {
                if (typeof doneCallback != 'undefined') {
                    doneCallback();
                }
            }
        });

    }


    /**
     * Reads the settings from the server.
     *
     * @param {settingsCallback} settingsCallback The callback that is called when the setting as available.
     */
    function readSettings(settingsCallback) {
        $.ajax({
                url: 'http://localhost:3000/settings',
                type: 'GET',

                success: function (data, textStatus, jqXHR) {
                    if (typeof settingsCallback != 'undefined') {
                        var settings = settingsStringToSettings(data);
                        settingsCallback(settings);
                    }
                }
            }
        );
    }

    var settingsSingleton;

    function initializeSettings(doneCallback) {
        readSettings(function (settings) {
            settingsSingleton = settings;
            doneCallback();
        });
    }

    return {
        /**
         *  Initializes the internal notes settings singleton instance.
         */
        initializeSettings: initializeSettings,

        /**
         *
         * @returns {Settings}  The settings singleton.
         */
        getSettings: function () {
            return settingsSingleton
        },

        /**
         * Updates the settings singleton.
         */
        updateSettings: function () {
            updateSettings(settingsSingleton, function () {
            })
        },
        Settings: Settings
    }


}());