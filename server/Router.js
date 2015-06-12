/**
 * Created by rstuder on 11.06.15.
 */

/*
 Create new Routes as
 var router = new Router();
 router.newRoute('GET', '/something/:id', function(){
 // do stuff
 });

 TYPE OF REQUEST IS NOT IMPLEMENTED YET
 */

var url = require('url');


function Router(){
    var routes =  [];

    var newRoute = function (method, pattern, fn) {
        var route = {method: method, pattern: getExtractionPattern(pattern), callback: fn};
        routes.push(route);
    };

    var requestHandler = function (req, res) {
        var result = "";

        var pathname = url.parse(req.url).pathname;

        for (var i = 0; i < routes.length; i++) {
            params = matchUrlWithPattern(pathname,routes[i].pattern);
            if(params) {
                routes[i].callback(req,res,params);
                break;
            }
        }
    };

    return {
        newRoute: newRoute,
        requestHandler: requestHandler
    };
}




function getExtractionPattern (pattern) {
    var result = {};
    result.params = [];

    var position = 0;
    var paramPattern = /^:(\w+)/;

    var pathnameFragments = pattern.split('/');

    pathnameFragments.forEach(function(fragment, index){
        if (fragment.match(paramPattern)) {
            match = fragment.match(paramPattern);
            result.params[position] = match[1];
            position++;
        }
    });

    var regex = trimEndSlash(pattern);
    result.regex = regex.replace(/:(\w+)/g,"(\\w+)");
    result.regex = "^" + result.regex + "$";
    return result;
}

// returns an object with params if matched, false if no match;
function matchUrlWithPattern (requestUrl,extractionPattern) {
    requestUrl = trimEndSlash(requestUrl);
    var params = {};
    var match = requestUrl.match(extractionPattern.regex);
    if (match) {
        for (var i = 0; i< extractionPattern.params.length; i++) {
            params[extractionPattern.params[i]] = match[i+1];
        }
        return params;
    }
    else {
        return false;
    };
}

function trimEndSlash(string) {
    string = string.replace(/\/$/g,'');
    return string;
}

module.exports = Router;