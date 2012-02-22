define([
	'underscore',
	'backbone'
], function(_, Backbone){
		
	var Jenkins = {};

	Jenkins.STATUS_OK = 'ok';
	Jenkins.STATUS_KO = 'ko';
	Jenkins.STATUS_INSTABLE = 'instable';
	Jenkins.STATUS_NONE = 'none';

	Jenkins.Model = Backbone.Model.extend({
		url : function() {
			var url = '%s/api/json'.replace('%s', this.get('url'));
			if (this.tree) {
				url += '?tree=' + this.tree.join(',');
			}
			return url;
		}
	});

	Jenkins.EzWall = Jenkins.Model.extend({
		defaults : {
			url : "http://localhost:8080/ezwall",
			pollInterval : 5,
			version : "NA"
		}
	});

	Jenkins.config = new Jenkins.EzWall();
	
	Jenkins.Build = Jenkins.Model.extend({});
	
	Jenkins.User = Jenkins.Model.extend({});

	Jenkins.Job = Jenkins.Model.extend({
		defaults : {
			name : "My job",
			status : Jenkins.STATUS_NONE,
			building : false
		},
		tree : [
	        "displayName",
	        "name",
	        "url",
	        "buildable",
	        "color",
	        "lastBuild[number,url]"
        ],

		color_regex : /([A-Za-z]+)(_anime)?/,

		parse : function(data) {
			var m = this.color_regex.exec(data.color);

			switch (m[1]) {
			case 'blue':
				data.status = Jenkins.STATUS_OK;
				break;
			case 'red':
				data.status = Jenkins.STATUS_KO;
				break;
			case 'yellow':
				data.status = Jenkins.STATUS_INSTABLE;
				break;
			default:
				break;
			}
			data.building = m[2] != undefined;
			return data;
		}
	});

	Jenkins.JobList = Backbone.Collection.extend({
		model : Jenkins.Job,

		fetchAll : function() {
			this.each(function(job) {
				job.fetch();
			});
		}
	});

	Jenkins.View = Jenkins.Model.extend({
		defaults : {
			name : "All",
			url : "http://localhost:8080/",
			refresh : 10
		},
		
		tree : [
	        "name",
	        "url",
	        "jobs[name,url,color]"
        ],
		
		initialize : function() {
			_.bindAll(this, 'poll', 'updateSettings');
			Jenkins.config.on('change', this.updateSettings, this);
			this.set({
				jobs : new Jenkins.JobList()
			});
			this.poll();
		},
		
		parse : function(data, xhr) {
			this.get('jobs').reset(data.jobs, {
				parse : true
			});
			delete data.jobs;
			return data;
		},
		
		poll : function() {
			var interval = Jenkins.config.get('pollInterval');
			if (interval > 0) {
				this.get('jobs').fetchAll();
				_.delay(this.poll, interval * 1000);
			}
		},
		
		updateSettings : function() {
			if (Jenkins.config.hasChanged('url')) {
				this.set('url', Jenkins.config.get('url') + '/..');
				this.fetch();
			}
		}
		

	});

	return Jenkins;
});
