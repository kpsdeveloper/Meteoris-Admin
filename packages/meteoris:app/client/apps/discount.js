var ctrl = new Meteoris.ProductsController();
Template.meteoris_adddiscount.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});
Template.editdiscountProduct.onRendered(function() {
    //this.$('.datetimepicker').datetimepicker();
    $('.datetimepicker').datetimepicker({
      useCurrent: false,
      format: 'YYYY/MM/DD, hh:mm A'
    });
});
Template.editdiscountBrand.onRendered(function() {
     $('.datetimepicker').datetimepicker({
      useCurrent: false,
      format: 'YYYY/MM/DD, hh:mm A'
    });
    
});
Template.meteoris_adddiscount.events = {
    'change #typedis':function(e,t){
    	ctrl.hiddenForm(t);
    },
    'keyup #txtaddproduct': function(e,t){
        ctrl.keyuplistproduct(e,t);
    },
    'click .listpro': function(e,t){
        ctrl.clickOnKeyup(e);

    },
    'click #btndiscount': function(e,t){
    	e.preventDefault();
    	ctrl.addDiscount(t);
    	
    },
    'click #deletebrand': function(e,t){
    	var id=this._id;
        if (confirm('Are you sure to remove ?')) {
            Meteor.call("removeDiscountByBrand",id,function(err){
                if(!err){
                    Meteoris.Flash.set('success', "success remove discount from list ");  
                }
            })
        }
    },
    'click #deleteproduct':function(){
    	var id=this._id;
        if (confirm('Are you sure to remove ?')) {
            Meteor.call("removeDiscountByProduct",id,function(err){
                if(!err){
                    Meteoris.Flash.set('success', "success remove discount from list ");  
                }
            })
        }
    }
}

Template.meteoris_adddiscount.helpers({
	getBrand:function(){
		Meteor.call("getBrand",function(err,data){
			if(!err){
				Session.set("ALLBRAND",data);
			}
		});

		return Session.get("ALLBRAND");
		
	},
	getadiscountByBrand:function(params){
		return Discount.find({});
	},
	getdiscountByProduct:function(){
		return Meteoris.Products.find({ "discount": { $exists: true, $ne: null } })
	}
});

Template.editdiscountProduct.helpers({
	getOnediscountProduct:function(){
		var id=FlowRouter.current().params.id;
		return Meteoris.Products.findOne({_id:id});
	}
});
Template.editdiscountBrand.helpers({
	getOnediscountBrand:function(){
		var id=FlowRouter.current().params.id;
		return Discount.findOne({_id:id});
	}
});

Template.editdiscountBrand.events = {
	'click #btnupdatebrand': function(e,t){

		ctrl.updatediscountByBrand(e,t,this._id);
	}
}
Template.editdiscountProduct.events = {
	'click #btnupdateprod': function(e,t){
		ctrl.updatediscountByProduct(e,t,this._id);
		
	}
}