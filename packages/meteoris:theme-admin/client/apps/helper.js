var ctrl = new Meteoris.ProductsController();
limit = 16;
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
        /*console.log(categoryId);
        Meteor.subscribe('Products', categoryId, page, limit,function(){
            Meteor.call('Meteoris.Count.Products', function(err, count){
                if(!err){
                    $('#pagination').pagination({ items: count, itemsOnPage: limit, currentPage:page, hrefTextPrefix:'?page=', cssStyle: 'light-theme' });
                }
            })
        })*/    
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

    return [year, month, day].join('-')+' '+hour+':'+min;
}