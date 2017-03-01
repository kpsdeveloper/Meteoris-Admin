var admin = FlowRouter.group({
    prefix: '',
    name: 'meteoris',
    triggersEnter: [authenticating]
});

/* router level validation, only allow user with group "admin" to access this page */
function authenticating() {    
    if (!Meteor.userId()){
        Meteoris.Flash.set("danger", "403 Unauthenticated");
        FlowRouter.go("/");
    }
}
admin.route('/dashboard', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_siteIndex"});
    },   
});
admin.route('/profile', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_userProfile"});
    },   
});

FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminLogin', {content: "meteoris_userLogin"}); 
    },   
});
admin.route('/theme-admin/setting', {
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_themeAdminSetting"});
    },
});

var groupBannerRoutes = FlowRouter.group({
    prefix: '/banner',
    name: 'banner',
    //triggersEnter: [authenticating]
});

admin.route('/banner/add', {
    subscriptions:function(){
        Meteor.subscribe("allproducts");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_addbanner"});
    },
});
admin.route('/banner/list', {
    subscriptions:function(){
        Meteor.subscribe("allBanner");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_allbanner"});
    },
});
admin.route('/banner/edit/:id', {
    subscriptions:function(params){
        Meteor.subscribe("editBanner",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_editbanner"});
    },
});
admin.route('/banner/view', {
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
admin.route('/product/list', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute'), Meteor.Loader.loadJs("/js/bootbox.min.js")];
    },
    triggersEnter:[paginationscript],
    name:'product',
    action: function( params, queryParams ) {
        var groupname = FlowRouter.current().route.group.prefix;
        //console.log('group:', FlowRouter.current().route.group);
        //var pageslug = path.split('/')
        Session.set('PRODUCTPARAMS',  queryParams);
        Session.set('PATH', 'product' );
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productIndex"});
    },
});
admin.route('/product/insert', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute')];
    },
    triggersEnter:[paginationscript],
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productInsert"});
    },
});
admin.route('/product/update/:id', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('SingleProduct', params.id), Meteor.subscribe('ParentAttribute')];
    },
    triggersEnter:[paginationscript],
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productUpdate"});
    },
});
var groupOrder = FlowRouter.group({
    prefix: '/order',
    name: 'order'
});

admin.route('/order/list', {
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
       // [Meteor.subscribe("Orders","",date,"","","")]
    },
    triggersEnter:[paginationscript],
    action: function( params, queryParams ) {
        var groupname = FlowRouter.current().route.group.prefix;
        //console.log('group:', FlowRouter.current().route.group);
        //var pageslug = path.split('/')
        Session.set('PARAMS',  queryParams);
        Session.set('PATH', 'order');
        BlazeLayout.render('meteoris_themeAdminMain', {content: "orderIndex"});
    },
});
admin.route('/order/view/:id', {
    subscriptions:function(params){
        return [Meteor.subscribe('SingleOrders', params.id), Meteor.subscribe('ParentAttribute')];
    },
    triggersEnter:[paginationscript],
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "orderView"});
    },
});

admin.route('/order/insert', {
    subscriptions:function(params){
        return [TAPi18n.subscribe('Categories'),Meteor.subscribe('ParentAttribute')];
    },
    name:'product',
    action: function( params, queryParams ) {
        Session.set('PARAMS',  queryParams);
        Session.set('PATH', 'insert-order' );
        BlazeLayout.render('meteoris_themeAdminMain', {content: "insertOrder"});
    },
});


/*DISCOUNT */
var groupDiscountRoutes = FlowRouter.group({
    prefix: '/discount',
    name: 'banner',
    //triggersEnter: [authenticating]
});
admin.route('/discount/add', {
    subscriptions:function(){
        [Meteor.subscribe("allproducts"),Meteor.subscribe("alldiscount")]
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "meteoris_adddiscount"});
    },
});

admin.route('/discount/edit-brand/:id', {
    subscriptions:function(params){
       Meteor.subscribe("onediscount",params.id);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "editdiscountBrand"});
    },
});
admin.route('/discount/edit-product/:id', {
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
admin.route('/favorite/list', {
    subscriptions:function(){
       // Meteor.subscribe("allfavoritepage");
    },
    action: function(params, queryParams ) {
        var groupname = '/favorite';//FlowRouter.current().route.group.prefix;
        Session.set('PARAMS',  queryParams);
        Session.set('PATH', groupname.replace('/',''));
        BlazeLayout.render('meteoris_themeAdminMain', {content: "favoritelist"});
    }
});
admin.route('/favorite/view/:userid', {
    subscriptions:function(params){
        Meteor.subscribe("favoritedetail",params.userid);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "favoriteview"});
    }
});

admin.route('/review/list', {
     subscriptions:function(){
        [Meteor.subscribe("allreviewproduct"),Meteor.subscribe("userReview",1),Meteor.subscribe("categoryReviewProduct")];
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "reviewlist"});
    }
});
admin.route('/review/view/:id/:idreview', {
    subscriptions:function(params){
        [Meteor.subscribe("oneProduct",params.id),Meteor.subscribe("userReview",params.id)];
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "reviewdetail"});
    }
});
//CART ORDER
admin.route('/cart/list', {
    subscriptions:function(){
       // Meteor.subscribe("allcart");
    },
    action: function(params, queryParams) {
        //FlowRouter.current().route.group.prefix;
        Session.set('PARAMS',  queryParams);
        Session.set('PATH', 'cartlist');
        BlazeLayout.render('meteoris_themeAdminMain', {content: "cartlist"});
    }
});
//USER ACTION TRACKING
admin.route('/usertrack/list', {
    subscriptions:function(){
        Meteor.subscribe("userTrackingPage");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "userTracklist"});
    }
});
admin.route('/usertrack/login', {
    subscriptions:function(){
        Meteor.subscribe("userTrackingLoginErrorPage");
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "tracklogin"});
    }
});
admin.route('/manageuser/list', {
    subscriptions:function(){
        var limit=16;
       // Meteor.subscribe("allusers",limit);

    },
    triggersEnter:[paginationscript],
    action: function(params, queryParams) {
        //var script  = IRLibLoader.load('/js/jquery.simplePagination.js');
        Session.set('PATH', 'manageuser');
        var groupname = '/manageuser';//FlowRouter.current().route.group.prefix;
        Session.set('PARAMS',  queryParams);
        BlazeLayout.render('meteoris_themeAdminMain', {content: "manageuserlist"});
        //}
      
    }
});
admin.route('/manageuser/view/:id', {
    subscriptions:function(params){
        Meteor.subscribe("oneuser",params.id);
    },
    triggersEnter:[paginationscript],
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "viewuser"});
    }
});
admin.route('/manageuser/update/:id', {
    subscriptions:function(params){
        Meteor.subscribe("oneuser",params.id);
    },
    triggersEnter:[paginationscript],
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "updateuser"});
    }
});
//BIRTHDAY
admin.route('/birthday', {
    subscriptions:function(){
        //var params = FlowRouter.getQueryParam("date");
        //var q = getbirthDate(params);
        Session.set('PATH','birthday');
        //console.log('params:', q);
        //Meteor.subscribe("birthDayUser",q);
    },
    action: function() {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "birthday"});
    }
});
function paginationscript (){
    return IRLibLoader.load('/js/jquery.simplePagination.js');
}
