define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/settings.html'
], function($, _, Backbone, settingsTemplate){

  var Settings = {};

  Settings.CLOSE = 'settings:close';

  Settings.Popup = Backbone.View.extend({
    render: function() {
    	_.bindAll(this, 'ok', 'cancel');
		$.tmpl(settingsTemplate, this.model.toJSON()).appendTo(this.$el);
		this.$el.dialog({
			width: 400,
			title:"Settings",
			modal: true,
			close: this.cancel,
			buttons: [
				{text: 'OK', click: this.ok },
				{text: 'Cancel', click: this.cancel }
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
    	this.model.set('pollInterval',this.$('#refresh').val());
    	this.close();
    },

    cancel: function() {
    	console.log('SettingsPopup: cancel');
    	this.close();
    }

  });

  return Settings;

});
