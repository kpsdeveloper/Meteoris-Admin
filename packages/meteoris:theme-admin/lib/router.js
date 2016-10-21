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
        return [TAPi18n.subscribe('Categories'), Meteor.subscribe('ParentAttribute')];
    },
    name:'product',
    action: function( params, queryParams ) {
        BlazeLayout.render('meteoris_themeAdminMain', {content: "productUpdate"});
    },
});