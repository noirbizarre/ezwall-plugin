define([
  'backbone',
  'router',
], function(Backbone, Router) {

  var start = function(){
    // Pass in our Router module and call it's initialize function
    // Backbone.history.start({pushState: true});
    // Router.navigate('');
    Backbone.history.start();
    console.log('Buildmon started');
  };

  return {
    start: start
  };

});
