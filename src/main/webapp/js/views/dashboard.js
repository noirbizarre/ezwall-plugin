define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/dashboard.html',
  'text!templates/job.html'
], function($, _, Backbone, dashboardTemplate, jobTemplate){

  var Dashboard = {};

  Dashboard.Grid = Backbone.View.extend({
    
    initialize: function() {
      console.log('Dashboard.Grid: initialize');
      _.bindAll(this, 'render', 'addJob', 'resize');
      this.template = $.template(jobTemplate);
      this.collection.on('reset', this.render);
      $(window).resize(this.resize);
      console.log('Dashboard.Grid: initialized');
    },
     
    render: function() {
      console.log('Dashboard.Grid: render');
      this.$el.empty();
      this.collection.each(this.addJob);
      this.resize();
      console.log('Dashboard.Grid: rendered');
      return this;  
    },

    addJob: function(job) {
      $.tmpl(this.template, job.toJSON()).appendTo(this.$el);
    },

    resize: function() {
      if (this.collection.length > 0) {
        var sqrt = Math.sqrt(this.collection.length)
        var nbCols = Math.ceil(sqrt);
        var nbRows = Math.round(sqrt);
        var width = this.$el.width() / nbCols;
        var height = this.$el.height() / nbRows;

        // Remove margins and border
        _.each(['left', 'right'], function(side) {
          width -= this.$('.job').css('margin-'+side).replace('px','');
          width -= this.$('.job').css('border-'+side+'-width').replace('px','');
        });
        _.each(['top', 'bottom'], function(side) {
          height -= this.$('.job').css('margin-'+side).replace('px','');
          height -= this.$('.job').css('border-'+side+'-width').replace('px','');
        });
        this.$('.job').width(width).height(height);
      }
    }

  });

  Dashboard.View = Backbone.View.extend({
    
    el: $('#dashboard'),

    initialize: function() {
      console.log('Dashboard.View: initialize');
      _.bindAll(this,'render');
      this.template = $.template(dashboardTemplate);
      this.grid = new Dashboard.Grid({
        collection: this.model.get('jobs')
      });
      console.log('Dashboard.View: initialized');
    },
     
    render: function() {
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