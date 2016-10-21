Meteor.methods({
	"Meteoris.Cart.addToCart": function (data) {
		if( data ){
			var id_product = data.id_product;
			var id_attribute = data.attribute;
			var userId = data.userId;
			var myproduct = Meteoris.Products.findOne({ _id: id_product });
		    var price;
		    var subtotal = 0;
		    var qty = parseInt(data.qty);
		    if (myproduct) {
		        var oldId = myproduct.oldId;
		        var attr = Meteoris.Attributes.findOne({ _id: id_attribute });
		        if (attr) 
		            price = attr.price;
		        else
		            price = myproduct.price;
		    }
		    var cart = Meteoris.Carts.findOne({userId: userId});
		    price = price.toString().replace(/\s/g, '');
		   	var items = [];
		    if( cart ){
		    	var sameproduct = Meteoris.Carts.findOne({ 'items.id_product': id_product, userId: userId, 'items.attribute': id_attribute });
		    	if( sameproduct ){
		    		var total = 0;
		    		cart.items.forEach( function(val, index){
		    			if( val.id_product == id_product){
		    				qty = qty+val.quantity;
		    				var subtotal = qty * val.price;
		    				total =  total + subtotal;
		    				items.push({id_product:id_product, attribute:val.attribute, price: val.price, quantity:qty, subtotal: subtotal })
		    			}else{
		    				items.push(val);
		    				total =  total + val.subtotal;
		    			}
		    			
		    		})
		    		Meteoris.Carts.update({_id:cart._id},{$set:{total:total, items:items}});
		    	}else{
		    		var subtotal = qty * price;
		    		var total =  cart.total + subtotal;
		    		items = cart.items;
		    		items.push({id_product:id_product, attribute:id_attribute, price: price, quantity:qty, subtotal: subtotal}) 
				    Meteoris.Carts.update({_id:cart._id},{$set:{total:total, items:items}});
		    	}
		    }else{
		    	var subtotal = qty * price;
		    	var total = subtotal;
		    	//1st record in cart
		    	var item = Array({id_product:id_product, attribute:id_attribute, price: price, quantity:qty, subtotal: subtotal})
			    var data = {
			    		userId:userId,
			    		total:total,
			    		status:0,
			    		items:item,
			    		date:data.date
			    }
			    Meteoris.Carts.insert( data );
		    } 
		}
	},
	'Meteoris.Cart.Delete': function(str, userId){
		var aid = str.split('-');
		var index = parseInt(aid[1]) - 1;
		var cart = Meteoris.Carts.findOne({userId: userId});
		if( cart ){
			if( cart.items.length <= 1){
				Meteoris.Carts.remove({_id:cart._id});
			}else{
				cart.items.splice(index, 1);
				var total = 0;
				cart.items.forEach( function(doc){
						total = total + doc.subtotal;
				});
				Meteoris.Carts.update({_id:cart._id},{$set:{total:total, items:cart.items}});
			}
		}

	},
	'Meteoris.Cart.Update': function(str, qty, userId){
		var aid = str.split('-');
		var index = parseInt(aid[1]) - 1;
		var cart = Meteoris.Carts.findOne({userId: userId});

		if( cart ){
			var allitems = cart.items;
			var item = allitems.splice(index,1)[0];
			var qty = parseInt(qty);
			var subtotal =  qty * item.price;
			
			var record = {id_product:item.id_product, attribute:item.attribute,price:item.price,quantity:qty,subtotal:subtotal}
			var newdoc = [];
			var total = 0;
			
			total = total + subtotal;
			cart.items.forEach( function(doc){
					newdoc.push(doc);
					total = total + doc.subtotal;
			})
			newdoc.splice(index,0,record);
			Meteoris.Carts.update({_id:cart._id},{$set:{total:total,items:newdoc}});
		}

	},
	'Meteoris.Cart.getTotalItem': function( userId ){
		var cart = Meteoris.Carts.findOne({userId:userId});
		return cart.items.length;
	}
});	