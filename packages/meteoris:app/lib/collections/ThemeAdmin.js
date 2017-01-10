/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

//Namespace('Meteoris.Docs');
users=new Mongo.Collection("users");
Banners = new Mongo.Collection("banner");
Discount=new Mongo.Collection("discount");
Posts = new Mongo.Collection("posts");
Posts.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  fileId: {
    type: String
  }
}));

Files = new FS.Collection("files", {
  stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
  download: function () {
    return true;
  },
  fetch: null
});
