var ctrl = new Meteoris.OrdersController();
Template.orderIndex.onCreated(function() {
	
})

Template.orderIndex.helpers({
	getListOrders: function(){
        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        var status = ( params.hasOwnProperty('status') )? params.status:'';

        var curdate = new Date(), year = curdate.getFullYear(), month = curdate.getMonth(), day = curdate.getDate(), sevenday = curdate.getDate() - 6;
        var curdate = new Date([month,day,year].join('/'));
        var sevendate = new Date([month,sevenday,year].join('/'));
        var timestamp = curdate.getTime();
        var nextseventamp = sevendate.getTime();
        var sdate = (params.hasOwnProperty('sdate'))? getTimestamp(params.sdate): timestamp;
        var edate = (params.hasOwnProperty('edate'))? getTimestamp(params.edate): nextseventamp;
        var date = {sdate:sdate, edate:edate};

        var List = ctrl.getListOrders(status, date, page , limit);
        return List;
    }
});

Template.orderIndex.events({
	'change #browse-status': function(e){
        var status = $(e.currentTarget).val();
        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        if(status){
            FlowRouter.setQueryParams({page:page, status: status});
        }else
            FlowRouter.setQueryParams({page:page, status:null});
    },
    'click #browsebydate': function(e){
    	var sd = $('#start-date').val();
    	var ed = $('#end-date').val();

        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        params.sdate = sd.replace(/\//g,'-');
        params.edate = ed.replace(/\//g,'-');
       	
        FlowRouter.setQueryParams(params);
        //Session.set('PARAMS', params);
        
    },
    'keyup #search': function(e){
    	var keyword = $(e.currentTarget).val();
    	keyword = keyword.replace(/\s/g,'+');
    	var params = Session.get('PARAMS');
        //var page = (params.hasOwnProperty('page'))? params.page:1;
        params.q = keyword;
        console.log(params);
        FlowRouter.setQueryParams(params);
    }
})
Template.orderView.helpers({
	getOrderDetails: function(){
		var id = FlowRouter.getParam('id');
		console.log(id);
		return ctrl.getOrderDetails(id);
	}
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
})
Template.insertOrder.events({
	'keyup #search-product': function(e){
		var q = $(e.currentTarget).val();
		if( q.length > 3){
        	var params = Session.get('PARAMS');
        	params.q = q;
        	FlowRouter.setQueryParams(params);
    	}else{
    		FlowRouter.setQueryParams({q:null,page:null});
    	}
	}
})
Template.insertOrder.helpers({
	getListProductsSearch: function(){
		var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        var q = ( params.hasOwnProperty('q') )? params.q:'';
          
		return ctrl.getListProductsSearch(q, limit);
	},
	getListAttributeByProduct: function(oldId){
		return ctrl.getListAttributeByProduct(oldId);
	}
})