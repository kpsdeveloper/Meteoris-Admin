var bodyParser = Meteor.npmRequire('body-parser');
Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.route('/api/v1/insertuser', function(params, req, res, next) {
  if(req.body) {
    var data = req.body;
    var pass = (data.pass)? data.pass: 'pass'+data.MemberID;
    var profile = {CustomerID:data.CustomerID, MemberID:data.MemberID, mobile:data.pass, firstname:data.firstname, lastname:data.lastname, shipcard:{point:data.point, membershipId:data.membershipId, membertype:'physical_store'} }
    var doc = {email: data.email,password:pass,username:data.MemberID,profile:profile};
    //var userId = Meteor.call('createUser', doc);
    //var roles = {roles : {mygroup : [ "safir_admin"]}}
    var roles = {roles : {mygroup : [ "member"]}}
    var user = Meteor.users.findOne({username:data.MemberID});
    if(user)
      res.end('User exist.');
    else{
      Meteor.call('createUserAccount',doc, roles);
      res.end('User created.');
    }
  }
  
});
Picker.route('/api/v1/instantInsertuser', function(params, req, res, next) {
  if(req.body){
    var memberId = "'"+req.body.memberId+"'";
    console.log('memberId:',memberId)
    var sql = Meteor.npmRequire('mssql');
    sql.connect("mssql://sa:kyan@123@84.241.62.223:1433/CMSDB").then(function() {
      new sql.Request().query("SELECT * From CustomerInformationForSafirView WHERE MemberID="+memberId).then(function(recordset) {
          var docs = "";
          if(recordset.length > 0){
            recordset.forEach( function(data){
              console.log(data)
              var pass = data.MobileNumber.replace(/\s/g,'');
              var email = (data.Email)? data.Email:data.MemberID+'@safir.store';
              var profile = {mobile:pass, CustomerID:data.CustomerID, MemberID:data.MemberID, firstname:data.CustomerName, lastname:data.CustomerLastName, shipcard:{point:data.Point, membershipId:data.GroupName, membertype:'physical_store'}}
              docs = {email:email, password:pass, username:data.MemberID, profile:profile, roles:{"mygroup" : ["member"]}}
              var user = Meteor.users.findOne({$or:[{username:docs.username},{'emails.address':email}]});
              if(user)
                  res.end('true');
              else{
                  var roles = {roles : {mygroup : [ "member"]}}
                  Meteor.call('createUserAccount',docs,roles );
                  res.end('true');
              }
            })
          }
          res.end('false');
      }).catch(function(err) {
          console.log(err)
      });
    })
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
