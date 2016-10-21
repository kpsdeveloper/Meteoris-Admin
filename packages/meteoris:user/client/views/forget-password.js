var ctrl = new Meteoris.UserController();

Template.meteoris_userForgetPassword.events = {
    'click #btnForgetPassword': function(e, t){
        e.preventDefault();         
        ctrl.forgetPassword(t);
    },        
};

Template.meteoris_confirmcode.events = {
    'click #btnconfirmcode': function(e, t){
        e.preventDefault();         
        ctrl.confirmcode(t);
    },        
};

Template.meteoris_resetpwd.events = {
    'click #btnresetPwd': function(e, t){
        e.preventDefault();         
        ctrl.resetnewPwd(t);
    },        
};