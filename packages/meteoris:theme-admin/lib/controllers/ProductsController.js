Namespace('Meteoris.ProductsController');

Meteoris.ProductsController = Meteoris.Controller.extend({
    getListProducts: function(categoryId, keyword, page, limit){
        var skip = (page<=1)? 0 : (page - 1) * limit;
        var fields = { fields:{_id:1, title:1,price:1,category:1,discount:1, category:1, Brand:1, oldId:1,image:1,review:1,recommended:1,date:1}, sort:{date:-1},limit:limit};
        if( categoryId && keyword == ""){
            var data = Meteoris.Products.find({category:{$in:categoryId}}, fields);
        }else if( categoryId == "" && keyword ){
            var data = Meteoris.Products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
        }else if( categoryId && keyword ){
            var data = Meteoris.Products.find({category:{$in:categoryId}, $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] }, fields);
        }else
            var data = Meteoris.Products.find({}, fields);

      
        return data;
    },
    getCategoryByID: function( id ){
        var cat = Meteoris.Categories.findOne({_id:id});
        if( cat ){
            if (TAPi18n.getLanguage() == 'fa') 
                cat.title = cat.title
            else
                cat.title = ( cat.hasOwnProperty('i18n') )? cat.i18n.en.title:cat.title;
            return cat;
        }
    },
    getParentCategories: function(){
        var cats = Meteoris.Categories.find({parent:" "});
        var data = cats.map( function(data){
            if (TAPi18n.getLanguage() == 'fa') 
                data.title = data.title
            else
                data.title = data.i18n.en.title; 
            return data;
        })
        return data;
    },
    insertProduct: function(e){
        var name = e.target.name.value;
        var price = e.target.price.value;
        var discount = e.target.discount.value;
        var sdate = e.target.sdate.value;
        var edate = e.target.edate.value;
        var category = e.target.category.value;
        var description = e.target.description.value;
        var metatitle = e.target.metatitle.value;
        var metakey = e.target.metakey.value;
        var imageurl=Session.get("URLIMGBANNER")
        

        var msg = '';
        if( name == "" || price == "" || category == "" || imageurl=="" ||(discount > 0 && (sdate == "" || edate == "")) ){
            if( name == "")
                msg += 'Product name is require.';
            else if( price == "")
                msg += 'Price is require.';
    
            else if( category == "")
                msg += 'Category is require.';
            else if (imageurl=="")
                msg+= "Image is required ";
            else if(discount > 0 && (sdate == "" || edate == "") )
                 msg += 'Start date or end date is require.';

            Meteoris.Flash.set("danger", msg);
            //Session.set('ADDADDRESS', {error:true,msg:msg});
        }else{
            discount = parseInt(discount);
            price = parseInt(price);
            if( discount > 0){
                discount = {discount:discount, startdate:getTimestamp(sdate),enddate:getTimestamp(edate)}
            }else{
                discount = {discount:0}
            }
            var obj = {
                "title" : name,
                "price" : price,
                "discount" : discount,
                "category" : category,
                "description" : description,
                'tags': [],
                "metaTitle": metatitle,
                "metaKeyword": metakey,
                'imageurl':imageurl,
                "date" : new Date(),
            }
            console.log(obj);
            Meteor.call('Meteoris.Products.Insert', obj, function(err){
                if(!err){
                    Meteoris.Flash.set("success", "Product has been added.");
                   
                    FlowRouter.go('/product/list');
                    
                }
            })
            
        }
    },
    updateProduct: function(e){
        var name = e.target.name.value;
        var price = e.target.price.value;
        var discount = (e.target.discount.value != "")? parseInt(e.target.discount.value):0;
        var sdate = e.target.sdate.value;
        var edate = e.target.edate.value;
        var category = e.target.category.value;
        var description = e.target.description.value;
        var metatitle = e.target.metatitle.value;
        var metakey = e.target.metakey.value;
        

        var msg = '';
        if( name == "" || price == "" || category == "" || (discount > 0 && (sdate == "" || edate == "")) ){
            if( name == "")
                msg += 'Product name is require.';
            else if( price == "")
                msg += 'Price is require.';
    
            else if( category == "")
                msg += 'Category is require.';
            else if(discount > 0 && (sdate == "" || edate == "") )
                 msg += 'Start date or end date is require.';

            Meteoris.Flash.set("danger", msg);
            //Session.set('ADDADDRESS', {error:true,msg:msg});
        }else{
            //discount = parseInt(discount);
            price = parseInt(price);
            if( discount > 0){
                discount = {discount:discount, startdate:getTimestamp(sdate),enddate:getTimestamp(edate)}
            }else{
                discount = {discount:0}
            }
            var obj = {
                "title" : name,
                "price" : price,
                "discount" : discount,
                "category" : category,
                "description" : description,
                'tags': [],
                "metaTitle": metatitle,
                "metaKeyword": metakey,
                "date" : new Date(),
            }
            console.log(obj);
             var id = FlowRouter.getParam("id");
            Meteor.call('Meteoris.Products.Update', id, obj, function(err){
                if(!err){
                    Meteoris.Flash.set("success", "Product has been updated.");
                   
                    FlowRouter.go('/product/list');
                    
                }
            })
            
        }
    },
    removeProduct: function(e){
        var id = $(e.currentTarget).attr('data-id');
        Meteor.call('Meteoris.Products.Remove', [id]);
    },
    removeAllProducts: function(e){
        var listId = [];
        $('.checkAll').each( function(){
            if( $(this).prop('checked') ){
                listId.push( $(this).val());
            }
        });
        if( listId.length > 0 )
            Meteor.call('Meteoris.Products.Remove', listId);
        else
            Meteoris.Flash.set("warning", "Product not select.");
    },
    getProductUpdate: function(){
        var id = FlowRouter.getParam("id");
        console.log('id:', id);
        var data = Meteoris.Products.findOne({_id:id});
        console.log(data);
        return data;
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
            //alert(doc.startdate);
            if(brand=='' || doc.discount=='' || doc.startdate=='' || doc.enddate==''){
                Meteoris.Flash.set('danger', 'fields is required !!!'); 
            }else{
                alert("MMMMMMM"+doc.startdate);
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
        if(startdate==''){
            var timestart='';
        }else{
            var getstartdate=new Date(startdate);
            var timestart=getstartdate.getTime();
        }
        var enddate=t.find('#enddate').value
        if(enddate==''){
            var timeend='';
        }else{
            var getenddate=new Date(enddate);
            var timeend=getenddate.getTime();
        }
        
        data= {
            discount:t.find('#discount').value,
            startdate:timestart,
            enddate:timeend,
        };

        return data
    }
});