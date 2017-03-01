Meteoris.Products = new Mongo.Collection("tmp_products");
Meteoris.Categories = new Mongo.Collection("tmp_cat");
Meteoris.Carts = new Mongo.Collection("cart");

Meteoris.Attributes = new Mongo.Collection("attribute");
Meteoris.ParentAttributes = new Mongo.Collection("parentattr");
Meteoris.ParentTags = new Mongo.Collection("parent_tags");
Meteoris.Tags = new Mongo.Collection("tags");
Meteoris.Favorites = new Mongo.Collection("favorite");
Meteoris.Discount=new Mongo.Collection("discount");
Meteoris.userTracking = new Mongo.Collection("userTracking");

Meteoris.Orders = new Mongo.Collection("order");
Meteoris.Provinces = new Mongo.Collection("provinces");
Meteoris.Cities = new Mongo.Collection("cities");
Meteoris.Accounts = new Mongo.Collection("Account");

Meteoris.Contents = new Mongo.Collection("contents");
Meteoris.ContentType = new Mongo.Collection("contents_type");


if (Meteor.isServer) {
	fullpath=process.env.PWD;
	if( typeof fullpath == 'undefined' ){
		base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../../../../../' );
	}else{
		base_path=fullpath;
	}
}
else{
	base_path="/";
}

Meteoris.Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path:base_path+"/upload"})]
});


