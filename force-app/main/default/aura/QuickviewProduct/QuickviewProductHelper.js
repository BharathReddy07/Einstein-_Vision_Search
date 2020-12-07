({
    saveToCart: function(component, event,helper,index) 
    {
        var custid = component.get("v.onselectcustomeid");
        //console.log('quickviewedProduct'+JSON.stringify(component.get("v.quickviewedProduct")));
        var productData = component.get("v.quickviewedProduct");
       // alert('productData :'+productData);
        var selectedColor = productData.selectedColor;
        var priceBook;
        var quantity;
        var boxquantity;
        var fullboxQty;
        //alert(JSON.stringify(component.get("v.quickviewedProduct")));
        for(var i=0;i<productData.tempMap.length;i++)
        {
            if(productData.tempMap[i].key==selectedColor)
            {
                fullboxQty=productData.tempMap[i].value.fullboxQty;
                priceBook = productData.tempMap[i].value;
                //alert(JSON.stringify(priceBook.priceByCurr));
                quantity = productData.tempMap[i].quantity;
                boxquantity=productData.tempMap[i].value.boxquantity;
            }
        }
        // alert('priceBook.priceByCurr '+priceBook.priceByCurr);
        if(!quantity || quantity<=0)
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Entered Product Quantity is not valid',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        else if(quantity)
        {       
            for(var i=0;i<productData.tempMap.length;i++)
            {
                if(fullboxQty && boxquantity &&(quantity<boxquantity || (quantity % boxquantity)!=0))
                {
                    var result = Math.ceil(quantity/boxquantity)*boxquantity;
                    if(productData.tempMap[i].key==selectedColor)
                    {
                        if (!confirm("Entered value for Product: "+productData.Name+" is not the multiples of Box quantity.\nCan system automatically change to nearest mutiples of box quantity ( "+result+" ) ?"))
                        {
                            return; 
                        } 
                    }
                    productData.tempMap[i].quantity=result;
                }
                else
                {
                    productData.tempMap[i].quantity=quantity;
                }
            }
            component.set("v.quickviewedProduct",productData);
        }
        var actionsave = component.get("c.saveSO");
        actionsave.setParams({ 
            customerData : custid,
            retailercode : priceBook.retailercodeId,
            quantity :productData.tempMap[0].quantity,
            priceBookProId : priceBook.priceBookId,
            priceByCurr : priceBook.priceByCurr
            
        });
        actionsave.setCallback(this, function(response) 
                               {
                                   var state = response.getState();
                                   if (state === "SUCCESS") 
                                   {
                                       var toastEvent = $A.get("e.force:showToast");
                                       toastEvent.setParams({
                                           title: "success",
                                           message: 'Product added to cart successfully',
                                           type: "success"
                                       });
                                       toastEvent.fire();
                                       $A.get('e.force:refreshView').fire();
                                   }
                                   else if (state === "INCOMPLETE") {
                                       // do something
                                   }
                                       else if (state === "ERROR") 
                                       {
                                           var toastEvent = $A.get("e.force:showToast");
                                           toastEvent.setParams({
                                               title: "Error",
                                               message: 'Add to cart Failed',
                                               type: "Error"
                                           });
                                           toastEvent.fire();
                                           var errors = response.getError();
                                           if (errors) {
                                               if (errors[0] && errors[0].message) {
                                                   console.log("Error message: " + 
                                                               errors[0].message);
                                               }
                                           } 
                                           else {
                                               console.log("Unknown error");
                                           }
                                       }
                               });
        $A.enqueueAction(actionsave);  
    },    
    magnify : function(component,helper,event)
    {
        //alert('magnify');
        document.getElementById("myresult").style.display="block";
        function imageZoom(imgID, resultID) {
            var img, lens, result, cx, cy;
            img = document.getElementById(imgID);
            result = document.getElementById(resultID);
            /*create lens:*/
            lens = document.createElement("DIV");
            lens.setAttribute("class", "img-zoom-lens");
            /*insert lens:*/
            img.parentElement.insertBefore(lens, img);
            /*calculate the ratio between result DIV and lens:*/
            cx = result.offsetWidth / lens.offsetWidth;
            cy = result.offsetHeight / lens.offsetHeight;
            /*set background properties for the result DIV:*/
            result.style.backgroundImage = "url('" + img.src + "')";
            result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
            /*execute a function when someone moves the cursor over the image, or the lens:*/
            lens.addEventListener("mousemove", moveLens);
            img.addEventListener("mousemove", moveLens);
            /*and also for touch screens:*/
            lens.addEventListener("touchmove", moveLens);
            img.addEventListener("touchmove", moveLens);
            function moveLens(e) {
                var pos, x, y;
                /*prevent any other actions that may occur when moving over the image:*/
                e.preventDefault();
                /*get the cursor's x and y positions:*/
                pos = getCursorPos(e);
                /*calculate the position of the lens:*/
                x = pos.x - (lens.offsetWidth / 2);
                y = pos.y - (lens.offsetHeight / 2);
                /*prevent the lens from being positioned outside the image:*/
                if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
                if (x < 0) {x = 0;}
                if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
                if (y < 0) {y = 0;}
                /*set the position of the lens:*/
                lens.style.left = x + "px";
                lens.style.top = y + "px";
                /*display what the lens "sees":*/
                result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
            }
            function getCursorPos(e) {
                var a, x = 0, y = 0;
                e = e || window.event;
                /*get the x and y positions of the image:*/
                a = img.getBoundingClientRect();
                /*calculate the cursor's x and y coordinates, relative to the image:*/
                x = e.pageX - a.left;
                y = e.pageY - a.top;
                /*consider any page scrolling:*/
                x = x - window.pageXOffset;
                y = y - window.pageYOffset;
                return {x : x, y : y};
            }
        }  
        imageZoom("myimage", "myresult");        
        
    },
    
    magnifyleave : function(component, event, helper) {
        document.getElementById("myresult").style.display="none";
    }
})