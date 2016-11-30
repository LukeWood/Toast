(function(name){
    "use strict";
    function init_toast(get_p,json_p,post_p){
      this.crossOrigin = false;
      this.debug = false;

      // We only support modern browsers.
      if(!window.XMLHttpRequest){
          console.error("Toast needs XMLHttpRequest to work");
          return;
      }

      //Error logger
      function error(message,caller){
        console.error("Toast Error: "+message+" in function '"+caller+"'");
      }

      // Centralized cross origin request so that 2
      function CrossOriginRequest(method,url){
        var x = new XMLHttpRequest();
        if (typeof XDomainRequest !== "undefined"){
            x = new XDomainRequest();
        }
        x.open(method,url,true);
        return x;
      }


      //URL parameter encoding
      function encode_params(params){
        var strval = "?";
        for(var key in params){
          strval += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
        }
        return strval.slice(0,-1);
      }
      //Supports a variety of parameters... get({object}, callback)... or just get({object});
      function parseArgs(){

        if(arguments.length == 0){
          if(this.debug){
            error("No arguments passed.", "parseArgs");
          }
          return;
        }

        var url = arguments.length >= 1 ? arguments[0] : null, callback = arguments.length >= 2 ? arguments[1] : null, fail = arguments.length >= 3 ? arguments[2] : null, params = arguments.length >= 4 ? arguments[3] : null;

        if(typeof arguments[0] === "object"){

            if(this.debug){
              console.log("Argument 0 is an object, arguments are being parsed as an object");
            }

            if(arguments[0].hasOwnProperty("callback")){callback = arguments[0].callback};
            if(arguments[0].hasOwnProperty("fail")){fail = arguments[0].fail};
            if(arguments[0].hasOwnProperty("url")){url = arguments[0].url};
            if(arguments[0].hasOwnProperty("params")){params = arguments[0].params};
        }
        else if(this.debug){
            console.log("Arguments are being passed in comma separated format.");
        }

        if(typeof callback === "string"){
          callback = new Function("data",callback);
        }

        if(typeof fail ==="string"){
          fail = new Function("data",callback);
        }
        if(typeof params !== "object"){
          params = null;
          if(this.debug){
            error("params were not passed as an object","parseArgs");
          }
        }

        return {url:url, callback:callback, fail:fail, params:params};
      }

      //Passes back the response text to callback, or the fail status to fail.
      function get(){

        var args = parseArgs.apply(this,arguments);
        var url = args.url, callback = args.callback, fail=args.fail, params = args.params;

        //Allow cross origin requests.
        var x = this.crossOrigin ? CrossOriginRequest("GET",url+encode_params(params)) : new XMLHttpRequest();
        if(!this.crossOrigin){
          x.open("GET",url+encode_params(params));
        }

        function change_handler(){
            if(x.readyState === 4){
                if(x.status === 200){
                  if(callback != null && typeof callback ==="function")
                  callback(x.responseText);
                }
                else{
                  if(fail != null && typeof fail ==="function"){
                    fail(x.statusText);
                  }else{
                    error("Request to "+url+" has failed ","get");
                  }
                }
            }
        }

        x.onreadystatechange = change_handler;
        x.send();
      }

      function json(){
        var args = parseArgs.apply(this,arguments);
        var url = args.url, callback = args.callback, fail=args.fail, params = args.params;

        var back_ref = this;
        get.call(this,url+encode_params(params),
          function(responseText){
            try{
              var json_object = JSON.parse(responseText);
              callback(json_object);
            }
            catch(e){
              fail(e.message);
              if(back_ref.debug){
                  error("JSON could not be parsed for url '"+url+"'","json");
                  console.error(e.message);
              }
            }
        },fail);

      }


      function post(options){
        var options = parseArgs(options);
        var url = options.url, callback = options.callback, fail=options.fail, params = options.params != null ? JSON.stringify(options.params) : null;

        if(typeof callback === "string"){
          callback = new Function("data",callback);
        }
        if(typeof fail ==="string"){
          fail = new Function("data",callback);
        }
        var x = this.crossOrigin ? CrossOriginRequest("POST",url) : new XMLHttpRequest();
        if(!this.crossOrigin){
            x.open("POST",url);
        }

        function change_handler(){
            if(x.readyState === 4){
                if(x.status === 200){
                  if(callback != null && typeof callback ==="function")
                  callback(x.responseText);
                }
                else{
                  if(fail != null && typeof fail ==="function"){
                    fail(x.statusText);
                  }else{
                    error("Request to "+url+" has failed ","get");
                  }
                }
            }
        }

        x.onreadystatechange = change_handler;
        if(options != null){
          x.setRequestHeader("Content-type", "application/json; charset=utf-8");
          x.setRequestHeader("Content-length", params.length);
          x.setRequestHeader("Connection", "close");
          x.send(params);
        }

      }

      this[get_p] = get.bind(this);
      this[json_p] = json.bind(this);
      this[post_p] = post.bind(this);

    }

    if(name == null || name ===""){
        init_toast.call(window,"get","getJSON","post");
    }
    else{
      window[name] = new init_toast("get","getJSON","post");
    }

})("Toast");
//You can invoke this with null to get global functions for get,getJSON, and post

// These parameters determing the naming convention used.
