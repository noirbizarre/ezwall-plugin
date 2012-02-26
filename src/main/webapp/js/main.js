console.log('EZWall starting...');
require.config({
	paths: {
		jquery: 'libs/jquery-1.7.1.min',
		jqueryui: 'libs/jquery-ui-1.8.17.min',
		jquerytmpl: 'libs/jquery.tmpl.min',
		underscore: 'libs/underscore-amd-min',
		backbone: 'libs/backbone-0.9.1-amd-min',
		md5: 'libs/spark-md5.amd'
	}
});

require([
	'order!jquery',
	'order!underscore',
	'order!backbone',
	'order!jquerytmpl',
	'order!jqueryui',
	'order!app'
], function($, _, backbone, jqueryTmpl, jqueryUi, App){
	App.start();
});