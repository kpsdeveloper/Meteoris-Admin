
Meteor.methods({
    "Meteoris.Orders.Count": function( status, date, q) {
    	var fields = {fields:{_id:1}};
    	if( status && q == ""){
			var total = Meteoris.Orders.find({status:status, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
		}else if( status == "" && q ){
			var total = Meteoris.Orders.find({_id: { $regex: new RegExp(q, "i") }, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
		}else if( status && q ){
			var total = Meteoris.Orders.find({status:status, _id: { $regex: new RegExp(q, "i") }, time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);
		}else
	    	var total = Meteoris.Orders.find({time:{$gte:date.sdate}, time:{$lte:date.edate}, time:{$exists:1}}, fields);

        return total.count();
    },
    "Meteoris.Orders.SearchProduct.Count": function(keyword){
    	var total = Meteoris.Products.find({ title: { $regex: new RegExp(keyword, "i") } },{fields:{_id:1}});
        return total.count();
    },
    "deleteOneorder":function(id){
    	return Meteoris.Orders.remove(id);
    },
    "removeOneCart":function(id){
    	return Meteoris.Carts.remove(id);
    },
    "updateStatus":function(id,status, transactionID, myorder){
        var status = Meteoris.Orders.update({_id:id},{$set:{status:status, transactionID:transactionID }});
        var user = Meteor.users.findOne({_id:myorder.userid});
        
        //console.log('status:', user);
        var email = user.emails[0].address;
        //console.log('email:', email);
        if( status ){
            Mandrill.messages.sendTemplate({
                "template_name": 'admin-update-status-order',
                "template_content": [
                  {
                    name: "body",
                    content: "Your shipment for order with Safir"
                  }
                ],
                message: {
                    subject: 'Verified your account with Safirperfumery',
                    from_email: "contact@safirperfumery.com",
                    to: [
                        { email:email }
                    ],
                    global_merge_vars: [
                        {

                            "name": "orderId",
                            "content": transactionID
                        },
                        {

                            "name": "statusId",
                            "content": status
                        }
                    ]
                }
            });
        }
    },
    countAllCart:function(q){
        if(q){
             var alluser=Meteor.users.find({"profile.username": { $regex: new RegExp(q, "i") }});
            userID=[];
            alluser.forEach(function(val){
                userID.push(val._id);
            });
            var allcart=Meteoris.Carts.find({userId:{$in:userID}})
            return allcart.count();
        }else{
             return Meteoris.Carts.find({}).count();
        }
       
    }
});