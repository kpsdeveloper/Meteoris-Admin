
Meteor.methods({
    "Meteoris.Orders.Count": function( status, date, q) {
    	var fields = {fields:{_id:1}};
    	if( status && q == ""){
			var total = Meteoris.Orders.find({status:status, date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
		}else if( status == "" && q ){
			var total = Meteoris.Orders.find({_id: { $regex: new RegExp(q, "i") }, date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
		}else if( status && q ){
			var total = Meteoris.Orders.find({status:status, _id: { $regex: new RegExp(q, "i") }, date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
		}else
	    	var total = Meteoris.Orders.find({date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
	    	
        return total.count();
    },
});