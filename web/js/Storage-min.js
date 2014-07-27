"object"!=typeof JSON&&(JSON={}),!function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,r,f,o,i,u=gap,p=e[t];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(t)),"function"==typeof rep&&(p=rep.call(e,t,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":case"null":return String(p);case"object":if(!p)return"null";if(gap+=indent,i=[],"[object Array]"===Object.prototype.toString.apply(p)){for(o=p.length,n=0;o>n;n+=1)i[n]=str(n,p)||"null";return f=0===i.length?"[]":gap?"[\n"+gap+i.join(",\n"+gap)+"\n"+u+"]":"["+i.join(",")+"]",gap=u,f}if(rep&&"object"==typeof rep)for(o=rep.length,n=0;o>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],f=str(r,p),f&&i.push(quote(r)+(gap?": ":":")+f));else for(r in p)Object.prototype.hasOwnProperty.call(p,r)&&(f=str(r,p),f&&i.push(quote(r)+(gap?": ":":")+f));return f=0===i.length?"{}":gap?"{\n"+gap+i.join(",\n"+gap)+"\n"+u+"}":"{"+i.join(",")+"}",gap=u,f}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(t,e,n){var r;if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var n,r,f=t[e];if(f&&"object"==typeof f)for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(r=walk(f,n),void 0!==r?f[n]=r:delete f[n]);return reviver.call(t,e,f)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof module&&module.exports?module.exports=t():this[e]=t()}("Storage",function(){var n,e=window.JSON&&window.JSON.stringify&&window.JSON.parse?window.JSON:{stringify:function(e){return e},parse:function(e){return e}},t=function(){var t;try{var i,t,r=new ActiveXObject("htmlfile");r.open(),r.write('<iframe src="/favicon.ico"></iframe>'),r.close(),i=r.frames[0].document,t=i.createElement("div"),i.appendChild(t),t.addBehavior("#default#userData")}catch(n){}return{get:function(r){var i;t.load(r),i=t.getAttribute(r);try{i=e.parse(i)}catch(n){}return i},set:function(r,i,n){if(n){var o=new Date;o.setTime(o.getTime()+1e3*n),t.expires=o.toUTCString()}t.setAttribute(r,e.stringify(i)),t.save(r)},remove:function(e){t.removeAttribute(e),t.save(e)}}},r=function(){var t=(new Date).getTime();for(key in localStorage){var r=localStorage.getItem(key);try{r=e.parse(r)}catch(i){}if(Object.prototype.toString.call(r).toLowerCase().indexOf("array")>0){var n=r[0].expires;n&&/^\d{13,}$/.test(n)&&t>=n&&localStorage.removeItem(key)}}return{get:function(t){var r=localStorage.getItem(t);if(!r)return null;try{r=e.parse(r)}catch(i){}if("object"!=typeof r)return r;var n=r[0].expires;if(n&&/^\d{13,}$/.test(n)){var o=(new Date).getTime();if(o>=n)return localStorage.removeItem(t),null;r.shift()}return r[0]},set:function(t,r,i){var n=[];if(i){var o=(new Date).getTime();n.push({expires:o+1e3*i})}n.push(r),localStorage.setItem(t,e.stringify(n))},remove:function(e){localStorage.removeItem(e)}}},i={get:function(t){var i,r=document.cookie,n=r.indexOf(t+"="),o=r.indexOf(";",n);if(-1==o&&(o=r.length),n>-1){i=r.substring(n+t.length+1,o);try{i=e.parse(i)}catch(a){}return i}return null},set:function(t,r,i,n,o){var n=n||document.domain,o=o||"/",a="";if(i)if(window.ActiveXObject){var f=new Date;f.setTime(f.getTime()+1e3*i),a="expires="+f.toGMTString()}else a="max-age="+i;document.cookie=t+"="+e.stringify(r)+";path="+o+";domain="+n+";"+a},remove:function(e,t,r){var t=t||document.domain,r=r||"/";this.set(e,"",0,t,r)}};return n=window.localStorage?r():t(),{get:n.get,set:n.set,remove:n.remove,cookie:i}});
