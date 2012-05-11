~function(global, undefined){
	var GLOBAL_NAMESPACE = "GLOBAL_LYJS_VERSION_NAMESPACE";
	var NAMESPACE = "$";
	var VERSION = "1.0";
	var LYJS = global[NAMESPACE];
	if(!global[GLOBAL_NAMESPACE]){ global[GLOBAL_NAMESPACE] = {};}
	if(global[GLOBAL_NAMESPACE][VERSION]){ return; }
	var timespan = now();
	var types = {};
	var toString = Object.prototype.toString;
    var trim = String.prototype.trim;
    var slice = Array.prototype.slice;
    ("Boolean Number String Function Array Date RegExp Object").replace(/[^\s]+/g, function (j) {
    	types["[object " + j + "]"] = j.toLowerCase();
    });
    function now(){ return (new Date()).getTime(); }
    var $ = global[GLOBAL_NAMESPACE][VERSION] = global[NAMESPACE] = {
    	version:VERSION,
    	type:function(j){
    		return j === null ? String(j) : types[toString.call(j)] || "object";
    	},
    	isFunction: function (j) {
            return $.type(j) === "function";
        },
        isObject: function(j){
            return j !== null && typeof j === "object";
        },
        define: function (ns, handle) {
        	var parent = $;
            if(!handle){handle = ns;ns = $;}
            if(typeof ns === "string"){
                parent = $.namespace(ns);
            }else if(!$.isObject(ns)){
                parent = ns;
            }
            if($.isFunction(handle)){
                handle.call(parent,$);
            }else if($.isObject(handle)){
                $.extend(parent, handle);
            }
        	return $;
        },
        get:function(version){
        	if(version === true){
        		global[NAMESPACE] = LYJS;
        		return $;
        	}
        	return global[GLOBAL_NAMESPACE][version] || $;
        }
    };
    $.define(function($){
    	this.timespan = timespan;
        this.now = now;
    	this.each = function(object, handle) {
            if ($.isFunction(handle)) {
                var length = object.length, isObj = length === undefined, j = 0;
                if (isObj) {
                    for (j in object) {
                        if (handle.call(object[j], j, object[j]) === false) { break; }
                    }
                } else {
                    for (; j < length; j++) {
                        if (handle.call(object[j], j, object[j]) === false) { break; }
                    }
                }
            }
            return object;
        };
    	this.namespace = function(ns){
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
    	};
    	this.extend = function(target, source){
            var args = slice.apply(arguments), i = 1, k;
            var depth = $.type(args[args.length-1]) === "boolean" ? args.pop() : true;
            if(!$.isObject(target) && !$.isFunction(target)){target = {};}
            for(;source = args[i++];){
                for(k in source){
                    var src = target[k], copy = source[k];
                    if(src === copy || copy === target){continue;}
                    if(depth || !(k in target)){
                        if($.isObject(copy)){
                            target[k] = $.extend(src||(copy.length != null?[]:{}),copy,depth); 
                        }else{
                            target[k] = copy;
                        }
                    }
                }
            }
            return target;
        };
        this.compare = function(target, source){
            if(target == null || source == null){ return target === source; }
            return (target == source && target.constructor.toString() == source.constructor);
        };
        this.noop = function(){};
        this.isNumeric = function(j){
            return !isNaN(parseFloat(j)) && isFinite(j);
        };
        this.isArray = function(j){
            return $.type(j) === "array";
        };
        this.isEmptyObject = function(j) {
            for(var key in j){ return false; }
            return true;
        };
        this.isNull = function(j){
            return j === null;
        };
        this.isUndefined = function(j){
            return typeof j === "undefined";
        };
        this.trim = trim ? function(j){
            return j == null ? "" : trim.call(j);
        } : function(j){
            return j == null ? "" : j.toString().replace(/^\s+/,"").replace(/\s+$/,"");
        };
        this.format = function(tpl, data){
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
        };
        this.padLeft = function(j, len, chr, isRight){
            var s = j == null ? "" : j.toString(), l = s.length;
            if(l < len){
                l = new Array(len-l+1).join(chr||"0");
                s = isRight ? (j + l) : (l + j);
            }
            return s;
        };
        this.padRight = function(j, len, chr){
            return this.padLeft(j, len, chr, true);
        };
    }).define("data", function($){
    	var _cache = {}, uuid = 0, sign_id = "data_cache_" + timespan;
        this.has = function(object, key){
            var id = object[sign_id];
            if(!id || !_cache[id]){ return false; }
            object = _cache[id];
            if(key){
                return !!object && (key in object);
            }else{
                return !!object && !$.isEmptyObject(object);
            }
        };
    	this.set = function(object, key, value){
            var id = object[sign_id];
            if(!id){ object[sign_id] = id = ++uuid; }
            if(!_cache[id]){ _cache[id] = {} }
    		if(typeof key === "string"){
    			_cache[id][key] = value;
    		}else{
    			if($.isArray(key)){
    				var d = this;
    				$.each(key,function(i,v){ d.set(object, v) });
    			}else{
    				for(var k in key){
                        this.set(object, k, key[k]);
                    }
    			}
    		}
            return this;
    	};
        this.get = function(object, key){
            var id = object[sign_id];
            if(!id || !_cache[id]){ return; }
            return _cache[id][key];
        };
    }).define("date", function($){
        var week = String.fromCharCode(26085,19968,20108,19977,22235,20116,20845);
        this.format = function(date, fmt){
            if($.type(date) !== "date"){
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
            };
            if(/(y+)/.test(fmt)){
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4-RegExp.$1.length));
            }
            if(/(w)/i.test(fmt)){
                fmt = fmt.replace(RegExp.$1, RegExp.$1=="w"?date.getDay():week.charAt(date.getDay()));
            }
            for(var k in d){
                if(new RegExp("(" + k + ")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length==1?d[k]:("00"+d[k]).substr((d[k]+"").length));
                }
            }
            return fmt;
        };
    }).define("async", function($){
    	var async = this;
    	var doc = global.document;
    	var ajaxSettings = {
    		url: location.href,
			type: "get",
			contentType: "application/x-www-form-urlencoded",
			processData: true,
			async: true
    	};
    	this.ajaxSetup = function(options){
    		if(options.type === "get"){
    			if(options.dataType === "script" || options.dataType === "json"){
    				var script, jsonpCallback;
    				head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
    				options.url = options.url.replace(/([\?|\&]\w+\=)(\?)/,function(a,b,c){
    					jsonpCallback = "jsonpCallback" + $.now();
    					return b + jsonpCallback;
    				});
    				options.xhr = {
    					send:function(_, callback){
    						script = doc.createElement("script");
    						script.async = "async";
    						if(options.charset){
								script.charset = options.charset;
							}
							script.onload = script.onreadystatechange = function(_, isAbort){
								if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState){
									script.onload = script.onreadystatechange = null;
									if(head && script.parentNode){
										head.removeChild(script);
									}
									script = undefined;
									if(!isAbort){
										callback(200, "success");
									}
								}
							};
							script.src = options.url;
							head.insertBefore(script, head.firstChild);
    					},
    					abort:function(){
    						if(script){
    							script.onload(0,1);
    						}
    					}
    				};
    				return options;
    			}
    		}
    	};
    	this.ajax = function(options){
    		$.extend(options, ajaxSettings, false);
    		
    	};
    	$.each(["get","post"], function(i, method){
    		async[method] = function(url, data, callback, type){
    			if($.isFunction(data)){
    				type = callback;
    				callback = data;
    				data = undefined;
    			}
    			return async.ajax({
    				url:url,
    				type:method,
    				data:data,
    				success:callback,
    				dataType:type
    			});
    		};
    	});
    	this.getScript = function(url, callback){
    		this.get(url, undefined, callback, "script");
    	};
    	this.getJSON = function(url, data, callback){
    		this.get(url, data, callback, "json");
    	};
    });
}(this);