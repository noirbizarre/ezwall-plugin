define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/menu.html'
], function($, _, Backbone, menuTemplate){
				
	var Menu = Backbone.View.extend({

		el : $('#header'),

		initialize : function() {
			console.log('Menu: initialize');
			_.bindAll(this, 'render', 'showMenu', 'hideMenu',
					'onVisble', 'onHidden');
			console.log('Menu: initialized');
			this.model.on('change:name', this.render);
			this._visible = false;
		},

		render : function() {
			this.$el.empty();
			console.log('Menu: render');
			$.tmpl(menuTemplate, this.model.toJSON()).appendTo(this.el);
			//this.$('.menu-button').button();
			this.$( '#refresh-button' ).button({ icons: {primary:'ui-icon-refresh'}});
			this.$( '#settings-button' ).button({ icons: {primary:'ui-icon-wrench'}});
			this.$( '#about-button' ).button({ icons: {primary:'ui-icon-help'}});
			$('#header-display-zone').mouseenter(this.showMenu);
			this.$el.mouseleave(this.hideMenu);
			console.log('Menu: rendered');
			return this;
		},

		events : {
			"click #hide-button" : "hideMenu",
			"click #refresh-button" : "refresh",
			"click #settings-button" : "displaySettings",
			"click #about-button" : "displayAbout"
		},

		showMenu : function() {
			if (!this._visible) {
				this.$el.slideDown('fast', this.onVisble);
			}
		},

		hideMenu : function() {
			if (this._visible) {
				this.$el.slideUp('fast', this.onHidden);
			}
		},

		onVisble : function() {
			this._visible = true;
		},

		onHidden : function() {
			this._visible = false;
		},

		refresh : function(event) {
			console.log('Menu: refresh');
			this.trigger('menu:refresh');
		},

		displaySettings : function(event) {
			console.log('Menu: displaySettings');
			this.trigger('menu:settings');
		},

		displayAbout : function(event) {
			console.log('Menu: displayAbout');
			this.trigger('menu:about');
		}

	});

	return Menu;

});