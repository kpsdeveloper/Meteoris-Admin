Meteor.publishComposite('meteoris_user', function(doc) {
    console.log('subscribing some Users');
    return {
        find: function() {
            return Meteor.users.find(doc);
        },
        children: [
        ],
    }
});

Meteor.startup(function() {
    //process.env.MAIL_URL="smtp://houttyty7%40gmail.com:tytyhout7@smtp.gmail.com:465/";
    process.env.MAIL_URL = "smtp://contact%40safirperfumery.com:Senegal95@smtp.domain.com:465/";
});
Meteor.methods({
    'Meteoris.User.isExist': function() {
        var user = Meteor.users.findOne({});
        if(user){
            ServerSession.set('Meteoris.User.isExist', true);
            return true;
        }
        ServerSession.set('Meteoris.User.isExist', false);
        return false;
    },
    'Meteoris.User.insert': function(doc) {
        validateParams(doc);
        Accounts.createUser(doc);
        return true;
    },
    'Meteoris.User.getServices': function(service) {
        var configurations = Accounts.loginServiceConfiguration.findOne({
            service: service
        });

        return configurations;
    },
    'Meteoris.User.saveServices': function(service, doc) {
        ServiceConfiguration.configurations.upsert({
            service: service
        }, {
            $set: doc
        });
    },
    codeforgotpassword:function(email,code){
        var oneuser=Meteor.users.findOne({"emails.0.address":email});
        if(oneuser){
            Meteor.users.update({"emails.0.address":email},{$set:{"profile.code":code}});
            var content="Here is your code to verify"+code;
                Email.send({
                  to: email,
                  from: "contact@safirperfumery.com",
                  subject: "FORGOT PASSWORD",
                  text: content
                });
        }
    },
    confirmcode:function(email,code){
        var oneuser=Meteor.users.findOne({"emails.0.address":email});
        if(oneuser){
            var usercode=oneuser.profile.code;
            if(usercode==code){
                return usercode;
            }else{
                throw new Meteor.Error('Please Enter Code to verify');
            }
        }
    },
    resetNewPwd: function(email){
        var result=Meteor.users.findOne({"emails.0.address":email});
        if( result ){
            var token=result.services.password.reset.token;
            if(token){
                return token;
            }else{
                return result.services.resume.loginTokens[Meteor.user().services.resume.loginTokens.length-1].hashedToken;
            }
            
        }else return null; 
      
    },
    isRoleAdminUser: function(email){
        var user = Meteor.users.findOne({'emails.address':email});
        if( user ){
            return user;
        }else return;
    },
    createUserAccount: function(doc,roles){
        var id = Accounts.createUser(doc);
        Meteor.users.update({_id:id},{$set:roles})
    },
    verifyPurchase: function(userId, barcode){
        var product = Meteoris.Products.findOne({barcode:parseInt(barcode),'review.user':userId});
        if( product ){
           
            var objreview = product.review;
            var data = objreview.map( function(d){
                if(d.user == userId){
                    d.verifypurchase = true
                }
                return d;
            })
            var upid = Meteoris.Products.update({_id:product._id},{$set:{review:data}});
        }
    }, 
    InstandVerifyPurchase:function( data ){
        var sql = Meteor.npmRequire('mssql');
        var MongoClient = Meteor.npmRequire('mongodb').MongoClient;
        var absurl = Meteor.absoluteUrl();
        var ip_address  = (absurl.indexOf("localhost") > -1)? "localhost:3001":"139.59.150.209:27017" ;
        console.log('DB:', ip_address)
        var mongourl = "mongodb://"+ip_address+"/meteor";//getMongourl();
        var barcode = "'"+data.barcode.join("','")+"'";
        var memberId = "'"+data.memberId+"'";
        //var databarcode = "'"+data.barcode.join("','")+"'";
        //memberId = (memberId).toString();
       
        sql.connect("mssql://sa:kyan@123@84.241.62.223:1433/CMSDB").then(function() {
            MongoClient.connect( mongourl , function(err, db) {
                new sql.Request().query("select TOP 1 * from CustomerTransacionDetailView AS CTD WHERE CTD.Barcode IN ("+barcode+") AND CTD.MemberID ="+memberId).then(function(recordset) {
                    if(recordset.length > 0){
                        var docs = products.findOne({_id:data.productId});
                        if(docs){
                            var reviews = da.review;
                            var dataReview = [];
                            reviews.forEach( function(daa){
                                if(data.userId == daa.user){
                                    daa.verifypurchase = true;
                                    dataReview.push(daa)   
                                }else{
                                    dataReview.push(daa)  
                                }
                            })
                            products.update({_id:data.productId},{$set:{review:dataReview}});
                            //db.collection('tmp_products').update({_id:data.productId},{$set:{review:dataReview}}); 
                        }
        

                    }
                }).catch(function(err) {
                    console.log(err)
                });
            })

        })
    }
});


function validateParams(params) {
    for (var key in params) {
        if (key == "profile") {
            for (var keyProfile in params[key]) {
                value = params[key][keyProfile];
                //console.log("UsersServer.js " + value);
                if (value == "") {
                    throw new Meteor.Error('Please enter your ' + keyProfile, keyProfile);
                }
            }
        } else if (key == "email") {
            value = params[key];
            if (!validateEmail(value))
                throw new Meteor.Error('Please format email ' + key, key);

        } else {
            value = params[key];
//            console.log("UsersServer.js " + value);
            if (value == "")
                throw new Meteor.Error('Please enter your ' + key, key);
        }
    }

}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function get_visitor_ip(uid) {
    var k, ret, s, ss, _ref, _ref1, _ref2, _ref3;
    ret = {};
    if (uid != null) {
        _ref = Meteor.default_server.sessions;
        for (k in _ref) {
            ss = _ref[k];
            if (ss.userId === uid) {
                s = ss;
            }
        }
        if (s) {
            ret.forwardedFor = (_ref1 = s.socket) != null ? (_ref2 = _ref1.headers) != null ? _ref2['x-forwarded-for'] :
                    void 0 :
                    void 0;
            ret.remoteAddress = (_ref3 = s.socket) != null ? _ref3.remoteAddress :
                    void 0;
        }
    }
    return ret.forwardedFor ? ret.forwardedFor : ret.remoteAddress;
}