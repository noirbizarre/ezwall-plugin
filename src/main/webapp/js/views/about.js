define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about.html'
], function($, _, Backbone, aboutTmpl){

  var About = {};

  About.CLOSE = 'about:close';

  About.Popup = Backbone.View.extend({

    render: function() {
      _.bindAll(this, 'close');
      $.tmpl(aboutTmpl, {}).appendTo(this.$el);
      this.$el.dialog({
        title:"EzWall",
        modal: true,
        close: this.close
      });
      console.log('AboutPopup: rendered');
      return this;  
    },

    close: function() {
      console.log('AboutPopup: close');
      this.$el.dialog('destroy');
      this.remove();
      this.trigger(About.CLOSE);
    },

  });

  return About;

});
