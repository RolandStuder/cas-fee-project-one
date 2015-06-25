# Simple todo/notetaking tool for the CAS FEE

* Data is stores in a simple textfile.
* Uses only core node modules.
* 3rd party libraries: Handlebars and jQuery


## Running instructions

Node working directory should be set to `/server`. Then run `main.js`.

## Note API

The note tool exposes the following API:

    GET /notes - Returns an JSON array of notes 
    GET /notes/12 - Returns the note with the corresponding ID as JSON
    POST /notes - Creates a new note
    PUT /notes/12 - Overwrites a note with the new datat

