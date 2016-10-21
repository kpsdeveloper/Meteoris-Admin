Meteor.methods({
	insertBanner:function(obj) {
		return Banners.insert(obj);
	},
	removeBanner:function(id){
		return Banners.remove({_id:id});
	},
	removeProductIndex:function(id,proId){
		console.log(id+'>>>>'+proId);
		return Banners.update({_id:id},{ $pull: { products: { $in: [ proId ] }}});
	},
	updateBanner:function(id,obj){
		return Banners.update({_id:id},{$set:obj});
	}
});