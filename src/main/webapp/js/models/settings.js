define([
	'underscore',
	'backbone'
], function(_, Backbone){
	
	var Settings = Backbone.Model.extend({
		defaults: {
		    'jenkinsUrl': "http://localhost:8080/",
		    'refresh': 5
		}
	});

	return Settings;
});
