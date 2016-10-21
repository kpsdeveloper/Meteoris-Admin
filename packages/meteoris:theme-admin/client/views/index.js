//var ctrl = new Meteoris.AppController();
Meteor.startup(function() {
     Session.set('LANG','en');
});
/*
Tracker.autorun(function () {
    TAPi18n.setLanguage(Session.get('LANG'));
});

Template.index.onCreated(function() {
    Meteor.Loader.loadJs("//api.filestackapi.com/filestack.js");
});


Template.index.helpers({
    model: function(){
        console.log('Djinn');

    },
    test: function(){
    	var data = ctrl.test().model;
    	return {data:data}
    }    
});

*/
