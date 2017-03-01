var ctrl = new Meteoris.ProductsController();
limit = 30;
Template.meteoris_themeAdminMain.events({
    'change #chooseCategory': function(e){
        var id = $(e.currentTarget).val();
        var params = Session.get('PRODUCTPARAMS');
        var page = (params.page)? params.page:1;
        if(id){
            params.categoryId = id;
            FlowRouter.setQueryParams({categoryId: id, page:page});
        }else
            FlowRouter.setQueryParams({page:page, categoryId:null});
    },
    'keyup #search': function(e){
        var keyword = $(e.currentTarget).val();
        var params = Session.get('PRODUCTPARAMS');
        var page = (params.page)? params.page:1;
       
        if(keyword !="" && keyword.length > 3){
            params.q = keyword;
            FlowRouter.setQueryParams(params);
        }else
            FlowRouter.setQueryParams({categoryId:params.categoryId, page:page, q:null});
    }
})
Template.registerHelper('getProductImage', function(id, thumb) {
   return getProductImage(id, thumb);
});
Template.registerHelper('date_formater', function(date) {
    var normalDate = getHumanDate(date);
    return normalDate;
});
Template.registerHelper('getCategoryByID', function( categoryID ) {
   return ctrl.getCategoryByID( categoryID );
});
Template.registerHelper('getParentCategories', function( ) {
   return ctrl.getParentCategories( );
});
Template.registerHelper('getOrder', function(id) {
    console.log('id', id);
    var cart = Meteoris.Orders.findOne({_id:id});
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
addChildren = function(source, identifier, dest) {
  source.filter(function(val) {
    return val.parent == identifier;
  }).forEach(function(val) {
    dest.push(val._id);
    addChildren(source, val._id, dest);
  });
}
buildTree = function(source, parentId) {
  var dest = [];
  addChildren(source, parentId , dest);
  return dest;
}
window.getCategoriesSub = function( parentId ){
    var categories = Meteoris.Categories.find().fetch();
    var list = buildTree(categories, parentId);
    list.push(parentId);
    return list;
}

getImage = function(id, thumb) {
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
getProductImage = function(id_product, thumb) {
    var prod = Meteoris.Products.findOne({ _id: id_product });
    if (prod) {
        if (!prod.image || prod.image.length == 0) {

            var attr = Meteoris.Attributes.find({ product: prod.oldId });
           
            if (attr.count() > 0 ) {
                var firstattr=attr.fetch()[0];
                return getImage(firstattr.productImage, thumb);
                
            } else {
                return id_product;
            }
        } else {
            if (!prod.image[0]) {
                return id_product;
            } else
                return getImage(prod.image[0], thumb);
        }
    } else {
        return id_product;
    }
}
getTimestamp = function( mydate ){
    var date = new Date(mydate);
    var timestamp = date.getTime();
    return timestamp;
}
Template.registerHelper('getHumanDate', function( timestamp ) {
   return getHumanDate( timestamp );
});

getHumanDate = function( timestamp ){
    if( timestamp ){
    var d = new Date(timestamp),
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
    if( year )
    var mydate = [year, month, day].join('-')+' '+hour+':'+min;

    return mydate;
    }
    else return 0;
}
Template.registerHelper('getImgForProductCDN', function(id, thumb) {
   return getImgForProductCDNv2(id, thumb);
});
getImgCDNv2 = function(id, thumb) {
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
getImgForProductCDNv2 = function(id_product, thumb) {
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

Template.registerHelper('getProductPrice', function(id) {
   return getProductPrice(id);
});
Template.registerHelper('getProductBarcode', function(id) {
   return getProductBarcode(id);
});
Template.registerHelper('getProductBarcodeOrPrice', function(id,status) {
   return getProductBarcodeOrPrice(id,status);
});

getProductPrice=function(id){
    if(id){
        var oneproduct=Meteoris.Products.findOne({_id:id});
        if(oneproduct){
            var getatrr=Meteoris.Attributes.find({product:oneproduct.oldId});
            if(getatrr){
                var data=getatrr.fetch()[0];
                return data.price;
            }
        }
        
    }
}
getProductBarcode=function(id){
    if(id){
        var oneproduct=Meteoris.Products.findOne({_id:id});
        var getatrr=Meteoris.Attributes.find({product:oneproduct.oldId});
        if(getatrr){
            var data=getatrr.fetch()[0];
            return data.barcode;
        }
    }
}

getProductBarcodeOrPrice=function(proid,status){
    //if(status=="price"){
        var oneproduct=Meteoris.Products.findOne({_id:proid});
        console.log("=====M HEREEEE");
        if(oneproduct){
            var allprice=[];
            var allattr=oneproduct.attribute;
           /* allattr.forEach(function(val){
                allprice.push(val.price);
            });
            
            allprice.sort(function(a, b){return a-b});
            return allprice[0];*/
            allattr.sort(function(a, b){return a.price-b.price});
            console.log(allattr);
            if(status=="price"){
                return allattr[0].price;
            }else if(status=="barcode"){
                 return allattr[0].barcode;
            }else{
                return;
            }
            
        }
    /*}else if(status=="barcode"){
        return;
    }else{
        return;
    }*/
}

Template.registerHelper('getdisplayusername', function(id) {
   return getdisplayusername(id);
});

window.getdisplayusername=function(id){
    if(id){
        var user=Meteor.users.findOne({_id:id});
        if(user){
            if(user.profile.username){
                console.log("FOUNDSER");
                return user.profile.username;
            }else{
                console.log("FOUND@22222");
                return user.profile.name;
            }
        }
        
   }
}

/*Template.registerHelper("getProductTitle",function(id_product){
    return getProductTitle1(id_product);
});

window.getProductTitle=function(id){
    var oneprod=Meteoris.Products.findOne({_id:id});
    if(oneprod){
        return oneprod.title;
    }
    
}*/
Template.registerHelper('getProductThumbnail', function(id, barcode){
    return getProductThumbnail(id, barcode);
})
getProductThumbnail = function( id_product, barcode){
    var prod = products.findOne({_id:id_product, attribute: {"$elemMatch": {barcode: barcode}}});
    var thumb = '';var fullimage = '';
    if( prod ){
        var attr = prod.attribute[0];
        if (attr.image instanceof Array){
            thumb = attr.image[0].replace('/CDN','/COMPRESSED');
            fullimage = attr.image[0];
        }else{
            thumb = attr.image.replace('/CDN','/COMPRESSED');
            fullimage = attr.image;
        }
         return {alt:'', src:thumb, fullimage:fullimage };
    }else{
        var prod = products.findOne({_id:id_product});
        if( prod ){
            if (prod.image instanceof Array){thumb = prod.image[0].replace('/CDN','/COMPRESSED');
                fullimage = prod.image[0];
            }else{
                thumb = prod.image.replace('/CDN','/COMPRESSED');
                fullimage = prod.image;
            }
            return {alt:'', src:thumb, fullimage:fullimage };
        }
    }
}
