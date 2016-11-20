# Toast
Toast is a library designed to simplify making XMLHttpRequests.  I've found myself including jquery just for ajax many times and thats a huge amount of overhead. I wanted to create a library that simplifies making these requests while still being lightweight and simple.

# Usage

Using Toast is really easy.  

Step 1:
Include the javascript file list under the dist folder in your webpage.
```html
<script src="dist/toast-1.0.0.min.js"></script>
```
Step 2:
Make requests.  You can make calls to toast either listing your parameters in a comma separated way, or using an options JSON object.  Here are some sample ones:
```javascript
    /*
      You can list all of your parameters out by comma
    */
    // Response is plain text
    // Errors are logged to console.error
    // url, success, fail
    Toast.getJSON("sample.html",function(data){
        document.getElementById("sample").innerHTML = data;
    }, console.error);
    
    // Response is parsed into json form 'sample.json'
    // Errors are logged to console.error
    //  url, success, fail
    Toast.getJSON("sample.json",function(data){
        document.getElementById("sample").innerHTML = JSON.stringify(data);
    }, console.error);
    
    
    
```
