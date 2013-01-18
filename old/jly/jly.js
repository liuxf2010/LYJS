/*
	https://github.com/wedteam/qwrap/blob/master/resource/js/core/module.h.js
	http://dev.qwrap.com/download/latest/apps/qwrap-debug.js
	https://github.com/RubyLouvre/mass-Framework/blob/master/src/mass.js
*/
(function(root, undefined){
	var hasOwn = Object.prototype.hasOwnProperty;
	var __jly = root.jly;
	var Y = root.jly = {
		noop:function(){},
		hasOwn:function(object, key){
			return hasOwn.call(object, key);
		},
		mix:function(target, source, ovr){
			var key;
			for(key in source){
				if((ovr !== false || !(key in target)) && hasOwn.call(source, key)){
					target[key] = source[key];
				}
			}
			return target;
		},
		namespace:function(ns){
			if (typeof ns === 'string') {
                var parent = Y, nss = ns.split('.');
                if (ns.charAt(0) === '.') {
                    parent = root;
                    nss.shift();
                }
                Y.each(nss, function (i, n) {
                    parent[n] = parent[n] || {};
                    parent = parent[n];
                });
                return parent;
            }
            return ns;
		},
		each:function(object, fn){
			if(fn && fn.call){
				var length = object.length;
				var j = 0;
				if(length === undefined){
					for(j in object){
						if(fn.call(object[j], j, object[j]) === false){ break; }
					}
				}else{
					for(;j < length;j++){
						if(fn.call(object[j], j, object[j]) === false){ break; }
					}
				}
			}
			return Y;
		},
		error:function(e, type){
			type = type || Error;
			throw new type(e);
		}
	};
}(this));

(function(root, undefined){
	var jly = root.jly;
	var lang = jly.namespace('lang');
	var toString = Object.prototype.toString;
	var class2type = {};
	('Object String Number Boolean Array Function Date RegExp').replace(/[^\s]+/g,function(t){
		class2type['[object ' + t + ']'] = t.toLowerCase();
	});
	jly.mix(lang, {
		type:function(j){
			return j == null ? String(j) : class2type[toString.call(j)] || 'object';
		},
		isPlainObject:function(j){
			if(j != null && j.constructor != null){
				return lang.type(j) === 'object';
			}
			return false;
		},
		isObject:function(j){
			return j != null && typeof j === 'object';
		},
		isString:function(j){
			return lang.type(j) === 'string';
		},
		isFunction:function(j){
			return lang.type(j) === 'function';
		},
		isArray:Array.isArray || function(j){
			return lang.type(j) === 'array';
		},
		isArrayLike:function(j){
			return !!j && typeof j == 'object' && j.nodeType != 1 && typeof j.length == 'number';
		},
		isNumeric: function (j) {
            return !isNaN(parseFloat(j)) && isFinite(j);
        },
        isElement:function(j){
        	return !!j && j.nodeType === 1;
        }
	});
}(this));