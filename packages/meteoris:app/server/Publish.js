Meteor.publish('Products', function(categoryId, page , limit, userId) {
	//var total = Meteoris.Products.find({category:categoryId},{fields:{_id:1}});
	var skip = (page<=1)? 0 : (page - 1) * limit;
    var data = Meteoris.Products.find({ category:{$in:categoryId}},{ fields:{_id:1, title:1,price:1,category:1,discount:1,Brand:1, oldId:1,image:1,description:1,review:1,recommended:1}, sort:{price:1},skip: skip, limit:limit});
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
    var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
    var imgId = proimgId.concat(imgattrId);
    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
    return [dataimg, data, dataattr, datafavorite];
    
});
Meteor.publish('FilterProducts', function(data) {
    var categoryId = data.categoryId;
    var page = data.page;
    var limit = data.limit;
    var userId = data.userId;
    var price = parseInt(data.price);
    var parent = (data.parent instanceof Array)? data.parent:[data.parent];
    var child = (data.child instanceof Array)? data.child:[data.child];
    //var tags = age.concat(skintype);
    console.log('parent:',parent);
    console.log('child:',child);
    var query = {};
    var skip = (page<=1)? 0 : (page - 1) * limit;

    if( price > 0 && parent.length <= 0 && child.length <= 0){
        console.log('case 1');
        query = { category:{$in:categoryId}, price:{$lte:price}};
    }else if( price > 0 && parent.length > 0 && child.length <= 0 ){
        console.log('case 2');
        query = { category:{$in:categoryId}, $or: [{ price:{$lte:price}, 'tags.parent':{$in:parent}}] };
    }else if( price > 0 && parent.length <= 0 && child.length > 0 ){
        console.log('case 3');
        query = { category:{$in:categoryId}, $or: [{ price:{$lte:price}, 'tags.value':{$in:child}}] };
    }
    else if( price > 0 && parent.length > 0 && child.length > 0 ){
        console.log('case 4');
        query = { category:{$in:categoryId}, $or: [{ price:{$lte:price}, 'tags.parent':{$in:parent}, 'tags.value':{$in:child}}] };
    }
    else if( price <= 0 && parent.length > 0 && child.length <= 0 ){
        console.log('case 5');
        query = { category:{$in:categoryId}, 'tags.parent':{$in:parent}};
    }
    else if( price <= 0 && parent.length > 0 && child.length > 0 ){
        console.log('case 6');
        query = { category:{$in:categoryId}, $or: [{'tags.parent':{$in:parent}, 'tags.value':{$in:child}}] };
    }
    else if( price <= 0 && parent.length <= 0 && child.length > 0 ){
        console.log('case 7');
        query = { category:{$in:categoryId}, 'tags.value':{$in:child}};
    }
    else{
        console.log('case 8');
        query = { category:{$in:categoryId}};
    }
    var data = Meteoris.Products.find( query,{ fields:{_id:1, title:1,price:1,category:1, oldId:1,image:1,description:1,review:1}, sort:{price:1},skip: skip, limit:limit});
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
    var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
    var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
    var imgId = proimgId.concat(imgattrId);
    var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
    return [dataimg, data, dataattr, datafavorite];
    
});

Meteor.publish('detailTitle', function(title, userId) {
    var currentPro = Meteoris.Products.findOne({"title":title},{fields:{_id:1,recommended:1}});
    
    if( currentPro ){
    	var id_product = [];
    	
    	if( currentPro.hasOwnProperty('recommended') ){
    		if(currentPro.recommended.length > 0) id_product = currentPro.recommended;
    	}
    	id_product.push(currentPro._id);
    	var data = Meteoris.Products.find({_id:{$in:id_product}});
    
	    var attrId = data.map(function(p) { return p.oldId });
	    var imgId = data.map(function(n) { 
	    	if (n.image instanceof Array)
	        	return n.image[0];
	    	else
	        	return n.image;
	    });
	    var datafav = Meteoris.Favorites.find({proId:currentPro._id, userId:userId});
	    var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
    	var dataimg = Meteoris.Images.find({_id: {$in: imgId}} ,{fields:{_id:1, copies:1}});
	    return [dataimg, data, dataattr, datafav];
	} else return []

});
Meteor.publish('Carts', function( userId ) {
    var data = Meteoris.Carts.find({userId:userId});

    if( data.count() > 0 ){
        var id_product = [];
        cart = data.fetch()[0];
        cart.items.forEach( function(item){
            id_product.push(item.id_product);
        })
        var product = Meteoris.Products.find({_id:{$in:id_product}});
        var attrId = product.map(function(p) { return p.oldId });

        var proimgId = product.map(function(n) { 
            if (n.image instanceof Array)
                return n.image[0];
            else
                return n.image;
        });
        var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
        var imgattrId = dataattr.map(function(p) { return p.productImage });
        var imgId = proimgId.concat(imgattrId);
        var image = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})

        return [data, image, product, dataattr];
    }
    else return [];
    
});

Meteor.publish('ProductsRecommended', function( productId, userId ){
    var singlePro = Meteoris.Products.findOne({_id:productId})
    var result = [];
    if( singlePro.hasOwnProperty('recommended') ){
        if( singlePro.recommended.length > 0 ){
            var data = Meteoris.Products.find({_id:{$in:singlePro.recommended}},{ fields:{_id:1, title:1,price:1,category:1,discount:1,Brand:1, oldId:1,image:1,description:1,review:1,recommended:1}});
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
            var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
            var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
            var imgId = proimgId.concat(imgattrId);
            var dataimg = Meteoris.Images.find({_id: {$in: imgId}},{fields:{_id:1, copies:1}})
            result = [dataimg, data, dataattr, datafavorite];
        }
    }
    return result;
})
Meteor.publish('FavoriteByProduct', function(ProId, userId) {
    var datafavorite = Meteoris.Favorites.find({proId: {$in: ProId}, userId:userId});
    if( datafavorite ) return datafavorite;
    else return [];
});
Meteor.publish('Orders', function(userId) {
    var data = Meteoris.Carts.find({userId:userId});
    return data;
});
TAPi18n.publish('Categories', function() {
    var data = Meteoris.Categories.find({});
    return data;
});
Meteor.publish('Provinces', function() {
    return Meteoris.Provinces.find({});
});
Meteor.publish('Cities', function( provinceId ) {
    return Meteoris.Cities.find({provinceId: provinceId});
});
Meteor.publish('Accounts', function( userId, addressId ) {
    if( addressId )
        return Meteoris.Accounts.find({_id: addressId});
    else
        return Meteoris.Accounts.find({userId: userId});
});
Meteor.publish('ParentAttribute', function( ) {
    return Meteoris.ParentAttributes.find({});
});
Meteor.publish('ParentTags', function( ) {
    //var parenttag = Meteoris.ParentTags.find({title:{$exists:1}, i18n:{$exists:1}},{fields:{_id:1,title:1, i18n:1}});
    var distinctEntries = _.uniq(Meteoris.ParentTags.find({title:{$exists:1}, i18n:{$exists:1}}, {fields: {_id:1,title:1, i18n:1}
        }).fetch().map(function(x) {
            return x;
        }), true);
    console.log('parentTag:', distinctEntries.length);
    return [];

});

Meteor.publish('searchproduct', function(keyword, groupid, limit, userId) {

    if (keyword != "") {
        if (groupid == 1) {
            var data = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] },{fields:{_id:1, title:1,price:1,category:1, oldId:1,image:1,description:1}, limit:limit});
            var attrId = data.map(function(p) { return p.oldId });
            var proimgId = data.map(function(n) { 
                if (n.image instanceof Array)
                    return n.image[0];
                else
                    return n.image;
            });
            //var datafav = Meteoris.Favorites.find({proId:currentPro._id, userId:userId});
            var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
            var prodID = data.map(function(p) { return p._id });
            var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
            var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
            var imgId = proimgId.concat(imgattrId);

            var dataimg = Meteoris.Images.find({_id: {$in: imgId}});
            console.log('Favorites:', datafavorite.count());
            return [dataimg, data, dataattr, datafavorite];

        } else if (groupid == 2) {
            var webzine = Meteoris.ContentType.findOne({ type: "Webzine" });
            var data = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' } ,typeid: webzine._id }, {limit:limit});
            var imgId = data.map(function(n) { 
                if (n.image instanceof Array)
                    return n.image[0];
                else
                    return n.image;
            });
            var dataimg = Meteoris.Images.find({_id: {$in: imgId}});
            return [dataimg, data, Meteoris.ContentType.find()];
        } else if (groupid == 3) {
            var tuto = Meteoris.ContentType.findOne({ type: "Tuto" });
            var data = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' } ,typeid:tuto._id}, {limit:limit});
            var imgId = data.map(function(n) { 
                if (n.image instanceof Array)
                    return n.image[0];
                else
                    return n.image;
            });
            var dataimg = Meteoris.Images.find({_id: {$in: imgId}}, {fields:{_id:1,copies:1}});
            return [dataimg, data, Meteoris.ContentType.find()];
        }else{
            var list = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, {fields:{_id:1, title:1,price:1,category:1, oldId:1,image:1,description:1}, limit:limit});
            var content = Meteoris.Contents.find({ title: { $regex: new RegExp(keyword, "i") }, category: { $ne: 'tester' }},{limit:limit});
            if( list.count() > 0 || content.count() > 0){
                var attrId = list.map(function(p) { return p.oldId });
                var imgIdPro = list.map(function(n) { 
                    if (n.image instanceof Array)
                        return n.image[0];
                    else
                        return n.image;
                });
                var imgIdCont = content.map(function(n) { 
                    if (n.image instanceof Array)
                        return n.image[0];
                    else
                        return n.image;
                });
                var proimgId = imgIdPro.concat( imgIdCont );
        
                var dataattr = Meteoris.Attributes.find({product: {$in: attrId}});
                var prodID = list.map(function(p) { return p._id });
                var datafavorite = Meteoris.Favorites.find({proId: {$in: prodID}, userId:userId});
                var imgattrId = dataattr.map(function(p) { if( p.productImage ) return p.productImage });
                var imgId = proimgId.concat(imgattrId);
                var dataimg = Meteoris.Images.find({_id: {$in: imgId}});
                console.log('Favorites:', datafavorite.count());
                return [Meteoris.ContentType.find(), dataimg, list, content, dataattr, datafavorite];

            }else return []
        }
       
    } else return this.ready();
});
publishAttributeProducts = function(allpro) {
    var attrlist = [];
    if (allpro.count() > 0) {
        //allpro.forEach(function(data, index) {
        var fetchdata = allpro.fetch();
        for(k=0; k < fetchdata.length; k++){
            var attr = Meteoris.Attributes.find({ product: fetchdata[k].oldId });
            if (attr.count() > 0) {
                attrlist.push(attr.fetch()[0]._id); 
            }
        }
        //})
    }
    var allattr = Meteoris.Attributes.find({ _id: { $in: attrlist } });
    return allattr;
}
Meteor.publish('allproducts', function(limit) {

    if (limit != -1) {
        return Meteoris.Products.find({}, { limit: limit });
    } else {
        return Meteoris.Products.find({});
    }
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
Meteor.publish('alldiscount', function() {
    return Discount.find({}); 
});
Meteor.publish('oneProduct', function(id) {
    return Meteoris.Products.find({_id:id}); 
});
Meteor.publish('onediscount', function(id) {
    return Discount.find({_id:id}); 
});

publishImage = function(listobjPro){
    var checkAtrr=[];
    var allattr=[];
    var dataimgattr=[];
    var imgId = listobjPro.map(function(n) { 
        if (n.image instanceof Array){
            if(n.image[0]){
                return n.image[0];
            }
        }
        else {
            return n.image;
        }
    });

    if(listobjPro.count() > 0){
        listobjPro.forEach(function(da){
           // console.log("OLDIDME"+da.oldId);
            var attr=Meteoris.Attributes.find({product:da.oldId});
            if(attr){
                var firstattr=attr.fetch()[0];
                if(firstattr){
                    allattr.push(firstattr._id);
                    imgId.push(firstattr.productImage);
                }
            }
        });
    }
    var dataimg = Meteoris.Images.find({_id: {$in: imgId}})
    var dataAttr= Meteoris.Attributes.find({_id: {$in: allattr}});

    return [dataimg,dataAttr];
}

