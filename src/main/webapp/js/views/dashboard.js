define([
  'jquery',
  'underscore',
  'backbone',
  'models/jenkins',
  'models/gravatar',
  'text!templates/dashboard.html',
  'text!templates/job.html',
  'text!templates/user.html'
], function($, _, Backbone, Jenkins, Gravatar, dashboardTemplate, jobTemplate, userTemplate){

	var Dashboard = {};

	Dashboard.Cell = Backbone.View.extend({

		className : 'job',

		initialize : function() {
			_.bindAll(this, 'render');
			this.template = $.template(jobTemplate);
			this.model.on('change', this.render);
			Jenkins.config.on('change:showBuildNumber', this.render);
		},

		render : function() {
			this.$el.empty();
			
			var data = {};
			
			data.job = this.model.toJSON();
			
			data.display = {};
			data.display.buildNumber = Jenkins.config.get('showBuildNumber');
			
			$.tmpl(this.template, data).appendTo(this.$el);
			
			this.$el.addClass('job-status-' + this.model.get('status'));
			this.$el.toggleClass('job-building', this.model.get('building'));
			
			if (this.model.users && this.model.users.length > 0) {
				var userView = new Dashboard.UserView({
					model: this.model.users[0]
				});
				this.$el.append(userView.render().el);
			}
			
			return this;
		}

	});
	
	Dashboard.UserView = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, 'render');
			this.template = $.template(userTemplate);
			this.model.on('change', this.render);
			Jenkins.config.on('change:showUsername', this.render);
			Jenkins.config.on('change:showGravatar', this.render);
		},

		render : function() {
			this.$el.empty();
			
			var data = {};
			
			data.user= this.model.toJSON();
			
			data.display = {};
			data.display.username = Jenkins.config.get('showUsername');
			data.display.gravatar = Jenkins.config.get('showGravatar')
			
			if (this.model.has('email') && data.display.gravatar) {
				
				data.user.gravatar = Gravatar.url(this.model.get('email'), 125 );
			}
			$.tmpl(this.template, data).appendTo(this.$el);
			
			return this;
		}
	});

	Dashboard.Grid = Backbone.View.extend({

		initialize : function() {
			console.log('Dashboard.Grid: initialize');
			_.bindAll(this, 'render', 'addJob', 'resize');
			this.template = $.template(jobTemplate);
			this.collection.on('reset', this.render);
			$(window).resize(this.resize);
			console.log('Dashboard.Grid: initialized');
		},

		render : function() {
			console.log('Dashboard.Grid: render');
			this.$el.empty();
			this.collection.each(this.addJob);
			this.resize();
			this.animate()
			console.log('Dashboard.Grid: rendered');
			return this;
		},

		addJob : function(job) {
			var cell = new Dashboard.Cell({
				model : job
			}).render();
			this.$el.append(cell.el);
		},

		resize : function() {
			if (this.collection.length > 0) {
				var nbCols = 6;
				var nbRows = Math.ceil(this.collection.length / nbCols);
				var width = this.$el.width() / nbCols;
				var height = this.$el.height() / nbRows;

				// Remove margins and border
				_.each([ 'left', 'right' ], function(side) {
					width -= this.$('.job').css('margin-' + side).replace('px', '');
					width -= this.$('.job').css('border-' + side + '-width').replace('px', '');
				});
				_.each([ 'top', 'bottom' ], function(side) {
					height -= this.$('.job').css('margin-' + side).replace('px', '');
					height -= this.$('.job').css('border-' + side + '-width').replace('px', '');
				});
				this.$('.job').width(width).height(height);
			}
		},

		animate : function() {
			if (this.timer) {
				clearInterval(this.timer);
				delete this.timer;
			}
			this.timer = setInterval(this._animation, 1500);
		},

		_animation : function() {
			this.$('.job-building').toggleClass('job-glow');
		}

	});

	Dashboard.View = Backbone.View.extend({

		el : $('#dashboard'),

		initialize : function() {
			console.log('Dashboard.View: initialize');
			_.bindAll(this, 'render');
			this.template = $.template(dashboardTemplate);
			this.grid = new Dashboard.Grid({
				collection : this.model.get('jobs')
			});
			console.log('Dashboard.View: initialized');
		},

		render : function() {
			console.log('Dashboard.View: render');
			this.$el.empty();
			$.tmpl(this.template, {}).appendTo(this.$el);
			this.grid.setElement(this.$('#build-grid')[0]);
			this.grid.render();
			console.log('Dashboard.View: rendered');
			return this;
		}

	});

	return Dashboard;

});
