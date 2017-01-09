var groupRoutes = FlowRouter.group({
    prefix: '',
    name: 'meteoris',
    triggersEnter: [authenticating]
});

/* router level validation, only allow user with group "admin" to access this page */
function authenticating() {    
    /*if (!Meteoris.Role.userIsInGroup("admin")){
        Meteoris.Flash.set("danger", "403 Unauthenticated");
        FlowRouter.go("/user/login");
    }*/
}
groupRoutes.route('/admin', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_siteIndex"});
    },   
});
groupRoutes.route('/', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "index"});
    },   
});
groupRoutes.route('/theme-admin/setting', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_themeAdminSetting"});
    },
});

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
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_addbanner"});
    },
});
groupBannerRoutes.route('/list', {
    subscriptions:function(){
        Meteor.subscribe("allBanner");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_allbanner"});
    },
});
groupBannerRoutes.route('/edit/:id', {
    subscriptions:function(params){
        Meteor.subscribe("editBanner",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_editbanner"});
    },
});
groupBannerRoutes.route('/view', {
    subscriptions:function(){
        var pagename='webzine/favorite';
        [Meteor.subscribe("bannerBypage",pagename),Meteor.subscribe("productInbanner",pagename)]
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_viewbanner"});
    },
});

var groupProduct = FlowRouter.group({
    prefix: '/product',
    name: 'product'
});
groupProduct.route('/list', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute'), Meteor.Loader.loadJs("/js/bootbox.min.js")];
    },
    name:'product',
    action: function( params, queryParams ) {
        var groupname = FlowRouter.current().route.group.prefix;
        //console.log('group:', FlowRouter.current().route.group);
        //var pageslug = path.split('/')
        Session.set('PRODUCTPARAMS',  queryParams);
        Session.set('PATH', groupname.replace('/','') );
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productIndex"});
    },
});
groupProduct.route('/insert', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute')];
    },
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productInsert"});
    },
});
groupProduct.route('/update/:id', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('SingleProduct', params.id), Meteor.subscribe('ParentAttribute')];
    },
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productUpdate"});
    },
});
var groupOrder = FlowRouter.group({
    prefix: '/order',
    name: 'order'
});

groupOrder.route('/list', {
    name:'product',
    subscriptions:function(params){
        //return [Meteor.subscribe('allOrders')];
         var curdate = new Date(), year = curdate.getFullYear(), month = curdate.getMonth(), day = curdate.getDate(), sevenday = curdate.getDate() - 6;
        var curdate = new Date([month,day,year].join('/'));
        var sevendate = new Date([month,sevenday,year].join('/'));
        var timestamp = curdate.getTime();
        //var nextseventamp = sevendate.getTime();
        var date = new Date();
        var nextseventamp= new Date(new Date().getTime()+(7*24*60*60*1000));
        var sdate = timestamp;
        var edate =nextseventamp.getTime();
        console.log("EDATE "+edate);
        var date = {sdate:sdate, edate:edate};
        [Meteor.subscribe("Orders","",date,"","","")]
    },
    action: function( params, queryParams ) {
        var groupname = FlowRouter.current().route.group.prefix;
        //console.log('group:', FlowRouter.current().route.group);
        //var pageslug = path.split('/')
        Session.set('PARAMS',  queryParams);
        Session.set('PATH', groupname.replace('/','') );
        BlazeLayout.render('meteoris_themeAdminMain', {content: "orderIndex"});
    },
});
groupOrder.route('/view/:id', {
    subscriptions:function(params){
        return [Meteor.subscribe('SingleOrders', params.id)];
    },
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "orderView"});
    },
});


/*DISCOUNT */
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
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_adddiscount"});
    },
});

groupDiscountRoutes.route('/edit-brand/:id', {
    subscriptions:function(params){
       Meteor.subscribe("onediscount",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "editdiscountBrand"});
    },
});
groupDiscountRoutes.route('/edit-product/:id', {
    subscriptions:function(params){
        //Meteor.subscribe("allproducts")
        Meteor.subscribe("oneProduct",params.id);
        
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "editdiscountProduct"});
    },
});

/*END DISCOUNT*/

//2017-jan-03
FlowRouter.route('/favorite/list', {
    subscriptions:function(){
        Meteor.subscribe("allfavoritepage");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "favoritelist"});
    }
});
FlowRouter.route('/favorite/view/:userid', {
    subscriptions:function(params){
        Meteor.subscribe("favoritedetail",params.userid);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "favoriteview"});
    }
});

FlowRouter.route('/review/list', {
     subscriptions:function(){
        [Meteor.subscribe("allreviewproduct"),Meteor.subscribe("userReview",1),Meteor.subscribe("categoryReviewProduct")];
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "reviewlist"});
    }
});
FlowRouter.route('/review/view/:id/:idreview', {
    subscriptions:function(params){
        [Meteor.subscribe("oneProduct",params.id),Meteor.subscribe("userReview",params.id)];
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "reviewdetail"});
    }
});
//CART ORDER
FlowRouter.route('/cart/list', {
    subscriptions:function(){
        Meteor.subscribe("allcart");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "cartlist"});
    }
});
//USER ACTION TRACKING
FlowRouter.route('/usertrack/list', {
    subscriptions:function(){
        Meteor.subscribe("userTrackingPage");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "userTracklist"});
    }
});
FlowRouter.route('/usertrack/login', {
    subscriptions:function(){
        Meteor.subscribe("userTrackingLoginErrorPage");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "tracklogin"});
    }
});
FlowRouter.route('/manageuser/list', {
    subscriptions:function(){
        var limit=16;
        Meteor.subscribe("allusers",limit);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "manageuserlist"});
    }
});
FlowRouter.route('/manageuser/view/:id', {
    subscriptions:function(params){
        Meteor.subscribe("oneuser",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "viewuser"});
    }
});
FlowRouter.route('/manageuser/update/:id', {
    subscriptions:function(params){
        Meteor.subscribe("oneuser",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "updateuser"});
    }
});
//BIRTHDAY
FlowRouter.route('/manageuser/birthday', {
    subscriptions:function(){
        var limit=16;
        Meteor.subscribe("allusers",limit);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "birthday"});
    }
});