var ctrl = new Meteoris.AppController();

Template.mainLayout.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('meteoris_themeAdmin', ctrl.getId());
        //Meteor.call('getRemoteAddress', function(err,url){ Session.set('ABSOLUTEURL', url)}); 
    }); 

});

Template.mainLayout.helpers({
    model: function(){
        //return ctrl.main().model;
    },    
});