Namespace('Meteoris.AppController');

Meteoris.AppController = Meteoris.Controller.extend({  
    getProfileInfo: function(params) {
        var id=Meteor.userId();
        var data='';
        var result=Meteor.users.findOne({_id:id});
        if(result){
        	if(params=="username"){
        		data= result.profile.username;
        	}else if(params=="firstname"){
        		data= result.profile.firstname;
        	}else if (params=="lastname"){
        		data= result.profile.lastname;
        	}else if (params=="dob"){
        		data= result.profile.dob;
        	}else if (params=="sex"){
        		data= result.profile.sex;
        	}else if (params=="province"){
        		data= result.profile.province;
        	}else if (params=="city"){
        		data= result.profile.city;
        	}else if (params=="phone"){
        		data= result.profile.phone;
        	}else if (params=="homephone"){
        		data= result.profile.homephone;
        	}else if (params=="address"){
        		data= result.profile.address;
        	}else if (params=="email"){
        		data= result.emails[0].address;
        	}else if (params=="createdAt"){
        		data=result.profile.createdAt;
        	}else if (params=="imageurl"){
        		data=result.profile.imageurl;
        	}else{
        		data='';
        	}
        	
        }
        return data;
    },
    updateProfileInfo:function(t){
    	var _id=Meteor.userId();
    	var username=t.find('#username').value;
    	var firstname= t.find('#firstname').value;
        var lastname= t.find('#lastname').value;
        var dob= t.find('#dob').value;
        var sex=t.find('#sex').value;
        var province= t.find('#province').value;
        var city= t.find('#city').value;
        var phone= t.find('#phone').value;
        var email=t.find('#email').value;
        var homephone= t.find('#homephone').value;
        var address= t.find('#address').value;
        var createdAt= t.find('#createdAt').value;
        var updatedAt= new Date();
        var imageurl=t.find("#imagefile").value;
        varemail=this._validateEmail(email);
        varphone=this._validatePhone(phone);
        varhomephone=this._validatePhone(homephone);
        if(username == '' || firstname == '' || lastname == ''|| dob == '' || address == ''){
        	Meteoris.Flash.set('danger', "field required");    
		}else{
			if(varemail==undefined||varemail == false){
				Meteoris.Flash.set('danger', "Email field required");  
			}else if(varphone==undefined||varphone == false){
				Meteoris.Flash.set('danger', "phone field required");  
			}else if(varhomephone==undefined ||varhomephone ==false){
				Meteoris.Flash.set('danger', "homephone field required");  
			}else{
				//do something
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
		                dob: dob,
		                sex:sex,
		                province: province,
		                city: city,
		                phone: phone,
		                homephone: homephone,
		                address: address,
		                createdAt: createdAt,
		                updatedAt: updatedAt,
		                imageurl:imageurl
		            }
		        };
		       Meteor.call("updateProfileInfo",_id,doc,function(err){
		       		if (err) {
		                Meteoris.Flash.set('danger', err.message);
		                throw new Meteor.Error(err);
		            }
		            Meteoris.Flash.set('success', "Success Updating profile");
		       });
		       
			}
		}
    },
    _validateEmail:function(email){
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
    },
    _validatePhone:function(phone){
    	var ph = /^[0-9]+$/;
    	return ph.test(phone);
    },
    


});