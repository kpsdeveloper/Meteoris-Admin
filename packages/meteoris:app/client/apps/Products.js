var ctrl = new Meteoris.ProductsController();

//Session.set('PAGE', 1);
Session.set('SUBSCRIBELISTPRO', '');
Session.set('SORTKEY','title');
Session.set('VIEWCOUNT', 20);
itemSub = '';
Tracker.autorun(function() {
    var path = Session.get('PATH');
    if( path ){
        
        var categorydata = Session.get('CATEGORYDATA');
        var categoryId = getCategoryIdChildren( categorydata.name );
        var page = categorydata.page;
        if( path == 'category'){
            if( categorydata ){
                itemSub = Meteor.subscribe('Products', categoryId, page, limit, Meteor.userId(),function(){
                    Session.set('SUBSCRIBELISTPRO', 1);
                    
                    Meteor.call('Meteoris.Count.Products', categoryId, function(err, count){
                        if(!err){
                            //Session.set('TOTALPRODUCT', count);
                            $('#pagination').pagination({ items: count, itemsOnPage: limit, currentPage:page, hrefTextPrefix:'', cssStyle: 'light-theme' });
                        }
                    })
                })    
            }
        }else if( path == 'filter-product'){
            if( categorydata ){
                categorydata.categoryId = categoryId;
                categorydata.limit      = limit;
                categorydata.userId     = Meteor.userId();
                categorydata.price      = (categorydata.hasOwnProperty('price'))? categorydata.price:0;
                categorydata.parent        = (categorydata.hasOwnProperty('parent'))? categorydata.parent:0;
                categorydata.child   = (categorydata.hasOwnProperty('child'))? categorydata.child:'';

                itemSub = Meteor.subscribe('FilterProducts', categorydata,function(){
                    Session.set('SUBSCRIBELISTPRO', 1);
                    
                    Meteor.call('Meteoris.Count.Products', categoryId, function(err, count){
                        if(!err){
                            
                            //$('#pagination').pagination({ items: count, itemsOnPage: limit, currentPage:page, hrefTextPrefix:'', cssStyle: 'light-theme' });
                        }
                    })
                })    
            }
        }
    }
})

Template.category.onCreated(function() {
	
	Session.set('RELOADCATEGORYPAGE',1);
    var self = this;
    //var page = Session.get('PAGE');
    //var name = Session.get('CATEGORYNAME'); //FlowRouter.current().params.name;
    
    self.autorun(function() {
        //var categoryId = getCategoryIdChildren( name );
        /*itemSub = self.subscribe('Products', categoryId, page, limit,function(){
        	Session.set('SUBSCRIBELISTPRO', 1);
        })*/
        //Meteor.Loader.loadJs("/js/script-category.js");
        
    });  
});


Template.detail.onCreated(function() {
    var title = unslugTitle(FlowRouter.current().params.title);
    var self = this;
    self.autorun(function() {
        self.subscribe('detailTitle',title, Meteor.userId());
    }); 

});
Template.searchproduct.onCreated( function(){
    var self = this;
    self.autorun(function() {
        //TAPi18n.subscribe('Categories');
        var key = Session.get('keyword');
        var groupId = $('.search-option .active a').attr('data-group');
        var limit = Session.get('VIEWCOUNT');
        if( key )
            var keyword = key;
        else
            var keyword = unslugTitle(FlowRouter.getParam("slug"));
        
        Meteor.subscribe('searchproduct', keyword, groupId, limit, Meteor.userId());
    });
})


Template.detail.helpers({
    getTitleInDetail: function(){
        var title = unslugTitle(FlowRouter.current().params.title);
        var objTitle = ctrl.getTitleInDetail(title);
        return objTitle;
    },
    getCategoryName: function(categoryid){
        var objCategory = ctrl.getCategoryName(categoryid);
        return objCategory;
    },
    getRecommendProducts: function( recommended ){
    	return ctrl.getRecommendProducts( recommended );
    },
    checkdiscount:function(oneproduct){
        return ctrl.checkdiscount(oneproduct);
    },
    getPriceAfterDiscount:function(oldprice){
        return ctrl.getPriceAfterDiscount(oldprice);
    }
});
Template.quickView.helpers({
    getRecommendProducts: function( recommended ){
        return ctrl.getRecommendProducts( recommended );
    }
})
Template.searchproduct.helpers({
    searchResult:function(e){
        //var keyword = unslugTitle(FlowRouter.current().params.slug);
        var slug = unslugTitle(FlowRouter.getParam("slug"));
        var keyword = (slug)? slug:Session.get('keyword');
        var sort = Session.get('SORTKEY');
        var count = Session.get('VIEWCOUNT');
        var groupId = $('.search-option .active a').attr('data-group');
        groupId = (groupId)? groupId:1;
    
        var groupHtml = '';
        var productActive = '';
        var webzActive = '';
        var tutoActive = '';
        if(keyword !=""){
            Meteor.call('Meteoris.Count.ProductsSearch', keyword , function(err, count){
                if(!err) Session.set('COUNTPRODUCTS', count);
            });
            if (groupId == 1) {
                var sortQuery =  '';
                switch( sort ){
                    case 'title':
                        sortQuery = {title:1};
                        break;
                    case 'price':
                        sortQuery = {price:1};
                        break;
                    default:
                        sortQuery = {title:1};
                        break;
                }
                productActive = 'active';
                var content = {productActive:productActive, webzActive:webzActive, tutoActive:tutoActive }
                var data = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] },{fields:{_id:1, title:1,price:1,category:1, oldId:1,image:1,description:1}, sort:sortQuery, limit:count});
                groupHtml += '<li role="presentation" class="active"><a href="#product" aria-controls="home" role="tab" data-toggle="tab">'+Session.get('COUNTPRODUCTS')+' Products</a></li>';
                return {count:Session.get('COUNTPRODUCTS'),show:data.count(), results:data, keyword:keyword, groupHtml:groupHtml, content:content};
            }else if(groupId == 2){
                webzActive = 'active';
                var content = {productActive:productActive, webzActive:webzActive, tutoActive:tutoActive }
                var webzine = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' }, typeid:Meteoris.ContentType.findOne({ type: "Webzine" })._id},{limit:count});
                groupHtml += '<li role="presentation" class="active"><a href="#webzine" aria-controls="profile" role="tab" data-toggle="tab">'+webzine.count()+' Webzine</a></li>';
                return {count:webzine.count(), keyword:keyword, groupHtml:groupHtml, show:webzine.count(), resWebzine:webzine, content:content};
            }else if(groupId == 3){
                tutoActive = 'active';
                var content = {productActive:productActive, webzActive:webzActive, tutoActive:tutoActive }
                var tuto = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' }, typeid:Meteoris.ContentType.findOne({ type: "Tuto" })._id},{limit:count});
                groupHtml += '<li role="presentation" class="active"><a href="#tuto" aria-controls="messages" role="tab" data-toggle="tab">'+tuto.count()+ ' Tuto</a></li>';
                return {count:tuto.count(), keyword:keyword, groupHtml:groupHtml, show:tuto.count(), resTuto:tuto, content:content};
            }else{
                
                productActive = 'active';
                var content = {productActive:productActive, webzActive:webzActive, tutoActive:tutoActive }
                var data = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, {fields:{_id:1, title:1,price:1,category:1, oldId:1,image:1,description:1}, limit:count});
                var webzine = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' }, typeid:Meteoris.ContentType.findOne({ type: "Webzine" })._id},{limit:count});
                var tuto = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' }, typeid:Meteoris.ContentType.findOne({ type: "Tuto" })._id},{limit:count});
            
                groupHtml += '<li role="presentation" class="active"><a href="#product" aria-controls="home" role="tab" data-toggle="tab">'+Session.get('COUNTPRODUCTS')+' Products</a></li>';
                groupHtml += '<li role="presentation"><a href="#webzine" aria-controls="profile" role="tab" data-toggle="tab">'+webzine.count()+' Webzine</a></li>';
                groupHtml += '<li role="presentation"><a href="#tuto" aria-controls="messages" role="tab" data-toggle="tab">'+tuto.count()+' Tuto</a></li>';
                return {count:Session.get('COUNTPRODUCTS'),show:data.count(), results:data, keyword:keyword, groupHtml:groupHtml, countweb:webzine.count(), resWebzine:webzine, counttuto:tuto.count(), resTuto:tuto, content:content};
            }
        
            
            
        }
    },
    getViewBy: function(count){
        var numshow = 20;
        var page = (count >= numshow)? Math.ceil( count / numshow ):1;
        var view = '';
        for(i=1; i <= page; i++){
            var num = i * numshow;
            view += '<option value="'+num+'">'+num+'</option>';
        }
        return view;
    },
    checkgroupSearch: function(groupid, mygroupid){
        var res = ( groupid === mygroupid);
        console.log('Result:', res);
        return res;
    }
});
Template.searchproduct.events({
    'change #sort': function(e){
        Session.set('SORTKEY', $('#sort').val());
    },
    'change #view': function(e){
        var limit = parseInt($('#view').val());
        Session.set('VIEWCOUNT', limit);
        var key = Session.get('keyword');
        var groupId = $('.search-option .active a').attr('data-group');
        if( key )
            var keyword = key;
        else
            var keyword = unslugTitle(FlowRouter.getParam("slug"));
        
        Meteor.subscribe('searchproduct', keyword, groupId, limit);
    }
});
Template.detail.events({
	'click .attribute': function(e){
		e.preventDefault();
		var price = $(e.currentTarget).attr('data-price');
		$('.attribute').removeClass('active');
		$(e.currentTarget).addClass('active');
		$('.price').text(price);
	},
	'submit .add-review': function(e, t){
		e.preventDefault(); 
		var title = unslugTitle(FlowRouter.current().params.title);     
        ctrl.addReview(t, title);
	},
	'click .rating i.rateStar': function(e) {
        $(e.currentTarget).addClass('yellow-star star_active');
        $(e.currentTarget).parent().prevAll('div').children('i').addClass('yellow-star star_active');
        $(e.currentTarget).parent().nextAll('div').children('i').removeClass('yellow-star');
    },
})
/*var itemSub;
Template.category.events({
	'click .pager': function(e){
		//e.preventDefault();
		var page = parseInt($(e.currentTarget).attr('data-page'));
		Session.set('RELOADCATEGORYPAGE', 0);
		Session.set('PAGE', page);
		var self = this;
	    var name = FlowRouter.current().params.name;
    	var categoryId = getCategoryIdChildren( name );
	    var limit = 16;
	    
	    Meteor.autorun(function() {
	    	if( itemSub) {
	    		itemSub.stop();
	    	}
	        itemSub = Meteor.subscribe('Products', categoryId, page, limit);
	    });    
	}
});
*/
/**Seyha search function**/
Template.app_header.events({
    'click .kesearch':function(e){
        e.preventDefault();
        var search = $('#textToSearch').val();
        Session.set('keyword', search);
        FlowRouter.go('/searchproduct/'+search);
    }
});
Template.app_header.helpers({
    getParentCategories: function() {
        var menu = Meteoris.Categories.find({ "$or": [{ "parent": "0" }, { "parent": " " }] }).map(function(document, index) {
            var lang = Session.get('LANG');
            if( lang == 'en'){
                document.title = document.i18n.en.title;
                document.slug  = slugTitle(document.i18n.en.title);
            }
            document.index = index + 1;
            return document;
        });
        return menu;
    },
    getChildrenCategories: function(parent) {
        var children = Meteoris.Categories.find({ "parent": parent }).map(function(document, index) {
            var lang = Session.get('LANG');
            if( lang == 'en'){
                document.title = document.i18n.en.title;
                document.slug  = slugTitle(document.i18n.en.title);
            }
            document.index = index + 1;
            var hasChildren = Meteoris.Categories.findOne({ "parent": document._id });
            if( hasChildren ) document.hasChildren = true;
            else document.hasChildren = false;
        
            return document;
        });

        return children;
    }
});
Template.filterProduct.helpers({
    getParentTags: function(){
        var parent = Meteoris.ParentTags.find({});
    }
})
