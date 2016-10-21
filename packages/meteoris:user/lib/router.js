var userRoutes = FlowRouter.group({
    prefix: '/user',
    name: 'meteoris',
    triggersEnter: [function(context, redirect) {
            authenticating(context.path);
        }]
});

/* router level validation, only allow user with group "admin" to access this page */
function authenticating(path) {
    var except = [
        '/user/login',
        '/user/register',
        '/user/forget-password',
        '/user/confirmcode',
        '/user/newpassword'
    ];
    if (except.indexOf(path) == -1) {
        if (user = Meteor.user()) {
            if(user.profile.group != 'admin'){
                Meteoris.Flash.set("danger", "403 Unauthenticated");
                FlowRouter.go("/");
            }
        }
    
    }else{
        if( Meteor.userId() ){
            FlowRouter.go("/");
        }
    }
}

/* USERS */
userRoutes.route('/', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userIndex"});
    },
});

userRoutes.route('/login', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminLogin', {content: "meteoris_userLogin"});
    },
});

userRoutes.route('/register', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminRegister', {content: "meteoris_userRegister"});
    },
});

userRoutes.route('/insert', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userInsert"});
    },
});

userRoutes.route('/update/:id', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userUpdate"});
    },
});

userRoutes.route('/forget-password', {
    action: function() {
        console.log("forget password page")
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userForgetPassword"});
    },
});

userRoutes.route('/view/:id', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userView"});
    },
});

userRoutes.route('/profile', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userProfile"});
    },
});

userRoutes.route('/reset-password/:token', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userResetPassword"});
    },
});

userRoutes.route('/settings', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userSettings"});
    },
});

userRoutes.route('/confirmcode', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_confirmcode"});
    },
});

userRoutes.route('/newpassword', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_resetpwd"});
    },
});

/* EOF USERS */