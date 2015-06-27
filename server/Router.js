/**
 * Created by rstuder on 11.06.15.
 */

var url = require('url');
var path = require('path');



function Router(){
    var routes =  [];

    /**
     * Creates a new Route with a callback
     * Router are defined like Router.newRoute('GET', '/notes/:id'/, function(req,res,params)
     * Callback is called with params object which returns matched parameters for example for /notes/16 it contains {"id": "16"}
     */
    var newRoute = function (method, pattern, fn) {
        var route = {method: method, pattern: getExtractionPattern(pattern), callback: fn};
        routes.push(route);
    };

    var requestHandler = function (req, res) {
        var pathname = url.parse(req.url).pathname;

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var params = matchUrlWithPattern(pathname,route.pattern);
            if(params && route.method === req.method) {
                route.callback(req,res,params);
                break;
            }
        }
    };

    /**
     * Delivers static files from /app to client
     */
    var static = function (req, res, params) {
        var pathname = url.parse(req.url).pathname;
        if (pathname === '/') {
            pathname = '/index.html'
        }
        pathname = path.join('..', 'app', pathname);

        res.statusCode = 200;

        var extension = path.extname(pathname);
        if (extension === '.css') {
            res.setHeader("Content-Type", 'text/css');
        }
        else if (extension === '.js') {
            res.setHeader("Content-Type", 'text/javascript');
        }
        else if (extension === '.html') {
            res.setHeader("Content-Type", 'text/html');
        }
        var readStream = fs.createReadStream(pathname);
        readStream.on('error', function (error) {
            res.statusCode = 404;
            res.end(error.toString());
        });
        readStream.pipe(res);
    };

    return {
        newRoute: newRoute,
        static: static,
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
            var match = fragment.match(paramPattern);
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
    }
}

function trimEndSlash(string) {
    string = string.replace(/\/$/g,'');
    return string;
}

module.exports = Router;