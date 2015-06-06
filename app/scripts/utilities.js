/**
 * Created by Luzius on 06.06.2015.
 */
var utilities = (function() {
    "use strict";



    /**
     * Left string padding.
     *
     * @param {string} toPad The string to pad.
     * @param {number} targetLength The final length of padded string.
     * @param {string} padChar The char to pad with.
     *
     */
    function padLeft(toPad, targetLength, padChar) {
        var result = toPad.toString();
        while (result.length < targetLength) {
            result = padChar + result;
        }
        return result;
    }


    /**
     * Parses a GET search string.
     *
     * @param {string} searchString The input search string.
     * @return {Object} An object with the keys as object properties that store the related values.
     * If a value is not specified in the search string then an object property is created with the value undefined.
     *
     */
    function getParametersFromSearchString(searchString) {
        var noQuestionMark = searchString.substr(1);
        var keyValuePairs = noQuestionMark.split("&");

        var parameters = {};

        var resultKeyValuePairs = keyValuePairs
            .map(function (keyValuePair) {
                var keyAndValue = keyValuePair.split("=");
                return {key: keyAndValue[0], value: keyAndValue.length === 2 ? keyAndValue[1] : undefined};
            })
            .forEach(function (keyValuePair) {
                parameters[keyValuePair.key] = keyValuePair.value;
            });

        return parameters;

    }

    return {
        padLeft : padLeft,
        getParametersFromSearchString : getParametersFromSearchString
    }

}());