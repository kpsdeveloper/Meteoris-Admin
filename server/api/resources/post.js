var bodyParser = Meteor.npmRequire('body-parser');
Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.route('/api/v1/insertuser', function(params, req, res, next) {
  if(req.body) {
    var data = req.body;
    var profile = {CustomerID:data.CustomerID, mobile:data.pass, firstname:data.firstname, lastname:data.lastname, shipcard:{point:data.point, membershipId:data.membershipId, membertype:'physical_store'} }
    var doc = {email: data.email,password: data.pass,username:data.MemberID,profile:profile};
    //var userId = Meteor.call('createUser', doc);
    //var roles = {roles : {mygroup : [ "safir_admin"]}}
    var roles = {roles : {mygroup : [ "member"]}}
    var user = Meteor.users.findOne({username:data.MemberID});
    if(user)
      res.end('User exist.');
    else{
      Meteor.call('createUserAccount',doc,roles );
      res.end('User created.');
    }
  }
  
});
Picker.route('/api/v1/verifyPurchase', function(params, req, res, next) {
  if(req.body) {
    var data = req.body;
    var memberId = data.memberId;
    var barcode = data.barcode;
    var user = Meteor.users.findOne({'profile.MemberID':memberId});
    if(user){
        Meteor.call('verifyPurchase',user._id, barcode);
        res.end('User exist.');
    }else{
        res.end('User not exist.');
    }
  }
  
});
Picker.route('/api/v1/InstandVerifyPurchase', function(params, req, res, next) {
  if(req.body) {
    var data = req.body;
    console.log('verify purchase param:', data)
    Meteor.call('InstandVerifyPurchase', data);
    res.end('Updated verify purchase');
  }
  
});
