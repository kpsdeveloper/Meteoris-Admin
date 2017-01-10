Namespace('Meteoris.OrdersController');

Meteoris.OrdersController = Meteoris.Controller.extend({
	getListOrders: function (status, date, page, limit) {
		var skip = (page<=1)? 0 : (page - 1) * limit;
		var fields = { fields:{_id:1, userId:1,total:1,status:1,date:1}, sort:{date:-1},limit:limit};
		if( status )
			var data = Meteoris.Orders.find({status:status, date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
        else
        	var data = Meteoris.Orders.find({date:{$gte:date.sdate}, date:{$lte:date.edate}, date:{$exists:1}}, fields);
        var list = data.map( function(doc){
        	var user = Meteor.users.findOne({_id:doc.userId});
        	if(user) doc.username = user.profile.name;
        	else doc.username = 'No name';
       
        	return doc;
        })

        return list;
	},
	getOrderDetails: function(id){
		var order = Meteoris.Orders.findOne({_id:id});
		
		if( order ){
			var addressId = (order.hasOwnProperty('addressBook'))? order.addressBook.addressId:'';
			var userAddress = [];
			if( addressId )
				userAddress = Meteoris.Accounts.findOne({_id:addressId});
			order.userAddress = userAddress;

			order.items = order.items.map( function(data, index){
	            data.index = index +1;
	            data.attribute = Meteoris.Attributes.findOne({_id: data.attribute});
	            data.parentAttr = Meteoris.ParentAttributes.findOne({_id: data.attribute.parent})
	            return data;
	        })
	        console.log(order);
	       	return order;
		}
	},
	getListProductsSearch: function(keyword,limit){
		var fields = { fields:{_id:1, title:1,price:1,category:1,discount:1, category:1, Brand:1, oldId:1,image:1,review:1,recommended:1,date:1}, sort:{date:-1},limit:limit};
        var data = Meteoris.Products.find({ title: { $regex: new RegExp(keyword, "i") } }, fields);
       	return data;
	},
	getListAttributeByProduct: function( oldId ){
		var attr = Meteoris.Attributes.find({product:oldId});
		console.log('OldID:', oldId);
		console.log(attr.fetch());
		if( attr.count() > 0 ){
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
	        return liattribute;
	    }
	}
})