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
   
	console.log('product:', data.count());
    var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
    //var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
    var imgId = proimgId.concat(imgattrId);
    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
    return [dataimg, data, dataattr];
    
});
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