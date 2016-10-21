Meteor.methods({
	"Meteoris.Order.addAddress": function (obj, shipping_method, deliverytime) {
		if( obj.isShippingDefault == true)
			Meteoris.Accounts.update({userId:obj.userId},{$set:{isShippingDefault:false}}, { multi: true});

		var addressId = Meteoris.Accounts.insert(obj);

		var option = shipping_method.split('+');

		var mydatetime = deliverytime.split('+');
		var day = mydatetime[1];
		var myarrtime = mydatetime[0].split('-');
		var databuying = {};
		databuying.addressBook = {addressId:addressId};
		databuying.shippingMethod = {option:{title:option[0], price:option[1]}, datetime:{starttime:myarrtime[0], endtime:myarrtime[1], day:day}};

		Meteoris.Carts.update({userId:obj.userId},{$set:databuying});
	},
	'Meteoris.Order.editAddress': function( obj, addressId){
		if( obj.isShippingDefault == true)
			Meteoris.Accounts.update({userId:obj.userId},{$set:{isShippingDefault:false}}, { multi: true});

		Meteoris.Accounts.update({_id:addressId},{$set:obj});
	},
	'Meteoris.Order.chooseAddress': function( userId, addressId, shipping_method, deliverytime){

		Meteoris.Accounts.update({userId:userId},{$set:{isShippingDefault:false}},{ multi: true});
		Meteoris.Accounts.update({_id:addressId},{$set:{isShippingDefault:true}})

		var option = shipping_method.split('+');
		var mydatetime = deliverytime.split('+');
		var day = mydatetime[1];
		var myarrtime = mydatetime[0].split('-');
		var databuying = {};
		
		databuying.addressBook = {addressId:addressId};
		databuying.shippingMethod = {option:{title:option[0], price:option[1]}, datetime:{starttime:myarrtime[0], endtime:myarrtime[1], day:day}};
		Meteoris.Carts.update({userId:userId},{$set:databuying});
	},
	'Meteoris.Order.addPaymentMethod': function(paymentmethod, userId){
		addPaymentMethod( paymentmethod, userId);
	},
	'Meteoris.Order.completedOrder': function(paymentmethod, userId, items){
		addPaymentMethod( paymentmethod, userId);
		completedOrder( userId, items );
	},
	'Meteoris.Orders.UpdateOrderUserID':function(userID, sessionID){
		Meteoris.Carts.remove({userId:userID});
    	Meteoris.Carts.update({ userId: sessionID }, { $set: {userId:userID} });
    }
});
addPaymentMethod = function(paymentmethod, userId){
	var databuying = {};
	databuying.paymentMethod = paymentmethod;
	Meteoris.Carts.update({userId:userId},{$set:databuying});
}
completedOrder = function( userId, items ){
	var mycart = Meteoris.Carts.findOne({userId:userId});
	if( mycart ){
		mycart.status = 'pending';
		var date = new Date();
		mycart.time = date.getTime();
		var id = Meteoris.Orders.insert(mycart);
		if( id ){
			Meteoris.Carts.remove({userId:userId});
			var AddressId = mycart.addressBook.addressId;
			var account = Meteoris.Accounts.findOne({_id:AddressId, isShippingDefault:true});
			SendMailOrder( userId, account, items);
		}
	}
}
SendMailOrder = function( userId, account, items ){
	//var items = getOrderItemsByID(userId);
	console.log( account );
	console.log( items );
    var email = account.email;
    var firstname = account.fullName;
    var lastname = '';
    var address = account.address1;
    address += (account.address2)? ', '+account.address2:'';
    address += (account.mobilephone)? '<p>'+account.mobilephone+'</p>':'';
    var paymentcon = 'NA';
    Mandrill.messages.sendTemplate({
        "template_name": 'orderProduct', //'safirtemplate name in Mandrill'
        "template_content": [{
            name: "noolab",
            content: "Safir products"
        }],
        message: {
            subject: "[Order with Safir]",
            from_email: "contact@safirperfumery.com",
            to: [
                { email: email }
            ],
            global_merge_vars: [{

                "name": "products",
                "content": items
            }, {
                "name": "customerName",
                "content": firstname + " " + lastname
            }, {
                "name": "address",
                "content": address
            }]
        }
    });
}
getOrderItemsByID = function( userId ){
	var myorder = Meteoris.Orders.findOne({userId:userId});
    if( myorder ){
    	var items = myorder.items;
        var myitems = [];
        if (items.length > 0) {
            for (i = 0; i < items.length; i++) {
                var myproduct = Meteoris.Products.findOne({ _id: items[i].id_product });
                var myattr = Meteoris.Attributes.findOne({ _id: items[i].attribute });
                //console.log("MyAttr:",myattr);
                var src = '';
                var absoluteurl = Meteor.absoluteUrl();
                var baseurl = (absoluteurl == 'http://localhost:3000/') ? 'http://54.71.1.92/upload/' : absoluteurl + 'uploads/';
                var myattrValue = '';
                var parentName = '';
                var price = 0;
                if ( myattr && myattr.hasOwnProperty('productImage') ) {
                    myattrValue = myattr.value;
                    price = myattr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var parentvalu = getParentAttrByID(myattr.parent);
                    var parentName = (parentvalu) ? parentvalu.name : '';
                    var myimage = getImgByID(myattr.productImage);
                    if (myimage) 
                        src = baseurl + myimage; //absoluteurl+'uploads/'+myimage;
                    else 
                        src = myattr.productImage;
                
                } else {
                    price = myproduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var myproductimg = getImgByID(myproduct.image[0]);
                    if (myproductimg) {
                        src = 'http://54.71.1.92/upload/' + myproductimg;
                    } else {
                        src = myproduct.image[0];
                    }
                }
                var obj = {
                    "img": src,
                    "qty": items[i].qty,
                    "name": myproduct.title,
                    "attr": myattrValue,
                    "parentattr": parentName,
                    "price": price,
                    "subtotal": items[i].subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                myitems.push(obj);
            }
            var total = myorder.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         
            return { total: total, items: myitems };
        } else return;
    }
}
getParentAttrByID = function(parentId) {
    return Meteoris.ParentAttributes.findOne({ _id: parentId });
}
getImgByID =  function( id ){
	if (id.indexOf('http') > -1) {
        return id;
    } else {
        var img = Meteoris.Images.findOne({ _id: id });
        if (img){
            	return "'http://54.71.1.92/upload/small/" + img.copies.images.key;
        }else 
            return id;  
    }
}