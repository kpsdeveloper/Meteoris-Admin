Meteor.publish('Products', function(categoryId, keyword, page , limit) {
	
	var skip = (page<=1)? 0 : (page - 1) * limit;
	var fields = { fields:{_id:1, title:1,price:1,category:1,discount:1, category:1, Brand:1, oldId:1,image:1,review:1,recommended:1,date:1}, sort:{date:-1},skip: skip, limit:limit};
	if( categoryId && keyword == ""){
		var data = Meteoris.Products.find({category:{$in:categoryId}}, fields);
	}else if( categoryId == "" && keyword ){
		var data = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
	}else if( categoryId && keyword ){
		var data = Meteoris.Products.find({category:{$in:categoryId}, $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
	}else
    	var data = Meteoris.Products.find({}, fields);
    //var dataattr = publishAttributeProducts( data );
    var prodID = data.map(function(p) { return p._id });
    var attrId = data.map(function(p) { return p.oldId });
    var proimgId = data.map(function(n) { 
    	if (n.image instanceof Array)
        	if(n.image[0]) return n.image[0];
    	else
        	if(n.image) return n.image;
    });
   
    var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
    //var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
    var imgId = proimgId.concat(imgattrId);
    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
    return [dataimg, data, dataattr];
    
});
Meteor.publish('AdminSearchProductsOrder', function(keyword,page,limit) {
	if( keyword ){
		var skip = (page<=1)? 0 : (page - 1) * limit;
		var fields = { fields:{_id:1, title:1,price:1,category:1,discount:1, category:1, Brand:1, oldId:1,image:1,review:1,recommended:1,date:1}, sort:{date:-1},skip: skip, limit:limit};

		var data = Meteoris.Products.find({ title: { $regex: new RegExp(keyword, "i") } },fields);
		var prodID = data.map(function(p) { return p._id });
	    var attrId = data.map(function(p) { return p.oldId });
	    var proimgId = data.map(function(n) { 
	    	if (n.image instanceof Array)
	        	if(n.image[0]) return n.image[0];
	    	else
	        	if(n.image) return n.image;
	    });
	   
	    var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
	    //var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
	    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
	    var imgId = proimgId.concat(imgattrId);
	    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
	    console.log('products:', data.count());
	    console.log('attr:', dataattr.count());
	    console.log('dataimg:', dataimg.count());
	    return [dataimg, data, dataattr];

	}else return [];

})

Meteor.publish('SingleProduct', function( id ) {
	if( id )
		return Meteoris.Products.find({_id:id});
	else return [];
});
Meteor.publish("allOrders",function(){
    var allorder= Meteoris.Orders.find({});
    var listUser=[];
    allorder.forEach(function(da){
        var oneuser=da.usersid;
        listUser.push(oneuser);
    });
    var datauser = Meteor.users.find({_id:{$in:listUser}},{fields:{_id:1,profile:1}})
    return [allorder,datauser];

});
Meteor.publish('Orders', function(status, date, q, page , limit) {
	
	var skip = (page<=1)? 0 : (page - 1) * limit;
	var fields = { fields:{_id:1, userid:1,total:1,status:1,time:1}, sort:{time:-1},skip: skip, limit:limit};
	if( status && q == ""){
		var data = Meteoris.Orders.find({status:status},fields)
        //var data = Meteoris.Orders.find({status:status, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
	}else if( status == "" && q ){
        var data = Meteoris.Orders.find({_id: { $regex: new RegExp(q, "i") }},fields)
		//var data = Meteoris.Orders.find({_id: { $regex: new RegExp(q, "i") }, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
	}else if( status && q ){
        var data = Meteoris.Orders.find({status:status, _id: { $regex: new RegExp(q, "i") }},fields)
		//var data = Meteoris.Orders.find({status:status, _id: { $regex: new RegExp(q, "i") }, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
	}else{
    	//var data = Meteoris.Orders.find({time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
        var data = Meteoris.Orders.find({},{limit:16});
        
    }
    var listUser=[];
    data.forEach(function(re){
        listUser.push(re.userid);
    });
    //var listUser = data.map(function(p) { return p.userid });
    var datauser = Meteor.users.find({_id:{$in:listUser}},{fields:{_id:1,profile:1}})
    return [data,datauser];
});
Meteor.publish('SingleOrders', function( id ) {
	var data = Meteoris.Orders.find({_id:id});
	if( data ){
		var newData = data.fetch()[0];
		/*var addressId = (newData.hasOwnProperty('addressBook'))? newData.addressBook.addressId:'';
		var userAddress = [];
		if( addressId )
			userAddress = Meteoris.Accounts.find({_id:addressId});*/
	
		
		var productId = newData.items.map( function(doc){ return doc.id_product;})
		var product = Meteoris.Products.find({_id:{$in:productId}},{fields:{_id:1,title:1, oldId:1, price:1, CODE:1, image:1}});
		var proimgId = product.map(function(n) { 
		    	if (n.image instanceof Array)
		        	if(n.image[0]) return n.image[0];
		    	else
		        	if(n.image) return n.image;
		    });
		var attrId = product.map(function(p) { return p.oldId });
		var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
	  
	    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
	    var imgId = proimgId.concat(imgattrId);
	    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
	    /*console.log('order:', data.fetch());
	    //console.log('userAddress:', userAddress.count());
	    console.log('dataimg:', dataimg.count());
	    console.log('product:', product.count());
	    console.log('dataattr:', dataattr.count());*/
		//return [data, userAddress, dataimg, product, dataattr];
        var oneuser=Meteor.users.find({_id:newData.userid});
        return [data, dataimg, product, dataattr,oneuser];
	}
})
TAPi18n.publish('Categories', function() {
    var data = Meteoris.Categories.find({});
    return data;
});
Meteor.publish('allBanner', function(limit) {

    if (limit != -1) {
        return Banners.find({}, { limit: limit });
    } else {
        return Banners.find({});
    }
});
Meteor.publish('bannerBypage', function(pname) {
    var pagename=pname.split("/");
    var banner=Banners.find({pagename:{$in: pagename}});
    return banner;
});

Meteor.publish('productInbanner', function(pname) {
    var pagename=pname.split("/");
    var productsId=[];
    var allbanner=Banners.find({pagename:{$in: pagename}});
    allbanner.forEach(function(banner){
        var prod=banner.products;
        if(prod){
            productsId=productsId.concat(prod);
            /*for(var i=0;i<prod.length;i++){
                productsId.push(prod[i]);
            }*/
        }
    });
    var data=Meteoris.Products.find({_id:{$in: productsId}});
    var dataimg= publishImage(data);
    return [data,dataimg[0],dataimg[1]];
});
Meteor.publish('editBanner', function(id) {
    var banner=Banners.find({_id:id});
    
    return banner;
});
Meteor.publish('allproducts', function(limit) {

    if (limit != -1) {
        return Meteoris.Products.find({}, { limit: limit });
    } else {
        return Meteoris.Products.find({});
    }
});
Meteor.publish('alldiscount', function() {
    return Meteoris.Discount.find({}); 
});
Meteor.publish('oneProduct', function(id) {
    return Meteoris.Products.find({_id:id}); 
});
Meteor.publish('onediscount', function(id) {
    return Meteoris.Discount.find({_id:id}); 
});

//2017-jan-01
Meteor.publish('allfavoritepage', function() {
    var allfav=Meteoris.Favorites.find({});
    var idprods=[];
    var idusers=[];
    allfav.forEach(function(res){
        var id=res.proId;
        idprods.push(id);
        var oneuser=res.userId;
        idusers.push(oneuser);
    });
    var listproduct=Meteoris.Products.find({_id: {$in: idprods}});
    var listuser=Meteor.users.find({_id: {$in: idusers}});
    return [allfav,listproduct,listuser]
});

Meteor.publish("allreviewproduct",function(){
    return Meteoris.Products.find({review:{$exists:true}});
});
Meteor.publish("userReview",function(id_product){
    if(id_product==1){
        var oneproduct=Meteoris.Products.find({review:{$exists:true}})
        if(oneproduct){
            var alluser=[];
           oneproduct.forEach(function(obj){
                var allreview=obj.review;
                if(allreview){
                    allreview.forEach(function(d){
                        var oneuser=d.user;
                        alluser.push(oneuser);
                    });
                }
           });
           console.log("11111user ");
           console.log(alluser);
            var getuserreview=Meteor.users.find({_id: {$in: alluser}});
            return getuserreview;
        }
    }else{
        var oneproduct=Meteoris.Products.find({_id:id_product})
        if(oneproduct){
            var alluser=[];
            var data=oneproduct.fetch()[0];
            var allreview=data.review;
            allreview.forEach(function(da){
                var oneuser=da.user;
                alluser.push(oneuser)
            });
            console.log(alluser);
            var getuserreview=Meteor.users.find({_id: {$in: alluser}});
            return getuserreview;
        }
    }

});
Meteor.publish("categoryReviewProduct",function(){
    var allprod=Meteoris.Products.find({review:{$exists:true}});
    var allcat=[];
    allprod.forEach(function(val){
        allcat.push(val.category);
    });
    var listcat=Meteoris.Categories.find({_id:{$in:allcat}});
    return listcat;
});

Meteor.publish("allcart",function(){
    var allcart= Meteoris.Carts.find({});
    var alluser=[];
    var allproduct=[];
    allcart.forEach(function(obj){
        alluser.push(obj.userId);
        allproduct.push(obj.id_product)
    });
    var listproduct=Meteoris.Products.find({_id:{$in:allproduct}});
    var listuser=Meteor.users.find({_id:{$in:alluser}});
    return [allcart,listproduct,listuser];
});

Meteor.publish("favoritedetail",function(uid){ 
    var user=Meteor.users.find({_id:uid});
    var allfav=Meteoris.Favorites.find({userId:uid})
    var allproduct=[];
    allfav.forEach(function(res){
        allproduct.push(res.proId);
    });
    var listprod=Meteoris.Products.find({_id:{$in:allproduct}});
    return [user,allfav,listprod];
});

Meteor.publish("userTrackingPage",function(){
    var urllastpage="http://www.safirperfumery.com/confirmation";
    var alltrack=Meteoris.userTracking.find({currenturl:urllastpage});
    var alluser=[]
    alltrack.forEach(function(da){
        alluser.push(da.userId);
    });
    var listUser=Meteor.users.find({_id:{$in:alluser}});
    return [alltrack,listUser];
});
Meteor.publish("userTrackingLoginErrorPage",function(){
    var alltrack=Meteoris.userTracking.find({$and : [{ $or : [ { event : "loginerror" }, { event : "forgetpassword" } ] },{ event: { $exists: true } } ]} )
    return alltrack;
});

Meteor.publish("allusers",function(limit){
    return Meteor.users.find({},{limit:limit});
});
Meteor.publish("oneuser",function(id){
    return Meteor.users.find({_id:id});
});