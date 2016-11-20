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

      function CrossOriginRequest(method,url){
        var x = new XMLHttpRequest();
        if (typeof XDomainRequest != "undefined"){
            x = new XDomainRequest();
        }
        x.open(method,url,true);
        return x;
      }

      //Supports a variety of parameters... get({object}, callback)... or just get({object});
      function parseArgs(){
        var url = arguments.length >= 1 ? arguments[0] : null, callback = arguments.length >= 2 ? arguments[1] : null, fail = arguments.length >= 3 ? arguments[2] : null;

        if(arguments.length == 0){
          error("No arguments passed", "get");
          return;
        }

        if(typeof arguments[0] === "object"){

            if(this.debug){
              console.log("Argument 0 is an object, setting callback and fail accordingly.");
            }

            if(arguments[0].hasOwnProperty("callback")){callback = arguments[0].callback};
            if(arguments[0].hasOwnProperty("fail")){fail = arguments[0].fail};
            if(arguments[0].hasOwnProperty("url")){url = arguments[0].url};
        }
        return {url:url, callback:callback, fail:fail};
      }

      //Passes back the response text to callback, or the fail status to fail.
      function get(){

        var params = parseArgs.apply(this,arguments);
        var url = params.url, callback = params.callback, fail=params.fail;

        //Allow cross origin requests.
        var x = this.crossOrigin ? CrossOriginRequest("GET",url) : new XMLHttpRequest();
        if(!this.crossOrigin){
          x.open("GET",url);
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
        var params = parseArgs.apply(this,arguments);
        var url = params.url, callback = params.callback, fail=params.fail;
        var tst = this;
        get.call(this,url,function(responseText){
          try{
            var json_object = JSON.parse(responseText);
            callback(json_object);
          }
          catch(e){
            error("JSON could not be parsed for url '"+url+"'","json");
            if(tst.debug){
                console.error(e.message);
            }
          }
        },fail);
      }

      function post(options){
        var url = options.url, callback = options.callback, fail=options.fail, params = options.params;
        var x = this.crossOrigin ? CrossOriginRequest("POST",url) : new XMLHttpRequest();
        if(!this.crossOrigin){
            x.open("POST",url);
        }
        x.setRequestHeader("Content-type","applications/x-www-form-urlencoded");

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
        x.send(params);
        
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

Toast.getJSON("sample.json",console.log,console.error);

// These parameters determing the naming convention used.
