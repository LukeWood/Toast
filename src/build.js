var compressor = require("node-minify");
var config = require("./config.js");

compressor.minify({
    compressor:"uglifyjs",
    input:"toast/toast.js",
    output:config.version,
    callback:function(err,min){}
});
