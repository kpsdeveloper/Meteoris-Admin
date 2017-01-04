Template.reviewlist.helpers({
	getAllReview:function () {
		return Meteoris.Products.find({review:{$exists:true}});
	},
	setviewColor:function(st){
		if(st==1){
			//already view
			return;
		}else{
			return "background-color:rgb(138, 130, 130)"
		}
	},
	adminApprove:function(status){
		if(status==1){
			return true;
		}else{
			return false;
		}
	},
	getdisplayName:function(uid){
    	var oneuser=Meteor.users.findOne({_id:uid});
    	if(oneuser.profile.username){
	    	return oneuser.profile.username;
	    }else{
	    	return oneuser.profile.firstname;
	    }
	}
});
Template.reviewlist.events = {
    'click #btnview': function(e, t) {
        e.preventDefault();
       var url=$(e.currentTarget).attr("href");
        var idreview=$(e.currentTarget).attr("dataid-review");
        Meteor.call("updateViewStatus",idreview,function(err,data){
        	if(data){
        		 FlowRouter.go(url);
        	}
        })
       
        //ctrl.viewReview(e,t);
    },
    "click #btnapprove":function(e,t){  //approve=1 mean admin aprroved
    	e.preventDefault();
    	var idreview=$(e.currentTarget).attr("dataid-review");
    	var approveStatus="0";
    	Meteor.call("approveReview",idreview,function(err){
    		if(!err){
    			console.log("success approved");
    		}
    	});

    },
    "click #btnNotapprove":function(e,t){
    	e.preventDefault();
    	var idreview=$(e.currentTarget).attr("dataid-review");
    	var approveStatus="1";
    	Meteor.call("approveReview",idreview,approveStatus,function(err){
    		if(!err){
    			console.log("success approved");
    		}
    	});

    }
}

/*function gotodetail(err){
	if(!err){
		FlowRouter.go(url);
	}
}*/


Template.reviewdetail.helpers({
	getProduct:function () {
		var idproduct =FlowRouter.getParam("id");
		var oneproduct=Meteoris.Products.findOne({_id:idproduct});
		return oneproduct;
	},
	getOneReview:function(){
		var idproduct =FlowRouter.getParam("id");
		var idreview =FlowRouter.getParam("idreview");
		var oneproduct=Meteoris.Products.findOne({_id:idproduct});
		var allrev=oneproduct.review;
		var selectedReview;
		for(var i=0;i<allrev.length;i++){
			if(allrev[i].idreview==idreview)
				selectedReview=allrev[i];
		}
		return selectedReview;
		
	}
	,
	checkAdminApprove:function(status){
		if(status==1){
			return "YES";
		}else {
			return "NO";
		}
	},
	 getdisplayName:function(uid){
    	var oneuser=Meteor.users.findOne({_id:uid});
    	if(oneuser.profile.username){
	    	return oneuser.profile.username;
	    }else{
	    	return oneuser.profile.firstname;
	    }
	}
});