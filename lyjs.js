!function(global, undefined){
	var NAME = "$";
	var VERSION = "1.0";
	var LYJS = global[NAME];
	var TIMESPANE = Now();
	var types = {};
    var cnWeeks = String.fromCharCode(26085,19968,20108,19977,22235,20116,20845);
	var toString = Object.prototype.toString;
    var trim = String.prototype.trim;
    var slice = Array.prototype.slice;
    var doc = global.document;
    var html = doc.documentElement;
    var setTimeout = global.setTimeout;
    var setInterval = global.setInterval;
    var JSON = global.JSON;
    var DOMParser = global.DOMParser;
    var ActiveXObject = global.ActiveXObject;
    var XMLHttpRequest = global.XMLHttpRequest;
    var rvalidchars = /^[\],:{}\s]*$/;
    var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
    var msie6 = !('1'[0]) && !global.XMLHttpRequest;
    ("Boolean Number String Function Array Date RegExp Object").replace(/[^\s]+/g, function (j) {
    	types["[object " + j + "]"] = j.toLowerCase();
    });
    if(msie6){doc.execCommand("BackgroundImageCache",false,true);}
    function Now(){ return (new Date()).getTime(); }
    var $ = global[NAME] = function(object, context){
    	if($.isFunction(object)){
    		$.ready(object, context);
    	}else{
    		return new $.fn.init(object, context);
    	}
    }, getTypes = function(j, n){
        var name = (j === null ? String(j) : types[toString.call(j)] || "object");
        if(n){ return n===name; }
        return name;
    }, isObject = function(j){ return j!==null && typeof j==="object" };
    $.fn = $.prototype = {
        length: 0,
        init: function(object, context){}
    };
    $.fn.init.prototype = $.prototype;
    $.extend = $.fn.extend = function(target, source){
        var args = slice.apply(arguments), i = 1, k = args.length;
        var depth = getTypes(args[k-1], "boolean") ? (--k,args.pop()) : true;
        if(k == 1){ target = this; i = 0; }else if(k < 1){ return this; }
        if(!isObject(target) && !getTypes(target,"function")){target = {};}
        for(;source = args[i++];){
            for(k in source){
                var src = target[k], copy = source[k];
                if(src === copy || copy === target){continue;}
                if(depth || !(k in target)){
                    if(isObject(copy)){
                        target[k] = $.extend(src||(copy.length != null?[]:{}),copy,depth); 
                    }else{
                        target[k] = copy;
                    }
                }
            }
        }
        return target;
    };
    $.extend({
        version: VERSION,
        timespan: TIMESPANE,
        now: Now,
        noop: function(){},
        error: function(msg){
            throw new Error(msg);
        },
        trim: trim ? function(j){
            return j===null?"":trim.call(j);
        } : function(j){
            if(j===null){ return ""; }else{
                j = j.toString().replace(/^\s+/,"");
                var len = j.length, space = /\S/;
                while(!space.test(j.charAt(--len)));
                return j.substr(0,len+1);
            }
        },
        each: function(object, fn){
            if ($.isFunction(fn)) {
                var length = object.length, isObj = length === undefined, j = 0;
                if (isObj) {
                    for (j in object) {
                        if (fn.call(object[j], j, object[j]) === false) { break; }
                    }
                } else {
                    for (; j < length; j++) {
                        if (fn.call(object[j], j, object[j]) === false) { break; }
                    }
                }
            }
            return object;
        },
        define: function(ns, handle){
            var parent = $;
            if(!handle){handle = ns;ns = $;}
            if(typeof ns === "string"){
                parent = $.namespace(ns);
            }else if(isObject(ns)){
                parent = ns;
            }
            if($.isFunction(handle)){
                handle.call(parent,$);
            }else if(isObject(handle)){
                $.extend(parent, handle);
            }
            return $;
        },
        namespace: function(ns){
            if (typeof ns === "string") {
                var parent = $, nss = ns.split(".");
                if (ns.charAt(0) === ".") {
                    parent = global;
                    nss.shift();
                }
                $.each(nss, function (i, n) {
                    parent[n] = parent[n] || {};
                    parent = parent[n];
                });
                return parent;
            }
            return ns;
        },
        compare: function(target, source){
            if(target == null || source == null){ return target === source; }
            return (target == source && target.constructor.toString() == source.constructor);
        },
        type: getTypes,
        isObject: isObject,
        isNumeric: function(j){
            return !isNaN(parseFloat(j)) && isFinite(j);
        },
        isFunction: function(j){
            return getTypes(j, "function");
        },
        isArray: function(j){
            return getTypes(j, "array");
        },
        isEmptyObject: function(j) {
            for(var key in j){ return false; }
            return true;
        },
        isUndefined: function(j){
            return typeof j === "undefined";
        },
        format: function(tpl, data){
            var that = this;
            return tpl == null ? "" : tpl.toString().replace(/{([.\w]+)}/g, function(a,b,c){
                if(b.indexOf(".")>-1){
                    b = b.split(".");
                    c = b.shift();
                    b = "{" + b.join(".") + "}";
                    return that.format(b, data[c]);
                }else{
                    return data[b] || "";
                }
            });
        },
        dateFmt: function(date, fmt){
            if(getTypes(date) !== "date"){
                fmt = date;
                date = new Date();
            }
            var d = {
                "M+":date.getMonth() + 1,
                "d+":date.getDate(),
                "H+":date.getHours(),
                "m+":date.getMinutes(),
                "s+":date.getSeconds(),
                "S":date.getMilliseconds()
            }, k;
            if(/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4-RegExp.$1.length));
            }
            if(/(w)/i.test(fmt)){
                fmt = fmt.replace(RegExp.$1, RegExp.$1=="w"?date.getDay():cnWeeks.charAt(date.getDay()));
            }
            for(k in d){
                if(new RegExp("(" + k + ")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length==1?d[k]:("00"+d[k]).substr((d[k]+"").length));
                }
            }
            return fmt;
        },
        padLeft: function(j, len, chr, isRight){
            var s = j == null ? "" : j.toString(), l = s.length;
            if(l < len){
                l = new Array(len-l+1).join(chr||"0");
                s = isRight ? (j + l) : (l + j);
            }
            return s;
        },
        padRight: function(j, len, chr){
            return this.padLeft(j, len, chr, true);
        },
        parseJSON: function(data) {
            if(typeof data !== "string" || !data){
                return null;
            }
            data = $.trim(data);
            if(JSON && JSON.parse){
                return JSON.parse(data);
            }
            if(rvalidchars.test(data.replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, ""))) {
                return (new Function("return " + data))();
            }
            $.error("Invalid JSON: " + data);
        },
        parseXML: function(data) {
            var xml, tmp;
            try {
                if(DOMParser){
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch(e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                $.error("Invalid XML: " + data);
            }
            return xml;
        },
        get: function(deep){
            if(deep === true){ global[NAME] = LYJS; }
            return $;
        }
    });
    $.define(function($){
    	var DOMReady = false;
    	var readyList;
        var DOMContentLoaded;
        this.MSIE6 = msie6;
        this.MSIE = msie6 || (!+"\v1");
        this.Queue = Queue;
    	this.ready = function(fn){
    		bindReady();
            readyList.done(fn);
            return this;
    	};
        function bindReady(){
            if(readyList){ return; }
            readyList = Queue();
            if(doc.readyState === "complete"){
                return setTimeout(fireReady, 1);
            }
            if(doc.addEventListener){
                DOMContentLoaded = function() {
                    doc.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    fireReady();
                };
                doc.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                global.addEventListener("load", fireReady, false);
            }else if(doc.attachEvent){
                DOMContentLoaded = function() {
                    if(doc.readyState === "complete"){
                        doc.detachEvent("onreadystatechange", DOMContentLoaded);
                        fireReady();
                    }
                };
                doc.attachEvent("onreadystatechange", DOMContentLoaded);
                global.attachEvent("onload", fireReady);
            }
            var toplevel = false;
            try {
                toplevel = global.frameElement == null;
            } catch(e) {}
            if(doc.documentElement.doScroll && toplevel){
                doScrollCheck();
            }
        }
        function fireReady(){
            if(!DOMReady){
                if(!doc.body){ return setTimeout(fireReady,1); }
                DOMReady = true;
                readyList.fireWith(doc, [$]);
            }
        }
        function doScrollCheck(){
            if(DOMReady){ return; }
            try{
                doc.documentElement.doScroll("left");
            }catch(e){
                setTimeout(doScrollCheck,1);
                return;
            }
            fireReady();
        }
        function Queue(){
            var callbacks = [];
            var fired, firing, cancelled;
            var queue = {
                done:function(){
                    if(!cancelled){
                        var args = arguments;
                        var i = 0, length = args.length, elem, type, _fired;
                        if(fired){
                            _fired = fired;
                            fired = 0;
                        }
                        while(i<length){
                            elem = args[i++];
                            type = getTypes(elem);
                            if(type === "array"){
                                queue.done.apply(queue, elem);
                            }else if(type === "function"){
                                callbacks[callbacks.length] = elem;
                            }
                        }
                        if(_fired){
                            queue.fireWith(_fired[0], _fired[1]);
                        }
                    }
                    return this;
                },
                fireWith:function(context, args){
                    if(!cancelled && !fired && !firing){
                        args = args || [];
                        firing = 1;
                        try{
                            while(callbacks[0]){
                                callbacks.shift().apply(context, args);
                            }
                        }finally{
                            fired = [context, args];
                            firing = 0;
                        }
                    }
                    return this;
                },
                fire:function(){
                    queue.fireWith(this, arguments);
                    return this;
                },
                isFired:function(){
                    return !!(firing || fired);
                },
                cancel:function(){
                    cancelled = 1;
                    callbacks = [];
                    return this;
                }
            };
            return queue;
        }
    }).define(function($){
        var log = global.console && global.console.log;
        var logCache = [];
        this.debug = false;
        this.log = function(msg){
            if(!this.debug){return msg;}
            if(log){ log(msg); }else{
                logCache[logCache.length] = msg;
            }
        };
        this.log.flash = function(){
            var str = logCache.join("\r\n");
            logCache.length = 0;
            return str;
        };
    }).define(function($){
        var cache = {};
        var guid_key = "lyjsData" + Now();
        var guid = 0;
        var fnData = this.data = function(object, name, data){
            var id = object[guid_key];
            if(!id){
                object[guid_key] = id = ++guid;
            }
            if(!cache[id]){ cache[id] = {}; }
            if(typeof name === "string"){
                name = "@" + name;
            }else if(typeof name === "object"){
                data = $.extend(data, name);
                name = "lyjs_data";
            }else{
                data = name;
                name = "lyjs_data";
            }
            if(data === undefined){
                return cache[id][name];
            }else{
                cache[id][name] = data;
            }
            return proData;
        };
        var proData = {
            has:function(object){
                object = object[guid_key] && cache[object[guid_key]];
                return !!object && !$.isEmptyObject(object);
            },
            set:function(){
                return fnData.apply(fnData, arguments);
            },
            remove:function(object, name){
                var id = object[guid_key];
                object = cache[id];
                if(!id || !object){return;}
                if(typeof name === "string"){
                    name = "@" + name;
                    delete object[name];
                }else if(name === undefined){
                    delete object["lyjs_data"];
                }else if(typeof name === "object"){
                    $.each(name, function(k){
                        delete object[k];
                    });
                }
                return fnData;
            }
        };
        $.extend(fnData, proData);
    });
}(this);