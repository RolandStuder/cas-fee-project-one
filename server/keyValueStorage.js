/**
 * Sync KeyValueStorage
 *
 * Notice: Would be better async. But this would change the API and a lot would have to be adjusted.
 *
 */

fs = require('fs');

function Storage(name) {

    // initialize
    var dbFile = createDbFile(name);

    function readValue(key) { // returns an string
        var data = fs.readFileSync(dbFile,'utf-8');
        return JSON.parse(data)[key];
    }

    function writeValue(key, value){ // returns a string all newValue
        var data = fs.readFileSync(dbFile,'utf-8');
        var obj = JSON.parse(data);
        obj[key] = value || '';
        data = JSON.stringify(obj);
        fs.writeFileSync(dbFile,data);
    }

    return {

        getItem: readValue,
        setItem: writeValue
    }
}

function createDbFile(name) {
    if (!(fs.existsSync('db'))) {
        fs.mkdirSync('db');
    }
    var dbPath = "db/" + name + ".db";
    if (!(fs.existsSync(dbPath))) {
        fs.writeFileSync(dbPath,'{}')
    }
    return dbPath;
}

module.exports = Storage;