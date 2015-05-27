/**
 * Created by Luzius on 25.05.2015.
 */

/**
 * Parses a GET search string.
 *
 * @param {string} searchString The input search string.
 * @return {Object} parameters  An object with the keys as object properties that store the related values.
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

//function test() {
//    var parameters = getParametersFromSearchString("?id=0&id2");
//
//    console.log(parameters.id);
//    console.log(parameters.id);
//
//    if("id2" in parameters) {
//        console.log("has id2");
//    }
//    console.log(parameters.id2);
//
//}
//
//test();