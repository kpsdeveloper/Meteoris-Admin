var groupRoutes = FlowRouter.group({
    prefix: '/meteoris',
    name: 'meteoris',
    triggersEnter: [authenticating]
});

/* router level validation, only allow user with group "admin" to access this page */
function authenticating() {    
    console.log(Meteoris.Role.userIsInGroup("admin"));
    if (!Meteoris.Role.userIsInGroup("admin")){
        FlowRouter.go("/");
        Meteoris.Flash.set("danger", "403 Unauthenticated");
    }
}

function checkIsLogin(){
    if (!Meteor.userId()){
        FlowRouter.go("/");
        Meteoris.Flash.set("danger", "403 Unauthenticated");
    }
}
FlowRouter.route('/searchproduct/:slug', {
    subscriptions: function(){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute')];
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "searchproduct"});
    }
});
groupRoutes.route('/products/list', {
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_productIndex"});
    },
});
groupRoutes.route('/products/add', {

    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_productAdd"});
    },
});
FlowRouter.route('/category/:name/:page', {
    subscriptions: function(){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute'),Meteor.subscribe("alldiscount")];
    },
    action: function( params ) {
        var path = FlowRouter.current().path;
        var pageslug = path.split('/')
        Session.set('CATEGORYDATA',  {name:unslugTitle(params.name), page:params.page});
        Session.set('PATH', pageslug[1] );
        BlazeLayout.render('mainLayout', {content: "category"});
    }

});
FlowRouter.route('/filter-product/:name?', {
    subscriptions: function(){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute'), Meteor.subscribe('ParentTags')];
    },
    action: function( params, queryParams ) {
        var path = FlowRouter.current().path;
        var pageslug = path.split('/')
        var myparam = queryParams;
        myparam.name = unslugTitle(params.name);
        Session.set('CATEGORYDATA',  myparam);
        Session.set('PATH', pageslug[1] );
        BlazeLayout.render('mainLayout', {content: "filterProduct"});
    }
});

FlowRouter.route('/checkout', {
    subscriptions: function(){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('Carts', getSessionUserID())];
    },
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "showCart"});
    }
});
FlowRouter.route('/chooseAddress', {
    subscriptions: function(){
        Meteor.subscribe('Accounts', Meteor.userId());
    },
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "chooseAddress"});
    }
});
FlowRouter.route('/addnewAddress', {
    subscriptions: function(){
        //this.register('myCart', Meteor.subscribe('Carts', getSessionUserID()) );
        Meteor.subscribe('Accounts', Meteor.userId() );

    },
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "addressDetails"});
    }
});
FlowRouter.route('/editaddress/:id', {
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "editAddress"});
    }
});

FlowRouter.route('/orderReview', {
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "orderReview"});
    }
});
FlowRouter.route('/payment', {
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "paymentDetails"});
    }
});
FlowRouter.route('/saman', {
    subscriptions: function(){
        Meteor.call('Meteoris.Order.completedOrder', Meteor.userId());
    },
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "completedOrder"});
    }
});
FlowRouter.route('/ordersuccess', {
    subscriptions: function(){
        Meteor.subscribe('Orders', getSessionUserID());
    },
    action: function( params ) {
        BlazeLayout.render('mainLayout', {content: "completedOrder"});
    }
});
FlowRouter.route('/details/:title', {
    subscriptions: function(){
        return [TAPi18n.subscribe('Categories'),Meteor.subscribe('ParentAttribute'),Meteor.subscribe("alldiscount"),Meteor.Loader.loadJs("/js/jquery.elevateZoom-3.0.8.min.js")];
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "detail"});
    },   
});

/*Start Profile*/
FlowRouter.route('/profile', {
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_profile"});

    },   
    triggersEnter: [function(context, redirect) {
        checkIsLogin();
    }]
});
FlowRouter.route('/changepassword', {
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_changepassword"});
    },   
    triggersEnter: [function(context, redirect) {
        checkIsLogin();
    }]
});
/*EOF profile*/

/*Start banner admin*/
var groupBannerRoutes = FlowRouter.group({
    prefix: '/banner',
    name: 'banner',
    //triggersEnter: [authenticating]
});

groupBannerRoutes.route('/add', {
    subscriptions:function(){
        Meteor.subscribe("allproducts");
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_addbanner"});
    },
});
groupBannerRoutes.route('/all', {
    subscriptions:function(){
        Meteor.subscribe("allBanner");
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_allbanner"});
    },
});
groupBannerRoutes.route('/edit/:id', {
    subscriptions:function(params){
        Meteor.subscribe("editBanner",params.id);
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_editbanner"});
    },
});
groupBannerRoutes.route('/view', {
    subscriptions:function(){
        var pagename='webzine/favorite';
        [Meteor.subscribe("bannerBypage",pagename),Meteor.subscribe("productInbanner",pagename)]
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_viewbanner"});
    },
});
/*End banner admin*/

var groupDiscountRoutes = FlowRouter.group({
    prefix: '/discount',
    name: 'banner',
    //triggersEnter: [authenticating]
});
groupDiscountRoutes.route('/add', {
    subscriptions:function(){
        [Meteor.subscribe("allproducts"),Meteor.subscribe("alldiscount")]
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "meteoris_adddiscount"});
    },
});

groupDiscountRoutes.route('/edit-brand/:id', {
    subscriptions:function(params){
       Meteor.subscribe("onediscount",params.id);
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "editdiscountBrand"});
    },
});
groupDiscountRoutes.route('/edit-product/:id', {
    subscriptions:function(params){
        //Meteor.subscribe("allproducts")
        Meteor.subscribe("oneProduct",params.id);
        
    },
    action: function() {
        BlazeLayout.render('mainLayout', {content: "editdiscountProduct"});
    },
});
