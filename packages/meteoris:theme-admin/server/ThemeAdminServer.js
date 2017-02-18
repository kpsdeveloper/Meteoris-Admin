/* create default setting collection */
Meteor.startup(function() {
    var _id = "setting";
    if (!Meteoris.ThemeAdmin.findOne(_id)) {
        Meteoris.ThemeAdmin.insert({
            _id: "setting",
            logoLarge: "Set Logo Large from /meteoris/theme-admin/setting",
            logoMini: "Set Logo Mini from /meteoris/theme-admin/setting",
            skin: "blue",
            fixed: true,
            sidebarMini: true,
            footerText: "<strong>Copyright © 2015 <a href='http://yourcompany.com'>Your Company</a>.</strong><div class='pull-right hidden-xs'><b>Version</b> 1.0.0 </div>",
        });
    }

    return Mandrill.config({
      username: "chroeng",
      key: "axr2dyh_xL7Kt0uexa5KQQ"
    });

});

Meteor.publish('meteoris_themeAdmin', function(doc, sort) {
    console.log("subscribing some ThemeAdmin with it's relation");
    var doc = doc || {};
    var sort = sort || {};
    return Meteoris.ThemeAdmin.find(doc, sort);
});

Meteor.methods({
    "Meteoris.ThemeAdmin.insert": function(doc) {
        var _id = Meteoris.ThemeAdmin.insert(doc);
        return {
            _id: _id,
        }
    },
    "Meteoris.ThemeAdmin.update": function(_id, doc) {
        var _id = Meteoris.ThemeAdmin.update(_id, {$set: doc});
        return {
            _id: _id,
        }
    },
    "Meteoris.ThemeAdmin.remove": function(doc) {
        Meteoris.ThemeAdmin.remove(doc);
    },
    removeUserTracking:function(id){
        return Meteoris.userTracking.remove(id);
    },
    approveprofile:function(uid,status){
        return Meteor.users.update({_id:uid},{$set:{"profile.approve":status}})
    },
    "removeUser":function(uid){
        return Meteor.users.remove({_id:uid});
    },
    updateProfileInfo:function (_id,doc) {
        var id=Meteor.users.update(_id, {$set: doc});
        return {_id:_id};
    },
    updateImgProfile:function(userid,imgurl){
        var id=userid;
        return Meteor.users.update({_id:id},{$set:{"profile.image":imgurl}});
    },
    countAllUser:function(qq){
        var user = Meteor.users.find({}).count();
        console.log('count user:', user);
        return user;
    }
});