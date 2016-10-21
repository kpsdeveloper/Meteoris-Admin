var ctrl = new Meteoris.ProductsController();
var ordercl = new Meteoris.OrdersController();
Session.set('SUBSCRIBELISTPRO', '');
Session.set('TOTALPRODUCT', 0);
Session.set('QUICKVIEWPRODUCT','');
limit = 16;
Template.mainLayout.events({
	'click .unlike': function(e) {
		e.preventDefault();
	    var productid = $(e.currentTarget).attr('data-id');
	    $('#like' + productid).removeClass('nonelike');
	    $('#unlike' + productid).addClass('nonelike');
	    var userId = Meteor.userId();
	    var obj = { proId: productid, userId: userId }
	    if (userId) {
	        Meteor.call('Meteoris.Products.addToFavorite', obj, function(error) {
	            if (!error) {
                    /*var name = Session.get('CATEGORYNAME');
                    var categoryId = getCategoryIdChildren( name );
                    var ProductId = ctrl.getListProducts(categoryId, Session.get('PAGE') , limit);
                    if( ProductId.count() > 0){
                        var arrayProId = ProductId.map( function(data){ return data._id});
                        Meteor.subscribe('FavoriteByProduct', arrayProId, userId);
                    }*/

	             	Meteoris.Flash.set("success", "This product has been added to your favorite list.");
	               
	            }
	        });
	    } else {
	        Session.set("REDIRECTURL", FlowRouter.current().path);
	        FlowRouter.go("/meteoris/user/login");
	    }
	},
	'click .like': function(e) {
	    e.preventDefault();
		
	    var productid = $(e.currentTarget).attr('data-id');
	    $('#unlike' + productid).removeClass('nonelike');
	    $('#like' + productid).addClass('nonelike');
	    var userId = Meteor.userId();
	    if (userId) {
	        Meteor.call('Meteoris.Products.removeFavorite', productid, userId, function(error) {
	            if (!error) {
                    /*var name = Session.get('CATEGORYNAME');
                    var categoryId = getCategoryIdChildren( name );
                    var ProductId = ctrl.getListProducts(categoryId, Session.get('PAGE') , limit);
                    if( ProductId.count() > 0){
                        var arrayProId = ProductId.map( function(data){ return data._id});
                        Meteor.subscribe('FavoriteByProduct', arrayProId, userId);
                    }*/
	                Meteoris.Flash.set("success", "This product has been removed to your favorite list.");
	            } 
	        });
	    } else {
	        Session.set("REDIRECTURL", FlowRouter.current().path);
	        FlowRouter.go("/meteoris/user/login");
	    }
	},
    'click #addToCart': function(e, tpl){
        e.preventDefault();
        ordercl.addToCart(e, tpl);
        getTotalItem();
        
    },
    'click .delete': function(e){
        e.preventDefault();
        var par = $(e.currentTarget).parent().parent().attr('id');
        var userId = getSessionUserID();

        Meteor.call('Meteoris.Cart.Delete', par, userId);
    },
    'change .updateQty': function(e){
        e.preventDefault();
        var par = $(e.currentTarget).parent().parent().attr('id');
        var qty = $(e.currentTarget).val();
        var userId = getSessionUserID();
        Meteor.call('Meteoris.Cart.Update', par, qty, userId);
    },
    'click #proceedOrder': function(){
        if( Meteor.userId() ){
            FlowRouter.go('/chooseAddress');
        }else{
            Session.set("REDIRECTURL", '/chooseAddress');
            FlowRouter.go('/meteoris/user/login');    
        }
        
    },
    'clcik .search-option li': function(e){
        e.preventDefault();
        $('.search-option li').removeClass('active');
        $(e.currentTarget).addClass('active');
    },
    'click .btn-quickview': function(e){
        var productId = $(e.currentTarget).parent().parent().attr('id');
        
        /*var categorydata = Session.get('CATEGORYDATA');
        var categoryId = getCategoryIdChildren( categorydata.name );
        var page = categorydata.page;
        */
        itemSub = Meteor.subscribe('ProductsRecommended', productId, Meteor.userId(), function(){
            Session.set('QUICKVIEWPRODUCT', productId);
        })
    }
    ,
    'mouseover .product-picture': function(e, tmp){
        $('.btn-quickview').css('display','none');
        $(e.currentTarget).find('.btn-quickview').css('display','block');
        //$(e.currentTarget).parent().find('.btn-quickview').css('display','block');
    },
    'mouseleave .product-grid': function(e, tmp){
        $('.btn-quickview').css('display','none');
    },
    'mouseover .attribute li a': function(e){
        var id = $(e.currentTarget).attr('attr');
        var proid = $(e.currentTarget).parents('.product-grid').attr('id');
        var dataAttribute = ctrl.getAttributeById( id );
        if( dataAttribute ){
            var attsrc = getImgCDNv2( dataAttribute.productImage , 'true');
            $('#'+proid+' .price').html(dataAttribute.price);
            $('#'+proid+' .product-picture img').attr('src', attsrc);
            $('#'+proid+' .attribute li').removeClass('active');
            $(e.currentTarget).parent().addClass('active');
        }
    }
});
Template.registerHelper('getListProductsHelper', function( categoryId, thumb) {
	var limit = 16;
	var page = Session.get('PAGE');
	
	var List = ctrl.getListProducts(categoryId, page , limit);
	var html = '';
	if( List.count() > 0 ){
		List.forEach( function(data, index){
            var fav = Meteoris.Favorites.findOne({proId:data._id, userId:Meteor.userId()});
            if( fav ) data.favorite = true;
            else data.favorite = false;

            if( data.hasOwnProperty('review') ){
                var len = data.review.length;
                var sum = 0;
                data.review.forEach( function(val){ sum = (val.grade)? (sum + parseInt(val.grade)):(sum+0);})
                data.rate = (sum * 100) / (len * 5);
            }else
                data.rate = 0;

			html += listProductHtml(data, thumb);
		})
	}
	
	return html;
	
});
Template.registerHelper('getOneProductHelper', function(data, thumb ){
    var data = getFavoriteRating(data);
    return listProductHtml(data, thumb);
})
getFavoriteRating = function( data ){
    var fav = Meteoris.Favorites.findOne({proId:data._id, userId:Meteor.userId()});
    if( fav ) data.favorite = true;
    else data.favorite = false;

    if( data.hasOwnProperty('review') ){
        var len = data.review.length;
        var sum = 0;
        data.review.forEach( function(val){ sum = (val.grade)? (sum + parseInt(val.grade)):(sum+0);})
        data.rate = (sum * 100) / (len * 5);
    }else
        data.rate = 0;

    return data;
}
listProductHtml = function( data , thumb){
	var html = '';
	var src = getImgForProductCDNv2( data._id , thumb);
    //console.log('pro Id', data._id);
    //console.log('old Id', data.oldId);
    var attr = Meteoris.Attributes.find({product:data.oldId});
    var listAttribute = '';
    if( attr.count() > 0 ){
        var price = attr.fetch()[0].price;
        //if( attr.count() > 1){
            var parentId = attr.fetch()[0].parent;
            var parent = Meteoris.ParentAttributes.findOne({_id:parentId});
            var liattribute = '';
            if( parent.name == 'Size'){
                //var width = 100 / attr.count();
                attr.forEach( function(at, index){
                    var active = (index == 0)? 'active':'';
                    if(index <= 4) liattribute += '<li class="'+active+'"><a href="#" attr="'+at._id+'">'+at.value+'</a></li>';
                })
            }else{
                attr.forEach( function(at, index){
                    var attsrc = getImgCDNv2( at.productImage , 'true');
                    var active = (index == 0)? 'active':'';
                    if(index <= 4) liattribute += '<li class="'+active+'"><a href="#" attr="'+at._id+'"><img src="'+attsrc+'"/></a></li>';
                    
                })
            }
            listAttribute += liattribute;
        //}
        //console.log('price attribute:', price);
    }else{
        var price = data.price;
        //console.log('price product:', price);
    }
    
	html += '<div class="col-md-3 col-xs-12 product-grid" id="'+data._id+'">';
    html +=     '<div class="product-picture">';
    html +=       '<a class="btn btn-success btn-quickview" href="#" data-toggle="modal" data-target="#quickView">Quick View</a>';
	html += 	  '<a href="/details/'+slugTitle(data.title)+'"><img src="'+src+'" style="width:201px;height:201px"></a>';
	html +=     '</div>';
    html += 	'<a href="/details/'+slugTitle(data.title)+'"><h3 class="title">'+data.title+'</h3></a>';
    //discount html
    var curdate=new Date();
    var timestp=curdate.getTime();
    if(data.hasOwnProperty("discount")){
        if(timestp >= parseInt(data.discount.startdate) && timestp <= parseInt(data.discount.enddate)){
            html+='<h4>'+data.discount.discount+'%</h4>';
        }
    }else{
        var disc=Discount.findOne({brand:data.Brand});
        if(disc){ 
            if(timestp>=parseInt(disc.startdate) && timestp<=parseInt(disc.enddate)){
                html+='<h4>'+disc.discount+'%</h4>';
             }
        }
    }
   
    //end discount
    html +=     '<div class="clear"></div>';
    html +=     '<div class="rating-container rating-md rating-animate">';
    html +=         '<div class="rating"><span class="empty-stars"><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span><span class="star"><i class="glyphicon glyphicon-star-empty"></i></span></span><span class="filled-stars" style="width: '+data.rate+'%;"><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span><span class="star"><i class="glyphicon glyphicon-star"></i></span></span></div>';
    html +=     '</div>';
    html +=     '<div class="fav-wrapper">';
    if( data.favorite == false)
        html +=     '<a href="#" data-id="'+data._id+'" class="heart  unlike unlike'+data._id+'"><span class="fa fa-heart-o btn-unlike"></span></a>';
    else 
        html +=     '<a href="#" data-id="'+data._id+'" class="heart  like like'+data._id+'"><span class="fa fa-heart fa-heart-full btn-like"></span></a>';
    html +=     '</div>';
    html +=     '<div class="clear"></div>';
    html +=     '<ul class="attribute">'+listAttribute+'</ul>';
    html +=     '<div class="clear"></div>';
    html +=     '<div class="price-wrapper"><p>ریال  <span class="price">'+price+'</span></p></div>';
    html +=     '<div class="addtocart-wrapper">';
    //html +=     '<label class="quantity" for="select">Quantity</label><select id="qty'+data._id+'" name="select" class="quantity" size="1"><option value="1">1</option></select>';
    html +=     '<button class="btn btn-addtocart" id="addToCart"><span class="cart pull-left"></span> ADD TO CART</button>';
    html +=     '</div>';
    html += '</div>';
    return html;
}
Template.registerHelper('quickView', function( thumb ){
    var id_product = Session.get('QUICKVIEWPRODUCT');

    if( id_product ){
        var data = Meteoris.Products.findOne({_id:id_product});
        if( data )
            return quickViewProduct(data, thumb);
    }
})
window.quickViewProduct = function( data , thumb){
    var html = '';
    var src = getImgForProductCDNv2( data._id , thumb);
    var attr = Meteoris.Attributes.find({product:data.oldId});
    var price = (attr.count() > 0)? attr.fetch()[0].price:data.price;
    data.price = price;
    data.src = src;
    //console.log(data);
    return data;
}

Template.registerHelper('getOneContentHelper', function(data){
    return listContentHtml(data);
})
window.listContentHtml = function( data ){
    var html = '';
    var thumb = '';
    if( data.hasOwnProperty('url') ){
        thumb = '<video  class="img-responsive" src="/videos/'+data.url+'" />';
    }else{
        var src = getImgCDNv2( data._id , 'true');
        thumb = '<img  class="img-responsive" src="'+src+'" style="width:201px;height:201px">';
        
    }
    html += '<div class="col-md-3 col-xs-12" id="'+data._id+'">';
    html +=     '<a href="/content/'+slugTitle(data.title)+'">'+thumb+'</a>';
    html +=     '<a href="/content/'+slugTitle(data.title)+'"><h3 class="title">'+data.title+'</h3></a>';
    html += '</div>';
    return html;
}
Template.registerHelper('getCategories', function() {
   Meteoris.Categories.find();
});
Template.registerHelper('isUserLoggedIn', function() {
 	if( Meteor.userId() ) return true;
 	else return false;
});

Template.registerHelper('getCategoryIdChildren', function() {
	var catdata = Session.get('CATEGORYDATA');
	var list = getCategoryIdChildren( catdata.name );
	return {list:list};
});
Template.registerHelper('getCurrentCategorySlug', function() {
	var name = FlowRouter.current().params.name;
	var page = Session.get('PAGE');
	var prev = parseInt(page) - 1;
	var next = parseInt(page) + 1;
	var prevStatus = (page<=1)? false:true;
    var categoryId = getCategoryIdChildren( name );

	

	/*var total = Math.ceil(Session.get('TOTALPRODUCT') / limit);
    console.log('total:', total);
	var nextStatus = (page>=total)? false:true;
	return {name:name, prev:prev, next:next, prevstatus:prevStatus, nextstatus: nextStatus };
    */
});

start = 1;
end = 9;
step = 4;
Template.registerHelper('getNumPage', function(  ) {
	var name = FlowRouter.current().params.name;
	var page = Session.get('PAGE');
    var categoryId = getCategoryIdChildren( name );
	var limit = 16;
	Meteor.call('Meteoris.Count.Products', categoryId, function(err, count){
		if(!err){
			Session.set('TOTALPRODUCT', count);
		}
	})
	var total = Session.get('TOTALPRODUCT') / limit;
	var numpage = Math.ceil(total);
	var totalpage = [];
    /*
    if(page >= start + step){
        if((page - start) >= step){ 
            start = start + step;
            end = end + step; 
        }
    }else{
        //if( (page - start) < step ){

        }
        //start  = page < (end - start)? start - step : start;
        //end    = page < (end - start)? end - step : start; 
    }
    */
	if( numpage > 0 ){
		for(i=start; i <= numpage; i++){
			totalpage.push({num:i});
		}
	}
	return totalpage;
    
	
	/*var total = Math.ceil(Session.get('TOTALPRODUCT') / limit);
	var per_page = 10;
	var current_page = 1;//Session.get('PAGE');
	var adjacent_links = 4;
	
	//echo ' <p>Page: '.$current_page.' / Total: '.$total.'</p>';
	var p = Pagination(total, per_page, current_page, adjacent_links);
	console.log('page show:', p );
	*/
	//return {name:name, prev:prev, next:next};
});
Template.registerHelper('getCart', function() {
    var userId = getSessionUserID();
    var cart = Meteoris.Carts.findOne({userId:userId});
    if( cart ){
        cart.items = cart.items.map( function(data, index){
            data.index = index +1;
            return data;
        })
        var obj = {hasCart:true, cart:cart};
    }else
         var obj = {hasCart:false}
    
    return obj;
});
Template.registerHelper('getProductInfo', function(id_product) {
    var data = Meteoris.Products.findOne({_id:id_product});
    return data;
});
Template.registerHelper('getTotalItem', function(id_product) {
    getTotalItem();
    //var cart = Meteoris.Carts.findOne({userId:userId});
    var count = Session.get('TOTALITEMS');
    if( count ) return count;
    else return 0;
});
getTotalItem = function(){
    var userId = getSessionUserID();
    Meteor.call('Meteoris.Cart.getTotalItem', userId, function(err, total){
        if(!err) Session.set('TOTALITEMS', total);
    })
}
function Pagination(data, limit, current, adjacents )
{
	var result = [];
	
	result = range(1, Math.ceil(data / limit));
	
    if (current && adjacents )
    {
    	//console.log('adjacents:', Math.floor( adjacents ) * 2 +1);
        if ((adjacents = Math.floor( adjacents ) * 2 +1) >= 1)
        {
            result = result.slice(Math.max(0, Math.min(result.length - adjacents, current - Math.ceil(adjacents / 2))), adjacents);
        	
        }
    }
    
    return result;
}
function range(start, stop){
	var arr = [];
	while(start <= stop){
	   arr.push(start++);
	}
	return arr;
};
/*
function Pagination(data, limit = null, current = null, adjacents = null)
{
    var result = [];

    //if (data && limit)
    //{
        result = Math.ceil(data / limit);

        if (current && adjacents )
        {
            if ((adjacents = Math.floor(adjacents) * 2 + 1) >= 1)
            {
                //result = result.slice(Math.max(0, Math.min(count(result) - adjacents, parseInt(current) - Math.ceil(adjacents / 2))), adjacents);
            }
        }
    //}

    return result;
}*/
function addChildren(source, identifier, dest) {
  source.filter(function(val) {
    return val.parent == identifier;
  }).forEach(function(val) {
    dest.push(val._id);
    addChildren(source, val._id, dest);
  });
}
function buildTree(source, parentId) {
  var dest = [];
  addChildren(source, parentId , dest);
  return dest;
}

getCategoryIdChildren = function( name ){
	var list = [];
	if (name != 'undefined' && name != null) {
        var l = Meteoris.Categories.findOne({ title: name });
        if (l == 'undefined' || l == null) {
            var title = name;
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            
            var l = Meteoris.Categories.findOne({ "i18n.en.title": title });
        }

        if( l ){
	        var categories = Meteoris.Categories.find().fetch();
	        var parentId = l._id;
			var list = buildTree(categories, parentId);
			list.push(l._id);
			
    	}
    	
    }
    return list;
}
window.getOriginalSize = function( src ){
	return src.replace('/small','');
}

Template.registerHelper('getImgForProductCDN', function(id, thumb) {
   return getImgForProductCDNv2(id, thumb);
});
window.getImgCDNv2 = function(id, thumb) {
    if (id.indexOf('http') > -1) {
        return id;
    } else {
        var img = Meteoris.Images.findOne({ _id: id });

        //var currentdomain = Session.get('ABSOLUTEURL');
        
        //var localcdn = currentdomain;
        var cdnurl = 'http://54.71.1.92/'; //(currentdomain.indexOf('localhost') > -1 )? 'http://54.171.217.142/':localcdn;
        if (img){
        	if( thumb == 'true')
            	return cdnurl+ "upload/small/" + img.copies.images.key;
        	else
        	   return cdnurl + "upload/large/" + img.copies.images.key;
        
        }else 
            return id;
        
    }

}
window.getImgForProductCDNv2 = function(id_product, thumb) {
    var prod = Meteoris.Products.findOne({ _id: id_product });
    if (prod) {
        if (!prod.image || prod.image.length == 0) {

            var attr = Meteoris.Attributes.find({ product: prod.oldId });
           
            if (attr.count() > 0 ) {
                var firstattr=attr.fetch()[0];
                return getImgCDNv2(firstattr.productImage, thumb);
                
            } else {
                return id_product;
            }
        } else {
            if (!prod.image[0]) {
                return id_product;
            } else
                return getImgCDNv2(prod.image[0], thumb);
        }
    } else {
        return id_product;
    }
}
Template.registerHelper('slugTitle', function( title ) {
   return slugTitle( title );
});
window.slugTitle = function(title) {
    if (!title)
        return;
    title = title.replace(/\-/g, "(minus)");
    title = title.replace(/\s/g, "-");
    title = title.replace(/\%/g, "(percentag)");
    title = title.replace(/\+/g, "(plush)");
    title = title.replace(/\ô/g, "(ocir)");
    title = title.replace(/\®/g, "(copyright)");
    title = title.replace(/\°/g, "(number)");
    title = title.replace(/\Ô/g, "(bigocir)");
    title = title.replace(/\²/g, "(square)");
    title = title.replace(/\`/g, "(accentaigu)");
    title = title.replace(/\é/g, "(eaccentaigu)");
    title = title.replace(/\É/g, "(bigeaccentaigu)");
    title = title.replace(/\&/g, "(and)");
    title = title.replace(/\//g, "(slash)");
    title = title.replace(/\’/g, "(apostrophe)");
    title = title.replace(/\'/g, "(quote)");
    title = title.replace(/\!/g, "(warning)");
    title = title.replace(/\?/g, "(question)");
    title = title.replace(/\$/g, "(dolla)");
    title = title.replace(/\è/g, "(eaccentgrave)");
    title = title.replace(/\–/g, "(hyphen)");
    //title = title.toLowerCase();
    return title;
}
window.unslugTitle = function(title) {
	if (!title)
        return;
    title = title.replace(/\-/g, " ");
    title = title.replace(/\(percentag\)/g, "%");
    title = title.replace(/\(plush\)/g, "+");
    title = title.replace(/\(ocir\)/g, "ô");
    title = title.replace(/\(minus\)/g, "-");
    title = title.replace(/\(copyright\)/g, "®");
    title = title.replace(/\(number\)/g, "°");
    title = title.replace(/\(bigocir\)/g, "Ô");
    title = title.replace(/\(square\)/g, "²");
    title = title.replace(/\(accentaigu\)/g, "`");
    title = title.replace(/\(eaccentaigu\)/g, "é");
    title = title.replace(/\(bigeaccentaigu\)/g, "É");
    title = title.replace(/\(and\)/g, "&");
    title = title.replace(/\(slash\)/g, "/");
    title = title.replace(/\(apostrophe\)/g, "’");
    title = title.replace(/\(quote\)/g, "'");
    title = title.replace(/\(warning\)/g, "!");
    title = title.replace(/\(question\)/g, "?");
    title = title.replace(/\(dolla\)/g, "$");
    title = title.replace(/\(eaccentgrave\)/g, "è");
    title = title.replace(/\(hyphen\)/g, "–");
    return title;
}
window.getTimestamp = function(){
	var date = new Date();
   	var timestamp = date.getTime();
   	return timestamp;
}
Template.registerHelper('getHumanDate', function( timestamp ) {
   return getHumanDate( timestamp );
});
window.getHumanDate = function( timestamp ){
  var d = new Date(timestamp * 1000),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hour = d.getHours();
        minx = d.getMinutes();
        min  = (minx.length <= 1)? '0'+minx: minx;
        secx =  d.getSeconds();
        sec  = (secx.length <= 1)? '0'+secx: secx;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-')+' '+hour+':'+min+':'+sec;
}
Template.registerHelper('getButtonAddToFavorite', function( id_product ) {
   return getButtonAddToFavorite( id_product );
});
window.getButtonAddToFavorite = function(id_product){
    var userid = Meteor.userId();
    var fav = Meteoris.Favorites.findOne({ proId: id_product, userId: userid });
    if (fav) {
        var heartempty = 'nonelike';
        var heartfull = '';
    } else {
        var heartempty = '';
        var heartfull = 'nonelike';
    }
    var html = '';
    if (TAPi18n.getLanguage() == 'fa') {
        html += '<a href="#" data-id="' + id_product + '" class="heart ' + heartempty + ' unlike unlike' + id_product + '"><span class="fa fa-heart-o btn-unlike">&nbsp;&nbsp;<span>افزودن به فهرست علاقه‌مندی‌ها</span></span></a>';
        html += '<a href="#" data-id="' + id_product + '" class="heart ' + heartfull + ' like like' + id_product + '"><span class="fa fa-heart fa-heart-full btn-like" style="">&nbsp;&nbsp;<span>حذف از فهرست علاقه‌مندی‌ها</span></span></a>';

    } else {
        html += '<a href="#" data-id="' + id_product + '" class="heart ' + heartempty + ' unlike unlike' + id_product + '"><span class="fa fa-heart-o btn-unlike">&nbsp;&nbsp;<span>ADD TO FAVORITE</span></span></a>';
        html += '<a href="#" data-id="' + id_product + '" class="heart ' + heartfull + ' like like' + id_product + '"><span class="fa fa-heart fa-heart-full btn-like">&nbsp;&nbsp;<span>REMOVE FAVORITE</span></span></a>';

    }
    return html;
}
window.getSessionUserID = function(){
    var currentUserID = Meteor.userId();
    if( currentUserID ){
        return currentUserID;
    }else{
        var SessionID = Session.get('userId');
        if( SessionID )
            return SessionID;
        else{
            Session.setPersistent('userId', Random.id());
            return Session.get('userId');
        }
    }
}

Template.registerHelper('isCurrentLangEng', function() {
    var currentLang = TAPi18n.getLanguage();

    if( currentLang == 'en') return true;
    return false;
});
Template.registerHelper('directionContainer', function() {
    var currentLang = TAPi18n.getLanguage();
    if( currentLang == 'en') return 'container-en';
    else return 'container-fa';
});
Template.registerHelper('directionButton', function() {
    var currentLang = TAPi18n.getLanguage();
    if( currentLang == 'en') return 'pull-right';
    else return 'pull-left';
});
Template.registerHelper('alignright', function() {
    var currentLang = TAPi18n.getLanguage();
    if( currentLang == 'en') return;
    else return 'align-right';
});
Template.registerHelper('checkIsUserLoggedIn', function() {
    if( Meteor.userId() ) return true;
    else return false;
});
window.emailValidate = function(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
        return true;
    } else {
        return false;
    }
}
window.phonenoValidate = function(phoneno) {
    var phoneFormat = /^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var phoneFormat1 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(phoneno=="" || phoneno==null || phoneno==undefined){
        return false;
    }else{
        if (phoneno.match(phoneFormat) || phoneno.match(phoneFormat1)) {
            return true;
        } else return false;
    }
}
window.isEmptyCart = function(router){
    router.subsReady("myCart", function() {
        var cart = Meteoris.Carts.findOne({userId:getSessionUserID()});
        if( !cart )
            FlowRouter.go('/checkout');
    });
}
window.getOrderItemsByID = function( userId ){
    var myorder = Meteoris.Carts.findOne({userId:userId});
    if( myorder ){
        var items = myorder.items;
        var myitems = [];
        if (items.length > 0) {
            for (i = 0; i < items.length; i++) {
                var myproduct = Meteoris.Products.findOne({ _id: items[i].id_product });
                var myattr = Meteoris.Attributes.findOne({ _id: items[i].attribute });
                var src = '';
                var absoluteurl = Meteor.absoluteUrl();
                var baseurl = (absoluteurl == 'http://localhost:3000/') ? 'http://54.71.1.92/upload/' : absoluteurl + 'uploads/';
                var myattrValue = '';
                var parentName = '';
                var price = 0;
                if ( myattr && myattr.hasOwnProperty('productImage') ) {
                    myattrValue = myattr.value;
                    price = myattr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var parentvalu = getParentAttrByID(myattr.parent);
                    var parentName = (parentvalu) ? parentvalu.name : '';
                    var myimage = getImgCDNv2(myattr.productImage, 'true');
                    if (myimage) 
                        src = myimage; //absoluteurl+'uploads/'+myimage;
                    else 
                        src = myattr.productImage;
                
                } else {
                    price = myproduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var myproductimg = getImgCDNv2(myproduct.image[0], 'true');
                    if (myproductimg) {
                        src = myproductimg;
                    } else {
                        src = myproduct.image[0];
                    }
                }
                var obj = {
                    "img": src,
                    "qty": items[i].quantity,
                    "name": myproduct.title,
                    "attr": myattrValue,
                    "parentattr": parentName,
                    "price": price,
                    "subtotal": items[i].subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                myitems.push(obj);
            }
            var total = myorder.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         
            return { total: total, items: myitems };
        } else return;
    }
}
window.getParentAttrByID = function(parentId) {
    return Meteoris.ParentAttributes.findOne({ _id: parentId });
}
/*
window.clickMyPage = function( page ){
    var name = Session.get('CATEGORYNAME');
    var categoryId = getCategoryIdChildren( name );
    var limit = 16;
    Meteor.autorun(function() {
        if( itemSub ) {
            itemSub.stop();
        }
        itemSub = Meteor.subscribe('Products', categoryId, page, limit);
    });  
}*/
window.getPaginationData = function(){
    //var total = Math.ceil(Session.get('TOTALPRODUCT') / limit);
    var total = Session.get('TOTALPRODUCT');
    return { items: total, itemsOnPage: limit, hrefTextPrefix:'', cssStyle: 'light-theme' }

}

Template.registerHelper("convertMsTimeStamp", function(tms) {
    var d = new Date(tms), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = 'AM',
        hTime;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
    // ie: 2013-02-18, 8:35 AM 
    hTime = yyyy + '/' + mm + '/' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return hTime;
});
/*window.checkalldiscount = function(idprod){
    var oneprod=Meteoris.Products.findOne({_id:idprod});
    if(oneprod.hasOwnProperty('discount')){
        return true;
    }else{
        if()
    }
}*/