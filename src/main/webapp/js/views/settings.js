define([
  'jquery',
  'underscore',
  'backbone',
  'views/popup',
  'text!templates/settings.html'
], function($, _, Backbone, Popup, settingsTemplate){

  var Settings = {};

  Settings.CLOSE = 'settings:close';

  Settings.Popup = Backbone.View.extend({
    render: function() {
    	_.bindAll(this, 'ok', 'cancel', 'displayJson');
		$.tmpl(settingsTemplate, this.model.toJSON()).appendTo(this.$el);
		this.$el.dialog({
			// height: 200,
			width: 400,
			title:"Settings",
			modal: true,
			close: this.cancel,
			buttons: [
				{text: 'OK', click: this.ok },
				{text: 'Cancel', click: this.cancel },
				{text: 'JSON', click: this.displayJson }
			]
		});
		console.log('SettingsPopup: rendered');
		return this;  
    },

    close: function() {
		console.log('SettingsPopup: close');
		this.$el.dialog('destroy');
		this.remove();
		this.trigger(Settings.CLOSE);
    },

    ok: function() {
    	console.log('SettingsPopup: ok');
      this.model.set('jenkinsUrl',this.$('#server-url').val());
      this.model.set('refresh',this.$('#refresh').val());
    	this.close();
    },

    cancel: function() {
    	console.log('SettingsPopup: cancel');
    	this.close();
    },

    displayJson: function() {
    	console.log('SettingsPopup: json');
    }

  });

  return Settings;

});
