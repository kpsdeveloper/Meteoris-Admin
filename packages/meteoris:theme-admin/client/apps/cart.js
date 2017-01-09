Template.cartlist.helpers({
	getAllCart: function(){
		return Meteoris.Carts.find({});
	},
	 getProductTitle:function(id){
        var oneprod=Meteoris.Products.findOne({_id:id});
        if(oneprod){
            return oneprod.title;
        }
        
    }
});

Template.cartlist.events({
	'click #btnRemove': function(e){
		 if(confirm("Are You Sure to delete this Cart ?")){
            // ctrl.removeOneCart(this._id);
          //  Meteoris.Carts.remove(this._id);
            Meteor.call("removeOneCart",this._id);
            
        }
	}
});