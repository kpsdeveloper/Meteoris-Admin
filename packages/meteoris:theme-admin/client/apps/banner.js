var ctrl = new Meteoris.BannersController();
var ctrlProd=new Meteoris.ProductsController();

Template.meteoris_addbanner.onCreated(function() {
    Meteor.Loader.loadJs("//api.filestackapi.com/filestack.js");
});

Template.meteoris_addbanner.events = {
    'click #btnaddbanner': function(e, t) {
        e.preventDefault();
        ctrl.insertBanner(e,t);
    },
    'change #pagename':function(e,t){
    	var pagename=t.find('#pagename').value;
    	Session.set("PAGENAME",pagename);
    },
    'change #typebanner':function(e,t){
    	var typebanner=t.find('#typebanner').value;
    	var pagename=Session.get("PAGENAME");
    	if(typebanner=='slidebanner' && pagename=='category'){
    		console.log("hellohere");
    		$("#hideform").removeClass("hidden");
    	}
    },
    'keyup #txtaddproduct': function(e,t){
        ctrlProd.keyuplistproduct(e,t);
    },
    'click .listpro': function(e,t){
        ctrlProd.clickOnKeyup(e);
    },
    'click #btnaddpro': function(e,t){
        e.preventDefault();
        ctrl.addProductBanner(e,t);
    },
    'click #fileimage': function(e, t) {
        e.preventDefault();
        ctrl.getImageUrlFilestack();
        
    }
};

/*====================all Banner =======================*/
Template.meteoris_allbanner.helpers({
    getAllBanners:function(){
        return Banners.find({});
    }
});
Template.meteoris_allbanner.events = {
    'click #delete':function(e,t){
        var id=$(e.currentTarget).attr("data-id");
        if (confirm('Are you sure?')) {
             Meteor.call("removeBanner",id);
        }
    }
};

/*==================Edit Banner =================================*/
Template.meteoris_editbanner.onCreated(function() {
    Meteor.subscribe("allproducts");
    Meteor.Loader.loadJs("//api.filestackapi.com/filestack.js");
});
Template.meteoris_editbanner.helpers({
    editBanner:function(){
        var id = FlowRouter.current().params.id;
        return Banners.findOne({_id:id});
    },
    displayTitle:function(id){
        var title='';
        var pro=Meteoris.Products.findOne({_id:id});
        if(pro){
            title=pro.title;
        }
        return title;
    }
});
Template.meteoris_editbanner.events = {
    'click #removePro':function(e){
        var indexId=$(e.currentTarget).attr("data-id");
        var id=FlowRouter.current().params.id;
        if (confirm('Are you sure to remove ?')) {
            Meteor.call("removeProductIndex",id,indexId,function(err){
                if(!err){
                    Meteoris.Flash.set('success', "success remove product from list ");  
                }
            })
        }
    },
    'keyup #txtaddproduct': function(e,t){
        ctrlProd.keyuplistproduct(e,t);
    },
    'click .listpro': function(e,t){
        ctrlProd.clickOnKeyup(e);

    },
    'click #btnaddpro': function(e,t){
        e.preventDefault();
        ctrl.addProductBanner(e,t);
    },
    'click #fileimage': function(e, t) {
        e.preventDefault();
        ctrl.getImageUrlFilestack();
    },
    'click #btnupdatebanner': function(e, t) {
        e.preventDefault();
        var id=FlowRouter.current().params.id;
        ctrl.updateBanner(id,e,t);
       
    }

};


/*===================Vieww Banner ==============================*/
Template.meteoris_viewbanner.helpers({
    displayBanner:function(){
        console.log(Meteoris.Images.find({}).count())
        return Banners.findOne({pagename:'webzine',typebanner:'webzine'});
    },
    displayBannerSlide:function(){
        return Banners.findOne({pagename:'favorite',typebanner:'slidebanner'});
    },
    displayProduct:function(listIdpro){
        return Meteoris.Products.find({ _id: { $in: listIdpro }});
    }

});