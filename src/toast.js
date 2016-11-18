var toast = new (function init_toast(get_p,json_p,post_p){
  "use strict";

  this.crossOrigin = false;

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

  //Passes back the response text to callback, or the fail status to fail.
  function get(){
    //PARAMETER PARSING
    var url = arguments.length >= 1 ? arguments[0] : null, callback = arguments.length >= 2 ? arguments[1] : null, fail = arguments.length >= 3 ? arguments[2] : null;

    if(arguments.length == 0){
      error("No arguments passed", "get");
      return;
    }

    if(typeof arguments[0] === "object"){

        if(this.debug){
          console.log("Argument 0 in function 'get' is an object, setting callback and fail accordingly.");
        }

        if(arguments[0].hasOwnProperty("callback")){callback = arguments[0].callback};
        if(arguments[0].hasOwnProperty("fail")){fail = arguments[0].fail};
        if(arguments[0].hasOwnProperty("url")){url = arguments[0].url};
    }
    //END PARAMETER PARSING

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
                fail(x.status);
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

  }

  function post(){

  }

  this.debug = false;
  this[get_p] = get.bind(this);
  this[json_p] = json.bind(this);
  this[post_p] = post.bind(this);

})("get","json","post");

// These parameters determing the naming convention used.
