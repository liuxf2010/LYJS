/*
	https://github.com/wedteam/qwrap/blob/master/resource/js/core/module.h.js
	http://dev.qwrap.com/download/latest/apps/qwrap-debug.js
	https://github.com/RubyLouvre/mass-Framework/blob/master/src/mass.js
*/
(function(window, undefined){
	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	var class2type = {};
	('Object String Number Boolean Array Function Date RegExp').replace(/[^\s]+/g,function(t){
		class2type['[object ' + t + ']'] = t.toLowerCase()
	});
	var Y = {
		noop:function(){},
		mix:function(target, source, ovr){
			var key;
			for(key in source){
				if(target !== source[key] && (ovr !== false || !(key in target)) && hasOwn.call(source, key)){
					target[key] = source[key];
				}
			}
			return target;
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
		}
	};
}(this));