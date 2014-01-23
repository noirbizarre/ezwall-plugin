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
			var url = this.get('url');
			if (!url) {
				url = getValue(this.collection, 'url') || getValue(this, 'urlRoot');
				url += url.charAt(url.length - 1) == '/' ? '' : '/';
				url += encodeURIComponent(this.id);
			}
			url += url.charAt(url.length - 1) == '/' ? '' : '/';
			if (this.job_source) {
				url += this.job_source()
			}
			url += 'api/json';
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
			jobViewSource : $.url(true).param('jobViewSource'),
			version : "NA"
		}
	});

	Jenkins.config = new Jenkins.EzWall();
	
	Jenkins.Build = Jenkins.Model.extend({});
	
	Jenkins.User = Jenkins.Model.extend({
		parse : function(data) {
			data.url = data.absoluteUrl;
			delete data.absoluteUrl;
			
			for (var idx in data.property) {
				var p = data.property[idx];
				if ('address' in p) {
					data.email = p.address;
					break;
				}
			}
			delete data.property;
			
			return data;
		}
	});
	
	Jenkins.UserList = Backbone.Collection.extend({
		model : Jenkins.User,
		url: function() {
			return Jenkins.config.get('rootUrl') + '/user';
		},
		getOrFetch: function(id) {
			var user = this.get(id);
			if (!user) {
				user = this.add({id:id}).get(id);
				user.fetch();
			}
			return user;
		}
	});
	
	Jenkins.users = new Jenkins.UserList();

	Jenkins.Job = Jenkins.Model.extend({
		defaults : {
			name : "My job",
			status : Jenkins.STATUS_NONE,
			building : false
		},
		job_source : false,
		tree : [
			"displayName",
			"name",
			"url",
			"buildable",
			"color",
			"lastBuild[number,url,actions[causes[userId]]]"
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
			
			if (data.lastBuild) {
				data.lastBuild.users = [];
				this.users = []
				for (var idx_action in data.lastBuild.actions) {
					var action = data.lastBuild.actions[idx_action];
					for (var idx_cause in action.causes) {
						var cause = action.causes[idx_cause];
						if ('userId' in cause && cause.userId) {
							data.lastBuild.users.push(cause.userId);
							this.users.push(Jenkins.users.getOrFetch(cause.userId)); // Cache it
						}
					}
				}
				delete data.lastBuild.actions;
			}
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
			_.bindAll(this, 'poll', 'updateSettings', 'fetchJobs');
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

		job_source : function() {
			var source = Jenkins.config.get('jobViewSource');
			if(source) {
				return 'view/' + source + '/';
			}
			return '';
		},
		
		updateSettings : function() {
			if (Jenkins.config.hasChanged('url')) {
				this.set('url', Jenkins.config.get('url') + '/..');
				this.fetchAll();
			}
			if (Jenkins.config.hasChanged('jobViewSource')) {
				this.set('url', Jenkins.config.get('url') + '/..');
				this.fetchAll();
			}
		},
		
		fetchAll: function() {
			this.fetch({
				success: this.fetchJobs
			});
		},
		
		fetchJobs : function() {
			this.get('jobs').fetchAll();
		}
		

	});
	
	// Helper function to get a value from a Backbone object as a property
	// or as a function.
	var getValue = function(object, prop) {
		if (!(object && object[prop])) return null;
		return _.isFunction(object[prop]) ? object[prop]() : object[prop];
	};

	return Jenkins;
});
