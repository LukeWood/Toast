#!/usr/bin/env node
var config = require("./src/config.js");
var min_path="./dist/toast-"+config.version+".min.js";
var outpath = "Toast.js";

var fs = require('fs');
require.extensions['.js'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var jsfile = require(min_path);

fs.writeFile(outpath, jsfile, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Toast successfully copied, to use it in your project include the \"Toast.js\" file.");
});
