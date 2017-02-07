Template.cartlist.helpers({
	getAllCart: function(){
		return Meteoris.Carts.find({},{sort:{_id:1}});
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
	},
    'keyup #searchuser':function(e){
        var keyword=$("#searchuser").val();
        keyword = keyword.replace(/\s/g,'+');
        var params = Session.get('PARAMS');
        //var page = (params.hasOwnProperty('page'))? params.page:1;
        params.q = keyword;
        console.log(params);
        FlowRouter.setQueryParams(params);
       /* Meteor.call("searchUserinCart",keyword,function(err,data){
            if(!err){

            }
        });*/
    }
});