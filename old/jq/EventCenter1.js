/*
	ssddi456
*/
(function ( $ ) {
		if ( window.ec ) {
			return;
		}
		var debug = window.debug.ec  = console && window.debug.ec && true;
		// use jQuery's Callbacks to build eventCenter
		var eclist = {};
		
		function nameSpaceFiler ( type, list ) {
			var type = type.split(':');
			var namespace;
			if ( type.length === 1 ) {
				type = type[0];
				if ( !list[type] ) {
					list [ type ] = $.Callbacks ( "memory" );
				}
				return list[type];
			} else {
				if ( !list[type[0]] ){
					list[type[0]] = {};
				}
				namespace = list[type[0]];
				if ( !namespace[type[1]]){
					if ( type[1].match('Ready') ) {
						namespace[ type[1] ] = $.Callbacks ();
					} else {
						namespace[ type[1] ] = $.Callbacks ( "memory" );
					}
				}
				return namespace[type[1]];
			}
		}
		// simply ec
		var eventCenter = window.ec = {
			on : function  ( type, handle ) {
				debug && console.log( "listen", type, handle );
				nameSpaceFiler( type, eclist ).add( handle );
			},
			fire : function  ( type, data, callback ) {
				debug && console.log( "fire", type, data, callback );
				nameSpaceFiler( type, eclist ).fire ( data, callback );
			},
			remove : function  ( type, handle  ) {
				debug && console.log( "remove", type, handle );
				nameSpaceFiler( type, eclist ).remove ( handle );
			},
			once : function  ( type, handle ) {
				debug && console.log( "once", type, handle );
				var evt = nameSpaceFiler( type,eclist);
				var onetimeEvent = function  ( data, callback ) {
					handle ( data, callback );
					evt.remove ( onetimeEvent );
				}
				evt.add( onetimeEvent );
			}
		}
		
	})(jQuery);
