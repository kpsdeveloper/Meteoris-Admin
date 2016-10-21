var ctrl = new Meteoris.AppController();
Meteor.startup(function() {
     Session.set('LANG','en');
});
Tracker.autorun(function () {
    TAPi18n.setLanguage(Session.get('LANG'));
});

Template.mainLayout.onCreated(function() {
    var self = this;
    self.autorun(function() {
        //self.subscribe('meteoris_themeAdmin', ctrl.getId());
        //TAPi18n.subscribe('Categories');
    });    
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

Template.index.events({
    'click #upload': function(e,tpl){
        console.log('upload');
        filepicker.setKey("ACTP7A0fnQou2s5L4f9FBz");
        filepicker.pick({
            mimetype: 'image/*', /* Images only */
            maxSize: 1024 * 1024 * 5, /* 5mb */
            imageMax: [1500, 1500], /* 1500x1500px */
            cropRatio: 1/1, /* Perfect squares */
            services: ['*']  /*All available third-parties*/ 
        }, function(blob){
            // Returned Stuff
            var filename = blob.filename;
            var url = blob.url;
            var id = blob.id;
            var isWriteable = blob.isWriteable;
            var mimetype = blob.mimetype;
            var size = blob.size;

            console.log(blob)
        });
    }  
});
Template.index.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('banner');
    });    
});
