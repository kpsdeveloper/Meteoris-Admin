Namespace('Meteoris.BannersController');

Meteoris.BannersController = Meteoris.Controller.extend({  
	findProducts:function (e,t) {
		var key = $(e.currentTarget).val();
		if( key.length > 3){
            alert('22');
            var data = Meteoris.Products.find({ "title": { $regex: new RegExp(key, "i") } });
            console.log(data);
        }
	},
	insertBanner:function(e,t){
		var obj=this.getdatafromfiled(t);
		 Meteor.call("insertBanner",obj,function(err){
            if(err){
                 Meteoris.Flash.set('danger', err.reason);  
            }else{
            	Session.set("PROID",'');
            	Session.set("URLIMGBANNER",'');
            	Meteoris.Flash.set('success', "banner has been saved");  
            }
        });
	},
	updateBanner:function(id,e,t){
		var obj=this.getdatafromfiled(t);
		Meteor.call("updateBanner",id,obj,function(err){
            if(err){
                Meteoris.Flash.set('danger', err.message);
            }else{
                FlowRouter.go("/banner/list");
            }
        });
	},
	addProductBanner:function(e,t){
		var product = $('#txtaddproduct').attr('data-id');
        if( product != ''){
            var proid = [];
            if( Session.get('PROID') ){
                var data = Session.get('PROID');
                data.push(product);
                proid = data;
            }else{
                proid.push( product );
            }
            $('#txtaddproduct').removeAttr('data-id');
            $('#txtaddproduct').val('');
            Session.set('PROID', proid);
            Meteoris.Flash.set('success', 'product has been saved');
        }else{
            Meteoris.Flash.set('danger', "Product is require!");  
        }
	},
	getImageUrlFilestack:function(e,t){
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
            Session.set("URLIMGBANNER",url);
        });
	},
	getdatafromfiled:function(t){
		/*var pagename=t.find('#pagename').value;
        var typebanner=t.find('#typebanner').value;
        var position=t.find('#position').value;
        var selorder=t.find('#selorder').value;
        var linkurl=t.find('#linkurl').value;
        var txtaddproduct=Session.get("PROID");
        var description=t.find('#description').value;
        var imageurl=Session.get("URLIMGBANNER");*/
        var obj={
            pagename:t.find('#pagename').value,
            typebanner:t.find('#typebanner').value,
            position:t.find('#position').value,
            order:t.find('#selorder').value,
            linkurl:t.find('#linkurl').value,
            products:Session.get("PROID"),
            description:t.find('#description').value,
            imageurl:Session.get("URLIMGBANNER")
        }

        return obj;
	}

});