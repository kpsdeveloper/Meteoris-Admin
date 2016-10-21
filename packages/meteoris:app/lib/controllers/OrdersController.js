Namespace('Meteoris.OrdersController');

Meteoris.OrdersController = Meteoris.Controller.extend({
	addToCart: function(e, tpl){
		var title = unslugTitle(FlowRouter.getParam("title"));  
        var product = Meteoris.Products.findOne({title:title});
        var id_product = ( product )? product._id:$(e.currentTarget).parents('.product-grid').attr('id');
        //var qty = (tpl.$("#qty").val())? tpl.$("#qty").val():$('#qty'+id_product).val();
        var qty = (tpl.$("#qty").val())? tpl.$("#qty").val():1;
        var attrid = $('.attrwrapper .active').attr('data-attr');
        var attribute = '';
        if( attrid )
             attribute = attrid;
        else{
            var pro = Meteoris.Products.findOne({_id:id_product});
            if( pro ){
                var attr = Meteoris.Attributes.find({product:pro.oldId}).fetch();
                if( attr.length > 0 )
                    attribute = attr[0]._id;
            }
        }
        var userId = getSessionUserID();
       /* var discount=tpl.$("#discount").val();
        if(discount==undefined){
        	discount=0;
        }*/
        console.log('discount'+discount);
        console.log('Id Product:', id_product);
        console.log('Id attribute:', attribute);
        console.log('Id userId:', userId);
        console.log('qty:', qty);
        var data = {id_product:id_product, attribute:attribute, userId:userId, qty:qty, date:getTimestamp()};
        Meteor.call('Meteoris.Cart.addToCart', data, function(err){
            if (err) {
                Meteor.subscribe('Carts', getSessionUserID());
                Meteoris.Flash.set("danger", err.message);
                throw new Meteor.Error(err)
            } else {
                Meteoris.Flash.set("success", "Product has been added successfully.")
            }
        });
	},
	addAddress: function (e) {
		var fullname = e.target.fullName.value;
		var email = e.target.email.value;
		var mphone = e.target.mphone.value;
		var hphone = e.target.homephone.value;
		var address1 = e.target.address1.value;
		var address2 = e.target.address2.value;
		var province = e.target.province.value;
		var city = e.target.city.value;
		var postal = e.target.postal.value;
	
		if( $('#isShippingDefault').prop('checked') )
			var isShippingDefault = true;
		else
			var isShippingDefault = false;

		var shipping_method = e.target.shippingmethod.value;
		var deliverytime = e.target.time.value;

		var msg = '';
		if( shipping_method === "" || deliverytime === "" || fullname == "" || email == "" || emailValidate( email ) == false || mphone == "" || phonenoValidate(mphone) == false || address1 == "" || city == "" || province == "" || postal==""){
			if( fullname == "")
				msg += 'Full name is require.';
			else if( email == "")
				msg += 'Email is require.';
			else if( emailValidate( email ) == false )
				msg += 'Email is invalid.';
			else if( mphone == "")
				msg += 'Mobile number is require.';
			else if( phonenoValidate(mphone) == false )
				msg += 'Mobile number is invalide.';
			else if( address1 == "")
				msg += 'Address is require.';
			
			else if( city == "")
				msg += 'City is require.';
			else if( province == "")
				msg += 'Province is require.';
			else if( postal == "")
				msg += 'Postal is require.';
			else if( shipping_method === "" )
				msg += 'Please choose one shipping options.';
			else if( deliverytime === "" )
				msg += 'Please choose one delivery time.';

			Meteoris.Flash.set("danger", msg);
			//Session.set('ADDADDRESS', {error:true,msg:msg});
		}else{
			var obj = {
				
                "email" : email,
                "fullName" : fullname,
                "address1" : address1,
                "address2" : address2,
                "postal" : postal,
                "city" : city,
                "province" : province,
                "mobilephone" : mphone,
                "homephone" : hphone,
                "isShippingDefault" : isShippingDefault,
                "userId" : Meteor.userId()
			}
			Meteor.call('Meteoris.Order.addAddress', obj, shipping_method, deliverytime, function(err, data){
				if(!err){
					
					Meteoris.Flash.set("success", "Address has been added.");
					if(isShippingDefault == true ) {
						FlowRouter.go('/orderReview');
					}else{
						FlowRouter.go('chooseAddress');
					}
					
				}
			})
			
		}
	},
	editAddress: function(e){
		var fullname = e.target.fullName.value;
		var email = e.target.email.value;
		var mphone = e.target.mphone.value;
		var hphone = e.target.hphone.value;
		var address1 = e.target.address1.value;
		var address2 = e.target.address2.value;
		var province = e.target.province.value;
		var city = e.target.city.value;
		var postal = e.target.postal.value;
		
		if( $('#isShippingDefault').prop('checked') )
			var isShippingDefault = true;
		else
			var isShippingDefault = false;
		
		var msg = '';
		if( fullname == "" || email == "" || emailValidate( email ) == false || mphone == "" || phonenoValidate(mphone) == false || address1 == "" || province == "" || city == "" || postal==""){
			if( fullname == "")
				msg += 'Full name is require.';
			else if( email == "")
				msg += 'Email is require.';
			else if( emailValidate( email ) == false )
				msg += 'Email is invalid.';
			else if( mphone == "")
				msg += 'Mobile number is require.';
			else if( phonenoValidate(mphone) == false )
				msg += 'Mobile number is invalide.';
			else if( address1 == "")
				msg += 'Address is require.';
			else if( province == "")
				msg += 'Province is require.';
			else if( city == "")
				msg += 'City is require.';
			else if( postal == "")
				msg += 'Postal is require.';

			Meteoris.Flash.set("danger", msg);
		}else{
			var obj = {
				"province" : province,
                "email" : email,
                "fullName" : fullname,
                "address1" : address1,
                "address2" : address2,
                "postal" : postal,
                "province" : city,
                "mobilephone" : mphone,
                "homephone" : hphone,
                "isShippingDefault" : isShippingDefault,
                "userId" : Meteor.userId()
			}
			var addressId = FlowRouter.getParam("id");
			Meteor.call('Meteoris.Order.editAddress', obj, addressId, function(err, data){
				if(!err){
					Meteoris.Flash.set("success", "Address has been updated.");
					FlowRouter.go('/chooseAddress');
				}
			})
			
		}
	},
	getAddressById: function( addressId ){
		return Meteoris.Accounts.findOne({_id:addressId});
	},
	chooseaddressBook: function(e){
		var shippingAddress = e.target.shippingAddress.value;
		var shipping_method = e.target.shippingmethod.value;
		var deliverytime = e.target.time.value;
		var msg = '';
		if( shipping_method === "" || deliverytime === "" || shippingAddress == ''){
			
			if(shippingAddress == '' )
				msg += 'You have to choose a default address';
			else if( shipping_method === "" )
				msg += 'Please choose one shipping options.';
			else if( deliverytime === "" )
				msg += 'Please choose one delivery time.';
			Meteoris.Flash.set("danger", msg)
		}else{
			var userId = Meteor.userId();
			console.log('Address choose.');
			Meteor.call('Meteoris.Order.chooseAddress', userId, shippingAddress, shipping_method, deliverytime,function(err, respond){
				if(!err){
					Meteoris.Flash.set("success", "Address has been selected.");
					FlowRouter.go('/orderReview');
				}
			})
		}
	},
	submitPayment: function(e){
        var userid = Meteor.userId();
        var data = Meteoris.Carts.findOne({userId:userid});
        
        $('#Amount').val(1000);
        $('#ResNum').val( data._id );
        $(e.currentTarget).attr('data-id', data.orderId );
        
        var paymentnum = Session.get('PAYMENTMETHOD');
    	var paymentoption = [ {num:1,title:'Online Payment'},{ num:2, title:"From Cart to Cart"}, { num:3, title:"Pay Cash in Place"}];
    	var currentPaymentMethod = [];
    	paymentoption.forEach( function(data){
    		if(data.num == paymentnum){
    			currentPaymentMethod.push(data);
    		}
    	})

    	Meteor.call('Meteoris.Order.addPaymentMethod', currentPaymentMethod, Meteor.userId(), function(err, data){
    		if(!err){
    			//submit payment
        		$( "#submitpayment" ).trigger('click');
    		}
    	})
	},
	completeOrder: function(e){
		var paymentnum = Session.get('PAYMENTMETHOD');
    	var paymentoption = [ {num:1,title:'Online Payment'},{ num:2, title:"From Cart to Cart"}, { num:3, title:"Pay Cash in Place"}];
    	var currentPaymentMethod = [];
    	paymentoption.forEach( function(data){
    		if(data.num == paymentnum){
    			currentPaymentMethod.push(data);
    		}
    	})
   
    	$(e.currentTarget).hide();
    	$('.btn-loading').show();
    	var items = getOrderItemsByID( Meteor.userId() );
    	console.log( items );
    	Meteor.call('Meteoris.Order.completedOrder', currentPaymentMethod, Meteor.userId(), items, function(err, data){
    		if(!err){
    			FlowRouter.go('/ordersuccess');
    		}
    	})
    	
	}
})