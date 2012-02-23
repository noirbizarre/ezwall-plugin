define([
  'jquery',
  'underscore',
  'backbone',
  'md5'
], function($, _, Backbone, MD5){
				
	var Gravatar = {};
	
	Gravatar.hash = function(email) {
		return MD5.hash($.trim(email.toLowerCase()));
	};
	
	Gravatar.url = function(email, size) {
		var url = 'http://www.gravatar.com/avatar/';
		url += this.hash(email);
		if (size) {
			url += '?s=';
			url += size;
		}
		return url;
	};

	return Gravatar;

});