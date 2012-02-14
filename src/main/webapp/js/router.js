define([
  'backbone',
  'views/menu',
  'views/settings',
  'views/dashboard',
  'views/about',
  'models/jenkins',
  'models/settings'
], function(Backbone, Menu, Settings, Dashboard, About, Jenkins, SettingsModel){
  var AppRouter = Backbone.Router.extend({
    routes: {
      'settings': 'showSettings',
      'about': 'showAbout',
      // Default
      '': 'showHome'
    },

    initialize: function() {
      console.log('AppRouter: initiliaze');

      // Initialize settings
      _.bindAll(this,'loadSettings');
      this.settings = new SettingsModel({
    	  jenkinsUrl: '..'
      });
      this.settings.on('change', this.loadSettings, this);

      // Initialize menu
      this.menu = new Menu;
      this.menu.render();
      this.menu.on('menu:settings', function(){
        this.navigate('settings', true);
      }, this);
      this.menu.on('menu:about', function(){
        this.navigate('about', true);
      }, this);

      // Initialize Dashboard
      this.view = new Jenkins.View;
      this.dashboard = new Dashboard.View({model: this.view});
      this.dashboard.render();
      
      this.loadSettings();
      this.view.poll();

      console.log('AppRouter: initiliazed');
    },

    showHome: function() {
      console.log('AppRouter: home');
    },

    showSettings: function(){
      console.log('AppRouter: settings');
      var popup = new Settings.Popup({
        model: this.settings
      });
      popup.render();
      popup.on(Settings.CLOSE, function(){
        this.navigate('', true);
      }, this);
    },

    showAbout: function() {
      console.log('AppRouter: about');

      var popup = new About.Popup;
      popup.render();
      popup.on(About.CLOSE, function(){
        this.navigate('', true);
      }, this);
    },

    loadSettings: function() {
      this.view.set('url', this.settings.get('jenkinsUrl'));
      this.view.set('refresh', this.settings.get('refresh'));
    }
  });

  return new AppRouter();

});