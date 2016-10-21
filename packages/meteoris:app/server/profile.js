Meteor.methods({
	updateProfileInfo:function (_id,doc) {
		var id=Meteor.users.update(_id, {$set: doc});
		return {_id:_id};
	},
	updateImgProfile:function(imgurl){
		var id=Meteor.userId();
		return Meteor.users.update({_id:id},{$set:{"profile.imageurl":imgurl}});
	}
});