var ctrl = new Meteoris.OrdersController();
Template.orderIndex.onCreated(function() {
      /*  
        var curdate = new Date(), year = curdate.getFullYear(), month = curdate.getMonth(), day = curdate.getDate(), sevenday = curdate.getDate() - 6;
        var curdate = new Date([month,day,year].join('/'));
        var sevendate = new Date([month,sevenday,year].join('/'));
        var timestamp = curdate.getTime();
        //var nextseventamp = sevendate.getTime();
        var date = new Date();
        var nextseventamp= new Date(new Date().getTime()+(7*24*60*60*1000));
        var sdate = timestamp;
        var edate =nextseventamp.getTime();
        console.log("EDATE "+edate);
        var date = {sdate:sdate, edate:edate};
	Meteor.subscribe("Orders","",date,"","","");*/
})

Template.orderIndex.helpers({
	getListOrders: function(){
        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        var status = ( params.hasOwnProperty('status') )? params.status:'';

        var curdate = new Date(), year = curdate.getFullYear(), month = curdate.getMonth(), day = curdate.getDate(), sevenday = curdate.getDate() - 6;
        var curdate = new Date([month,day,year].join('/'));
        var sevendate = new Date([month,sevenday,year].join('/'));
        var timestamp = curdate.getTime();
       // var nextseventamp = sevendate.getTime();
        var date = new Date();
        var nextseventamp= new Date(new Date().getTime()+(7*24*60*60*1000));
        nextseventamp=nextseventamp.getTime();
        var sdate = (params.hasOwnProperty('sdate'))? getTimestamp(params.sdate): timestamp;
        var edate = (params.hasOwnProperty('edate'))? getTimestamp(params.edate): nextseventamp;
        var date = {sdate:sdate, edate:edate};
        console.log(date);
        console.log("STATS "+status+"/date"+date+"/page"+page+"/limit"+limit);
        var List = ctrl.getListOrders(status, date, page , limit);
        return List;
    },
    getusername:function(uid){
        var oneuser=Meteor.users.findOne({_id:uid});
        if(oneuser){
            if(oneuser.profile.name){
                return oneuser.profile.name;
            }else{
                if(oneuser.profile.username){
                    return oneuser.profile.username;
                }else{
                    return "No Name";
                }
                
            }
        }
    },
});


