Namespace('Meteoris.ProductsController');

Meteoris.ProductsController = Meteoris.Controller.extend({
    /*getListProducts: function( categoryId, limit) {
        return Meteoris.Products.find({category:categoryId},{limit:limit});
    },*/
    getTitleInDetail: function( title ){
    	var product = Meteoris.Products.findOne({title:title});
    	if( product ){
    		var attr = Meteoris.Attributes.find({product:product.oldId});
    		var firstAttribute = attr.fetch()[0];
    		product.priceAttr = (attr.count() > 0 )? firstAttribute.price:product.price;
    		var attribute = [];
    		if( attr.count() > 0 ){
    			var active = '';
    			attr.forEach( function(val, index){
    				active = ( index == 0) ? 'active':'';
    				val.active = active;
    				attribute.push(val);
    			})
    		}
    		//display reviews
    		var reviews = (product.hasOwnProperty('review'))? product.review:[];
    		var datareviews = [];
    		if( reviews.length > 0 ){
    			reviews.forEach( function(re, index){
    				if(re.hasOwnProperty('status') ){ 
	    				if( re.status == 1)
	    					datareviews.push(re);
	    				else{
	    					if(Meteor.userId() == re.userId)
	    						datareviews.push(re);
	    				}
	    			}else
	    				datareviews.push(re);
	    			
    			})
    		}
    		product.reviews = datareviews;
    		//Recommended Products
    		var recommended = (product.hasOwnProperty('recommended'))? product.recommended:[];
    		product.recommended = recommended;
    		return {product:product, attribute: attribute}
    	}
    },
    getCategoryName: function(categoryid) { //Get categoryname from categories collection by category in product collection
        if (categoryid != null){
            var obj = Meteoris.Categories.findOne({_id: categoryid }).title;
            return obj;
        }else return;
    },
    getListProducts: function( categoryId, page, limit) {
    	var skip = (page<=1)? 0 : (page - 1) * limit;
    	var reloadpage = Session.get('RELOADCATEGORYPAGE');
    	//if(  reloadpage ===  1)
    		//var data =  Meteoris.Products.find({category:categoryId},{ fields:{_id:1, title:1,price:1}, limit:limit});
    	//else
        var userId = getSessionUserID();
        //var cart = Meteoris.Carts.findOne({userId:userId});
        //var ProductInCart = (cart)? cart.items.map( function(pid){ return pid.id_product;}):[];
        var data =  Meteoris.Products.find({category:{$in:categoryId}},{ fields:{_id:1, title:1,price:1, category:1,discount:1,Brand:1 ,oldId:1,review:1,recommended:1}, limit:limit});
        return data;
    },
    addReview: function(t, product_title){
    	var title = t.$('#review-title').val();
        var comment = t.$('#comment').val();
        var grade = 0;
        t.$('.star_active').each( function(){ grade = grade + 1});
        var product = Meteoris.Products.findOne({title:product_title});
        console.log('Product title:', product_title);
        var errMessage = '';
        if (title == "" || comment == "" || grade == "" ) {
        	if( title == "" )
            	errMessage += 'Please input title of your review';
            else if( comment == "" )
            	errMessage += 'Please input some description of your review';
            else if( grade == "" )
            	errMessage += 'Please rate this review';
            else if( product == "" )
            	errMessage += 'Your riew can not add.';

            Meteoris.Flash.set('danger', errMessage);
            throw new Meteor.Error(errMessage);
        } else{
        	if( product ){
	        	var obj = {
	        			title: title,
	        			description: comment,
	        			grade: grade,
	        			userId: Meteor.userId(),
	        			status:0,
	        			date: getTimestamp()
	        	}
	        	
	            Meteor.call("Meteoris.Products.addReview", product._id, obj, function(err, result) {
	                if (err) {
	                    Meteoris.Flash.set("danger", err.message);
	                    throw new Meteor.Error(err)
	                } else {
	                	t.$('#review-title').val('');
        				t.$('#comment').val('');
        				t.$('.star_active').removeClass('yellow-star star_active');
	                    Meteoris.Flash.set("success", "Success add review.")
	                }
	            })
	        }
        }
    },
    getRecommendProducts: function( recommended ){
    	if( recommended.length ){
    		var html = '';
    		var data = Meteoris.Products.find({_id:{$in:recommended}});
    		if( data.count() > 0 ){
	    		data.forEach( function(data){
                    var data = getFavoriteRating(data);
	    			html += listProductHtml(data, 'true');
	    		})
	    	}
	    	return html;
    	}
    },
    checkdiscount:function(oneproduct){
        var curtime=new Date();
        var timetoday=curtime.getTime();
        //var oneproduct=Meteoris.Products.findOne({title:title});
        if(oneproduct.hasOwnProperty("discount")){
            console.log("ENTER ONE COND");
            if(timetoday >= parseInt(oneproduct.discount.startdate) && timetoday <= parseInt(oneproduct.discount.enddate)){
                Session.set("DISCOUNTVALUE",oneproduct.discount.discount);
                return oneproduct.discount.discount;
            }
        }else{
            var disc=Discount.findOne({brand:oneproduct.Brand});
            if(disc){
                if(timetoday >= parseInt(disc.startdate) && timetoday <= parseInt(disc.enddate)){
                    Session.set("DISCOUNTVALUE",disc.discount);
                    return disc.discount;
                }
                 
            }
        }
    },
    getPriceAfterDiscount:function(oldprice){
        var disc=Session.get("DISCOUNTVALUE");
        console.log("DISCOUNT AND OLDPRICE "+disc+'==='+oldprice)
        var realdis=parseInt(disc)/100;
        var pricediscount=parseInt(oldprice)*realdis;
        var lastprice=parseInt(oldprice)-parseInt(pricediscount);
        return lastprice;
    },
    //=================FOR DISCOUNT FUNCTION=================
    hiddenForm:function(t){
        var typediscount=t.find('#typedis').value;
        if(typediscount=='bybrand'){
            $("#hideBrand").removeClass("hidden");
            $("#hidetxtpro").addClass("hidden");
        }else if(typediscount=='byprod'){
            $("#hidetxtpro").removeClass("hidden");
            $("#hideBrand").addClass("hidden");
        }else{
            //alert ()
        }
    },
    keyuplistproduct:function(e,t){
        var key = $(e.currentTarget).val();
        if( key.length > 3){
            var data = Meteoris.Products.find({ "title": { $regex: new RegExp(key, "i") } });
            var text = '';
            if( data.count() > 0){
                data.forEach( function(data, index){
                    text += '<a href=""><li data-id="'+data._id+'" class="listpro">'+data.title+'</li></a>';
                })  
            }
            if( text!='')
                $('#result').html( '<div style="border:1px solid #ddd;padding:5px">'+text+'</div>' );
            else
                $('#result').html( '<li>No result.</li>' );
        }
    },
    clickOnKeyup:function(e){
        var title = $(e.currentTarget).html();
        var id = $(e.currentTarget).attr('data-id');
        $('#txtaddproduct').val(title);
        $('#txtaddproduct').attr('data-id', id);
        $('#result').html('');
    },
    addDiscount:function(t){
        var typedis=t.find('#typedis').value;
        var brand=t.find('#selBrand').value;
        var idproduct=$('#txtaddproduct').attr('data-id');
       /* var discount=t.find('#discount').value;
        var startdate=t.find('#startdate').value;
        var enddate=t.find('#enddate').value;*/
        var doc = this.getDatadiscount(t);
        if(typedis=='byprod'){
            var data={
                discount:doc
            }
            if(idproduct==''||doc.discount=='' || doc.startdate=='' || doc.enddate==''){
                Meteoris.Flash.set('danger', 'fields is required !!!'); 
            }else{
                Meteor.call("updateProductDis",idproduct,data,function(err){
                    if(!err){
                        Meteoris.Flash.set('success', "discount saved ");
                    }
                });
            }
        }else if(typedis=='bybrand'){
            var data={
                brand:brand,
                discount:doc.discount,
                startdate:doc.startdate,
                enddate:doc.enddate
            }
            if(brand=='' || doc.discount=='' || doc.startdate=='' || doc.enddate==''){
                Meteoris.Flash.set('danger', 'fields is required !!!'); 
            }else{
                Meteor.call("insertdiscount",data,function(err){
                    if(err){
                        Meteoris.Flash.set('danger', err.message);
                    }else{
                        Meteoris.Flash.set('success', "discount saved ");
                    }
                });
            }
        }else{
            Meteoris.Flash.set('danger', 'Please select type of discount'); 
        }
    },
    updatediscountByProduct:function(e,t,id){
        var doc=this.getDatadiscount(t);
        var data={
            discount:doc    
        }
        Meteor.call("updatediscountByProduct",id,data,function(err){
            if(err){
                Meteoris.Flash.set('danger', err.reason); 
            }else{
                FlowRouter.go('/discount/add');
            }
        });
    },
    updatediscountByBrand:function(e,t,id){
        var id=id;
        var doc=this.getDatadiscount(t);
        Meteor.call("updatediscountByBrand",id,doc,function(err){
            if(err){
                Meteoris.Flash.set('danger', err.reason); 
            }else{
                FlowRouter.go('/discount/add');
            }
        });
    },
    getDatadiscount: function(t) {
        var startdate=t.find('#startdate').value;
        var getstartdate=new Date(startdate);
        var timestart=getstartdate.getTime();
        var enddate=t.find('#enddate').value
        var getenddate=new Date(enddate);
        var timeend=getenddate.getTime();
        data= {
            discount:t.find('#discount').value,
            startdate:timestart,
            enddate:timeend,
        };

        return data
    },
    getAttributeById: function( id ){
        return Meteoris.Attributes.findOne({_id:id});

    }
});