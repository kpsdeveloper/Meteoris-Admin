Template.favoritelist.helpers({
    getAllFavorite:function(){
        return Meteoris.Favorites.find({});
    },
    getproductname:function(prodid){
    	return Meteoris.Products.findOne({_id:prodid}).title;
    },
    getdisplayName:function(uid){
    	var oneuser=Meteor.users.findOne({_id:uid});
    	return oneuser.profile.username;

    	
    }
});
Template.favoriteview.helpers({
    getfavoriteDetails:function(){
        var id = FlowRouter.getParam('userid');
        return Meteor.users.findOne({_id:id});
    },
    getProductFavoriteByUser:function(uid){
        return Meteoris.Favorites.find({userId:uid});
    },
     getProductTitle:function(id){
        var oneprod=Meteoris.Products.findOne({_id:id});
        if(oneprod){
            return oneprod.title;
        }
        
    }
});