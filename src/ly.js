(function(root, undefined){
	"use strict"
	if(root.ly) { return; }
	var module_on_list = {};
	var module_off_list = {};
	var AP = Array.prototype;
	var OP = Object.prototype;
	var each = function(object, fn){
		var length = object.length;
		var name = 0;
		if(length === undefined){
			for(name in object){
				if(false === fn.call(object[name], name, object[name])){ break; }
			}
		}else{
			for(;name<length;name++){
				if(false === fn.call(object[name], name, object[name])){ break; }
			}
		}
	};
	var ly = function(config){
		each(config, function(key, src){
			var mod = module_off_list[key];
			if(!mod){
				module_off_list[key] = src;
			}
		});
		lyload.trigger();
	};
	var lyload = {
		on: function(mod){},
		off:function(mod){},
		trigger:function(){

		}
	};
}(this));