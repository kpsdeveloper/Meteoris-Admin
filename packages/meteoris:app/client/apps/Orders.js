var ctrl = new Meteoris.OrdersController();
Template.paymentDetails.onCreated(function() {
	var router = FlowRouter;
	isEmptyCart( router );
})
Template.addressDetails.onCreated(function() {
	var router = FlowRouter;
	isEmptyCart( router );
})
Template.chooseAddress.onCreated(function() {
	var router = FlowRouter;
	isEmptyCart( router );
})
Template.orderReview.onCreated(function() {
	var router = FlowRouter;
	isEmptyCart( router );
})
Template.shippingMethod.helpers({
	shippingMethods: function(){
		if (TAPi18n.getLanguage() == 'fa') 
			var data = [{title: "تحویل اکسپرس", price: 5000},{title: 'تحویل معمولی', price:0}]
		else
			var data = [{title: "express", price: 5000},{title: 'Normal', price:0}]

		return data;
	},
	deliveryTime: function(){
		if (TAPi18n.getLanguage() == 'fa') {
			var time = [{start:"9", end:"-12ساعت"},{start:"12",end:"-15ساعت"},{start:"15",end:"-18ساعت"}];
			var day  = [{day:"یکشنبه"},{day:"سه شنبه"},{day:'پنجشنبه'},{day:'جمعه'}];
			return {mytime:time, day:day};
		}else{
			var time = [{start:"9-", end:"12pm"},{start:"12-",end:"15pm"},{start:"15pm-",end:"6pm"}];
			var day  = [{day:"sunday"},{day:"Tuesday"},{day:'Thursday'},{day:'friday'}];
			return {mytime:time, day:day};
		}
		
	},
	checkDefaultTime: function(start, end, dayname){
		var databuy = Session.get('DATABUYING');
		if( databuy ){
			var shipping = databuy.shippingMethod;
			if( shipping ){
	  			if(shipping.datetime.starttime == start && shipping.datetime.endtime == end && shipping.datetime.day == dayname)
	  				return 'checked';
	  			else return;
	  		}
		}
	},
	checkDefaultShipping: function( method ){
		var databuy = Session.get('DATABUYING');
		if( databuy ){
			var shipping = databuy.shippingMethod;
			if( shipping ){
	  			if(shipping.option.title == method)
	  				return 'checked';
	  			else return;
	  		}
		}
	}
});
Template.addressDetails.onCreated(function() {
	var self = this;
	self.autorun(function() {
		Meteor.subscribe('Provinces');
	})
})
Template.editAddress.onCreated(function() {
	var self = this;
	self.autorun(function() {
		Meteor.subscribe('Provinces');
		Meteor.subscribe('Accounts', Meteor.userId(), FlowRouter.getParam("id"));
	})
})
Template.addressDetails.helpers({
	getallProvince:function(){
    	return Meteoris.Provinces.find({province:{$ne:null}});
    },
    getCity:function(){
    	if(Session.get("PROVINCE")){
            var province = Session.get("PROVINCE");
            console.log('province:', province);
            
        	var provOfcity=Meteoris.Cities.findOne({provinceId:province});
        	return provOfcity;
	       
        }
        
    }
})
databuying = {};
Session.set('ADDADDRESS', '');
Session.set('SHIPPINGMETHOD', '');
Session.set('chooseShippingAddressMsg', '');
Session.set('editAddressMsg','');
Session.set('shippingOptionMsg','');

Template.addressDetails.events({
	'submit .addressBookForm': function(e, tmp){
		e.preventDefault();
		ctrl.addAddress(e);
		
	},
	"change #province":function(e){
		e.preventDefault();
        var province=$(e.currentTarget).val();
        Meteor.subscribe('Cities', province);
        Session.set("PROVINCE",province);
    }
})
Template.chooseAddress.helpers({
	getListAddress: function () {
		var data = Meteoris.Accounts.find({userId:Meteor.userId()});
		return data;
	},
	isDefaultAddress: function( isDefault ){
		if( isDefault === true) return 'checked';
		else return;
	},
	chooseShippingAddressMsg: function(){
		return Session.get('chooseShippingAddressMsg');
	}
})
Template.chooseAddress.events({
	'submit .chooseaddressBookForm': function (e) {
		e.preventDefault();
		ctrl.chooseaddressBook(e);
	},
	'click #delete': function(e){
		e.preventDefault();
		var id = this._id;
		Meteor.call('removeAddress', id);
	}
});
Template.editAddress.helpers({
	editAddressMsg: function(){
		return Session.get('editAddressMsg');
	}
})
Template.editAddress.events({
	'submit .editAddressBookForm': function(e, tmp){
		e.preventDefault();
		ctrl.editAddress(e);
	},
	"change #province":function(e){
		e.preventDefault();
        var province=$(e.currentTarget).val();
        Meteor.subscribe('Cities', province);
        Session.set("PROVINCE",province);
    }
})
Template.editAddress.helpers({
	getAddressById: function(){
		var addressId = FlowRouter.getParam("id");
		return ctrl.getAddressById(addressId);
	},
	getallProvince:function(){
    	return Meteoris.Provinces.find({province:{$ne:null}});
    },
    getCity:function( province ){
    	if(Session.get("PROVINCE")){
            return Meteoris.Cities.findOne({provinceId:Session.get("PROVINCE")});
        }else{
        	console.log('current city');
        	var subcity = Meteor.subscribe('Cities', province, function(){
        		
        	});
        	if( subcity ){
        		var city = Meteoris.Cities.findOne({provinceId:province});
        		console.log('city:', city);
        		return city;
        	}
        }
    },
    getProvinceById: function(id){
    	return Meteoris.Provinces.findOne({_id:id});
    }
})

Template.paymentDetails.helpers({
	isOnlinePayment: function(){
		var pmethod = parseInt(Session.get('PAYMENTMETHOD'));
		if( pmethod == 1)
			return true;
		else return false;
	},
	getCurrentPaymentmethod: function( num ){
		var pmethod = parseInt(Session.get('PAYMENTMETHOD'));
		num = parseInt(num);
		if( pmethod === num ) return 'checked';
		else return;
	}
});
Template.paymentDetails.events({
	'click #btnPayment': function(e,tmp) {
        e.preventDefault();
        ctrl.submitPayment(e);
    },
    'change .choosepayment': function(e){
    	e.preventDefault();
    	var paymentmethod = $(e.currentTarget).val();
		Session.setPersistent('PAYMENTMETHOD', paymentmethod);
    },
    'click .btncompleteOrder': function(e){
    	e.preventDefault();
    	ctrl.completeOrder(e);
    }
});