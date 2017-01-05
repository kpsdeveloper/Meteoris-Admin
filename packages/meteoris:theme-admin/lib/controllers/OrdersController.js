Namespace('Meteoris.OrdersController');

Meteoris.OrdersController = Meteoris.Controller.extend({
	getListOrders: function (status, date, page, limit) {
		var skip = (page<=1)? 0 : (page - 1) * limit;
		var fields = { fields:{_id:1, userid:1,total:1,status:1,time:1}, sort:{time:-1},limit:limit};
		if( status )
			var data = Meteoris.Orders.find({status:status, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
        else
        	//var data = Meteoris.Orders.find({date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
        	var data = Meteoris.Orders.find({time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
        console.log("MDAAAA ");
        console.log(data);
        var list=data;
       /* var list = data.map( function(doc){
        	var user = Meteor.users.findOne({_id:doc.userid});
        	if(user) doc.username = user.profile.name;
        	else doc.username = 'No name';
        	return doc;
        })*/
 
        return list;
	},
	getOrderDetails: function(id){
		var order = Meteoris.Orders.findOne({_id:id});
		console.log(order);
		if( order ){
			/*var addressId = (order.hasOwnProperty('addressBook'))? order.addressBook.addressId:'';
			var userAddress = [];
			if( addressId )
				userAddress = Meteoris.Accounts.find({_id:addressId});
			order.userAddress = userAddress;
			order.items = order.items.map( function(data, index){
	            data.index = index +1;
	            return data;
	        })*/
	       	return order;
		}
	},
	removeOneOrder:function(id){
		Meteor.call("deleteOneorder",id);
		
	}
})