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

Template.orderIndex.events({
    'change #browse-status': function(e){
        var status = $(e.currentTarget).val();
        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        if(status){
            FlowRouter.setQueryParams({page:page, status: status});
        }else
            FlowRouter.setQueryParams({page:page, status:null});
    },
    'click #browsebydate': function(e){
        var sd = $('#start-date').val();
        var ed = $('#end-date').val();

        var params = Session.get('PARAMS');
        var page = (params.hasOwnProperty('page'))? params.page:1;
        params.sdate = sd.replace(/\//g,'-');
        params.edate = ed.replace(/\//g,'-');
        
        FlowRouter.setQueryParams(params);
        //Session.set('PARAMS', params);
        
    },
    'keyup #search': function(e){
        var keyword = $(e.currentTarget).val();
        keyword = keyword.replace(/\s/g,'+');
        var params = Session.get('PARAMS');
        //var page = (params.hasOwnProperty('page'))? params.page:1;
        params.q = keyword;
        console.log(params);
        FlowRouter.setQueryParams(params);
    },
    "click #btnRemove":function(e){
        if(confirm("Are You Sure to delete this order ?")){
            ctrl.removeOneOrder(this._id);
            
        }
    }
})
Template.orderView.helpers({
    getOrderDetails: function(){
        var id = FlowRouter.getParam('id');
        console.log(id);
        return ctrl.getOrderDetails(id);
    },
    getusername:function(uid){
        var oneuser=Meteor.users.findOne({_id:uid});
        if(oneuser){
            if(oneuser.profile.username){
                return oneuser.profile.username;
            }else{
                return oneuser.profile.firstname;
            }
        }
        
    },
    getProductTitle:function(id){
        var oneprod=Meteoris.Products.findOne({_id:id});
        if(oneprod){
            return oneprod.title;
        }
        
    }
})

