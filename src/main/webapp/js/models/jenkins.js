define([
	'underscore',
	'backbone'
], function(_, Backbone){
	
	var Jenkins = {};

	Jenkins.Model = Backbone.Model.extend({
		url: function() {
			return '%s/api/json'.replace('%s', this.get('url'));
		}
	});

	Jenkins.Job = Jenkins.Model.extend({
	    defaults: {
		    name: "My job",
		},
		status: function() {
			switch (this.get('color')) {
				case 'blue':
					return 'ok';
					break;
				case 'red':
					return 'ko';
					break;
				case 'yellow':
					return 'instable';
					break;
				case 'blue_anime':
				case 'red_anime':
				case 'grey_anime':
				case 'yellow_anime':
					return 'building';
					break;
				default:
					return 'no';
					break;
			}
		}
	});

	Jenkins.JobList = Backbone.Collection.extend({
	    model: Jenkins.Job
	});

	Jenkins.View = Jenkins.Model.extend({
	    defaults: {
		    name: "All",
		    url: "http://localhost:8080/",
		    refresh: 10
		},
		initialize: function() {
			this.set({
				jobs: new Jenkins.JobList()
			});
			_.bindAll(this, 'poll');
		},
		parse: function(resp, xhr) {
			this.get('jobs').reset(resp.jobs);
		},
		poll: function() {
			this.fetch();
			_.delay(this.poll, this.get('refresh')*1000);
		}
	});

	Jenkins.ViewList = Backbone.Collection.extend({
	    model: Jenkins.View
	});

	return Jenkins;
});
