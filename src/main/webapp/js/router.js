define([
  'backbone',
  'views/menu',
  'views/settings',
  'views/dashboard',
  'views/about',
  'models/jenkins'
], function(Backbone, Menu, Settings, Dashboard, About, Jenkins){
	  var AppRouter = Backbone.Router.extend({
		routes : {
			'settings' : 'showSettings',
			'about' : 'showAbout',

			// Default
			'' : 'showHome'
		},

		initialize : function() {
			console.log('AppRouter: initiliaze');

			// Initialize menu
			this.menu = new Menu;
			this.menu.render();
			this.menu.on('menu:refresh', function() {
				this.view.fetch();
			}, this);
			this.menu.on('menu:settings', function() {
				this.navigate('settings', true);
			}, this);
			this.menu.on('menu:about', function() {
				this.navigate('about', true);
			}, this);

			// Inialize the jenkins View
			this.view = new Jenkins.View();

			// Initialize Dashboard
			this.dashboard = new Dashboard.View({
				model : this.view
			});
			this.dashboard.render();

			// Bootstrap ezWall config
			Jenkins.config.set('url', '.');
			Jenkins.config.fetch();

			console.log('AppRouter: initiliazed');
		},

		showHome : function() {
			console.log('AppRouter: home');
		},

		showSettings : function() {
			console.log('AppRouter: settings');
			var popup = new Settings.Popup({
				model : Jenkins.config
			});
			popup.render();
			popup.on(Settings.CLOSE, function() {
				this.navigate('', true);
			}, this);
		},

		showAbout : function() {
			console.log('AppRouter: about');

			var popup = new About.Popup;
			popup.render();
			popup.on(About.CLOSE, function() {
				this.navigate('', true);
			}, this);
		}

	});

	return new AppRouter();

});