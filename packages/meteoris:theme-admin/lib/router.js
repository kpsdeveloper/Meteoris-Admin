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

FlowRouter.route('/review/list', {
     subscriptions:function(){
        [Meteor.subscribe("allreviewproduct"),Meteor.subscribe("userReview",1)];
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
