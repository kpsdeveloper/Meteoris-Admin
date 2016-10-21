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
        if( total.count() > 0 )
        	return total.count();
    	return 0;
    },
    "Meteoris.Products.Insert": function(obj){
    	Meteoris.Products.insert(obj);
    },
    "Meteoris.Products.Remove": function(id){
    	Meteoris.Products.remove({_id:{$in:id}});
    }
});