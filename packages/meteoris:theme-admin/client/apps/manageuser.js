var ctrl = new Meteoris.AppController();
Template.userTracklist.helpers({
	getAllUserConfirmationPage:function () {
		var urllastpage="http://www.safirperfumery.com/confirmation";
		var alltrack= Meteoris.userTracking.find({currenturl:urllastpage});
		return alltrack;
	},
	getusername:function(uid){
    	var oneuser=Meteor.users.findOne({_id:uid});
    	if(oneuser.profile.username){
	    	return oneuser.profile.username;
	    }else{
	    	return oneuser.profile.firstname;
	    }
	},
	checkusername:function(id){
		var oneuser=Meteor.users.findOne({_id:id});
		if(oneuser){
			return true;
		}else{
			return false;
		}
	}
});

Template.userTracklist.events = {
    'click #btnRemove':function(e,t){ //ThemeAdminServer.js
    	Meteor.call("removeUserTracking",this._id);
    },
}
Template.tracklogin.helpers({
	getAllLoginError:function(){
		var alltrack=Meteoris.userTracking.find({$and : [{ $or : [ { event : "loginerror" }, { event : "forgetpassword" } ] },{ event: { $exists: true } } ]} )
    	return alltrack;
	},
	getusername:function(uid){
    	var oneuser=Meteor.users.findOne({_id:uid});
    	if(oneuser.profile.username){
	    	return oneuser.profile.username;
	    }else{
	    	return oneuser.profile.firstname;
	    }
	},
	checkusername:function(id){
		var oneuser=Meteor.users.findOne({_id:id});
		if(oneuser){
			return true;
		}else{
			return false;
		}
	}
});
Template.tracklogin.events = {
    'click #btnRemove':function(e,t){ //ThemeAdminServer.js
    	if(confirm("Are You Sure to delete ?")){
    		Meteor.call("removeUserTracking",this._id);
    	}
    	
    },
}

Template.manageuserlist.helpers({
	getAllUser:function(){
        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? parseInt(params.page):1;
        var q = ( params.hasOwnProperty('q') )? params.q:'';

        page = (page)? page:1;
        var skip = (page<=1)? 0 : (page - 1) * limit;
        if( q ){
            var q = q.split('+');
            var s = '';
            for(i=0; i < q.length; i++){
                if( q[i] ){
                    s += '\\b'+q[i];
                    s += (i < q.length - 1)? '|':'';
                }
            }
            s = new RegExp(s);
            var data = Meteor.users.find({$or:[{'profile.firstname':{$regex:s, $options:'i'}}, {'profile.lastname':{$regex:s, $options:'i'}}]},{limit:limit, skip:skip});
        }
        else
            var data = Meteor.users.find({},{limit:limit, skip:skip});

        return data;

		//return Meteor.users.find({});
	},
	adminApprove:function(status){
		if(status==true){
			return true;
		}else{
			return false;
		}
	}
});
Template.manageuserlist.onCreated( function(){
    //Tracker.autorun( function(){
        //IRLibLoader.load('/js/jquery.simplePagination.js')
    //})
})
Template.manageuserlist.events = {
 	"click #btnapprove":function(e,t){  //approve=true mean admin aprroved
    	e.preventDefault();
    	var userid=$(e.currentTarget).attr("dataid");
    	var approveStatus=false;
    	Meteor.call("approveprofile",userid,approveStatus,function(err){
    		if(!err){
    			console.log("success approved");
    		}
    	});

    },
    "click #btnNotapprove":function(e,t){
    	e.preventDefault();
    	var userid=$(e.currentTarget).attr("dataid");
    	var approveStatus=true;
    	Meteor.call("approveprofile",userid,approveStatus,function(err){
    		if(!err){
    			console.log("success approved");
    		}
    	});

    },
    "click #btnRemove":function(e){
    	if(confirm("Are You sure to delete this user ?")){
    		Meteor.call("removeUser",this._id);
    	}
    },
    'keyup #search-user': function(e){
        var keyword = $(e.currentTarget).val();
        var params = Session.get('PARAMS');
        console.log('pa:', params)
        var page = (params.hasOwnProperty('page'))? parseInt(params.page):1;
       
        if(keyword !="" && keyword.length > 3){
            params.q = keyword.replace(/\s/,'+');
            FlowRouter.setQueryParams(params);
        }else
            FlowRouter.setQueryParams({page:page, q:null});
    }
}

Template.viewuser.helpers({
	getuserDetails:function(){
		var uid=FlowRouter.getParam("id");
		console.log("UUUID "+uid);
		return Meteor.users.findOne({_id:uid});
	}
});
Template.updateuser.helpers({
	getuserDetails:function(){
		var uid=FlowRouter.getParam("id");
		return Meteor.users.findOne({_id:uid});
	}
});
Template.updateuser.events = {
	"click #btnupdate":function(e,t){
		var username=t.find('#username').value;
    	var firstname= t.find('#firstname').value;
        var lastname= t.find('#lastname').value;
        var dob= t.find('#dob').value;
          var imageurl=t.find("#imagefile").value;
        var phone= t.find('#phone').value;
        var address= t.find('#address').value;
        var email=t.find('#email').value;
        var doc = {
			emails : [ 
		        {
		            "address" : email,
		            "verified" : false
		        }
		    ],
            profile: {
                username: username,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                birth:dob,
                address: address,
                image:imageurl
            }
        };
        var id=FlowRouter.getParam("id");
        Meteor.call("updateProfileInfo",id,doc,function(err){
       		if (err) {
                Meteoris.Flash.set('danger', err.message);
                throw new Meteor.Error(err);
            }
            Meteoris.Flash.set('success', "Success Updating profile");
       });
	},
	'click #uploadImg': function(e, t) {
    	//alert("kkk");
        filepicker.setKey("ACTP7A0fnQou2s5L4f9FBz");
		filepicker.pick({
            mimetype: 'image/*', /* Images only */
            maxSize: 1024 * 1024 * 5, /* 5mb */
            imageMax: [1500, 1500], /* 1500x1500px */
            cropRatio: 1/1, /* Perfect squares */
            services: ['*'] /* All available third-parties */
        }, function(blob){
           
            var filename = blob.filename;
            var url = blob.url;
            var id = blob.id;
            var isWriteable = blob.isWriteable;
            var mimetype = blob.mimetype;
            var size = blob.size;

            console.log(blob)
            var uid=FlowRouter.getParam("id");
            Meteor.call('updateImgProfile',uid,url,function(err){
				if(err){
					Meteoris.Flash.set('danger', err.message);  
				}
			});
        });
	}
}

Template.updateuser.onCreated(function() {
    Meteor.Loader.loadJs("//api.filestackapi.com/filestack.js");
});

/*Template.birthday.onCreated(function() {
    Meteor.Loader.loadJs("/irancalendar/jalali.js",1000);
     Meteor.Loader.loadJs("/irancalendar/calendar.js",1000);
      Meteor.Loader.loadJs("/irancalendar/calendar-setup.js",1000);
       Meteor.Loader.loadJs("/irancalendar/calendar-fa.js",1000);
});*/

Template.birthday.events = {
    "keyup #date_input":function(e,t){
        alert("value hchange");
        /*var text=$(e.currentTarget).val()
        var text=$("#date_input").val()
        alert(text);
*/
    }
},
Template.birthday.helpers({
    getBirthdate:function(){
        var limit=16;
        var birth_date = FlowRouter.getQueryParam("date");
        var q = getbirthDate( birth_date );
        q = new RegExp('\\b'+q);
        var data = Meteor.users.find({'profile.birth':{$regex:q, $options:'i'}});
        return data;
    }
})
getbirthDate = function( birth_date ){
    if( birth_date ){
        var arr_birth_date = birth_date.split('-');
        var persianMonth = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر ","آبان","آذر","دی ","بهمن","اسفند"];
        var name_of_month = '';
        persianMonth.forEach( function(m, index){
            if(arr_birth_date[1] - 1 == index ){
                console.log('month:', m, ', index:', index)
                name_of_month = m;
            }
        })
        var d = parseInt(arr_birth_date[0])+'-'+name_of_month;
        //d = birth_date.replace(/\s/,'');
        return d;
    }
}