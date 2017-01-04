Template.favoritelist.helpers({
    getAllFavorite:function(){
        return Meteoris.Favorites.find({});
    },
});