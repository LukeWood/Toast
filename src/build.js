var compressor = require("node-minify");
var config = require("./config.js");

var min_path="../dist/toast-"+config.version+".min.js";
var path="../dist/toast-"+config.version+".js";

compressor.minify({
    compressor:"uglifyjs",
    input:"toast/toast.js",
    output:min_path,
    callback:function(err,min){
      if(err){
        console.log(err);
      }
    }
});
