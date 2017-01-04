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