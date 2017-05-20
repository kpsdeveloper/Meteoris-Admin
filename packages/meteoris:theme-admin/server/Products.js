Meteor.methods({
    "Meteoris.Count.Products": function( categoryId, keyword) {
    	var fields = {fields:{_id:1,category:1}};
    	if( categoryId && keyword == ""){
        	var total = Meteoris.Products.find({category:{$in:categoryId}}, fields);
        }else if( categoryId == "" && keyword ){
        	var total = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
        }else if( categoryId && keyword ){
        	var total = Meteoris.Products.find({category:{$in:categoryId}, $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
        }else
        	var total = Meteoris.Products.find({}, fields);
            
        if(total.count() <= 0)
            var total = Meteoris.Products.find({'attribute.barcode':parseInt(keyword)}, fields);

        if( total.count() > 0 )
        	return total.count();
    	return 0;
    },
    "Meteoris.Products.Insert": function(obj){
    	Meteoris.Products.insert(obj);
    },
    "Meteoris.Products.Remove": function(id){
    	Meteoris.Products.remove({_id:{$in:id}});
    },
    "Meteoris.Products.Update": function(id, obj){
    	Meteoris.Products.update(id, {$set:obj});
    },
    updateViewStatus:function(idreview){
        //Meteoris.Products.update({_id:idproduct}, {$set:{"review.viewstatus":"1"}});
        return  Meteoris.Products.update({"review.idreview":idreview},{$set:{"review.$.viewstatus":"1"}})
    },
    approveReview:function(idreview,status){
         return  Meteoris.Products.update({"review.idreview":idreview},{$set:{"review.$.approve":status}})
    },
    TestOnereview:function(idproduct,idreview){
        //var pro= Meteoris.Products.find({_id:idproduct,"review.idreview": idreview},{_id: 0, review: {$elemMatch: {idreview: idreview}}});
        var pro=Meteoris.Products.find({"review.idreview":"bznpo837uZSKthGsW"},{"review.$":1})
        console.log("=====");
        console.log(pro.review);
        console.log(pro);
        return pro;
    },
    countProductFavorite:function(q){
        return Meteoris.Favorites.find({}).count();
    }
});