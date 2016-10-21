Meteor.methods({
	getBrand:function() {
		return Meteoris.Products.aggregate(
				    {"$group" : { "_id": "$Brand", "count": { "$sum": 1 } } },
				    {"$match": {"_id" :{ "$ne" : 'Tester' } , "count" : {"$gt": 1} } },
				    { "$sort" : { "_id" : 1} }
				)
	},
	insertdiscount:function(data){
		return Discount.insert(data);
	},
	updateProductDis:function(idprod,data){
		return Meteoris.Products.update({_id:idprod},{$set:data});
	},
	removeDiscountByBrand:function(id){
		return Discount.remove({_id:id});
	},
	removeDiscountByProduct:function(id){
		return Meteoris.Products.update({_id:id}, {$unset: {discount:1}});
	},
	updatediscountByProduct:function(id,data){
		return Meteoris.Products.update({_id:id},{$set:data});
	},
	updatediscountByBrand:function(id,data){
		console.log('id>>>>'+id);
		console.log(data);
		return Discount.update({_id:id},{$set:data});
	}
});