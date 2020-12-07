({
    saveToCartNew: function (component, event, helper, index) {
        var custid = component.get("v.onselectcustomeid");
        //alert('custid :'+custid);
        var productData = component.get("v.completeWrap")[index];      
        //alert('productData :'+productData.Name);
          //alert('productData :'+productData.Email);
        console.log('productData :'+productData);
        var newId = component.get("v.newId");
        //alert('newId :'+newId.Email);
        var qty = productData.Quantity_temp_holder__c;
        //var qty = component.get("v.qtyEntered");
        //alert("qty:" + qty);
         var formSubmit = $A.get("e.c:FormSubmit");
    formSubmit.setParams({"eventAttributeName" : productData,
                        "eventAttributeCustId" : custid,
                         "eventAttributeuser" : newId.Email})
    var test = formSubmit.getParam("eventAttribute");
        //alert('test :'+test.Name);
    formSubmit.fire();
       // return;
        alert('Inside');
        if (!qty || qty <= 0) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Entered Product Quantity is not valid',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }

        var actionsave = component.get("c.saveToCart");
        actionsave.setParams({
            userId: custid,
            product: productData,
            quantity: qty
        });
        actionsave.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //alert("Product added to cart successfully:" + response.getReturnValue());
                if (response.getReturnValue()) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "success",
                        message: 'Product added to cart successfully',
                        type: "success"
                    });
                    toastEvent.fire();
                    $A.get('e.force:refreshView').fire();
                    }
                    else {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: "Error",
                            message: 'Add to cart Failed',
                            type: "Error"
                        });
                        toastEvent.fire();
                    }
            } else if (state === "ERROR") {                
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                }
            }
        });
        $A.enqueueAction(actionsave);
        component.set("qty", '');
    },

    saveToCart: function(component, event,helper,index) 
    {
        var custid = component.get("v.onselectcustomeid");
        var indexarr = index.split(" ");
        var completeData = component.get("v.completeWrap");
        //alert(JSON.stringify( component.get("v.completeWrap")));
        var productData = component.get("v.completeWrap")[indexarr[0]];
        //alert('productData.tempMap[indexarr[1]]>>'+JSON.stringify(component.get("v.completeWrap")[indexarr[0]]));
        var retailercode = productData.tempMap[indexarr[1]].value.retailercodeId;
        var qty = productData.tempMap[indexarr[1]].quantity;
        var boxquantity=productData.tempMap[indexarr[1]].value.boxquantity;
        //alert('boxquantity>>'+productData.tempMap[indexarr[1]].value.boxquantity);
        var fullboxQty=productData.tempMap[indexarr[1]].value.fullboxQty;
        var currency = productData.tempMap[indexarr[1]].value.priceByCurr;
        var custRefModel = productData.tempMap[indexarr[1]].value.custRefModel;

        // alert('qty>>'+boxquantity);
        if(!qty || qty<=0)
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
        else if(fullboxQty && boxquantity && (qty<boxquantity || qty % boxquantity!=0))
        {
              //code to add the upper limit of box quantity by chandana 
             var result = Math.ceil(qty/boxquantity)*boxquantity;
            //alert('result '+result);
            if(result)
            {
                if (!confirm("Entered value for Product: "+component.get("v.completeWrap")[indexarr[0]].Name+" is not the multiples of Box quantity.\nCan system automatically change to nearest mutiples of box quantity ( "+result+" ) ?"))
                {
                    return; 
                }
                productData.tempMap[indexarr[1]].quantity = result;
                completeData[indexarr[0]] = productData;
                component.set("v.completeWrap", completeData);                
            }
            else
            {
                return;
            }            
        }  
        var PricebookData = productData.tempMap[indexarr[1]].value.priceBookId;
        var actionsave = component.get("c.saveSO");
        actionsave.setParams({ 
            customerData : custid,
            retailercode : retailercode,
            quantity : productData.tempMap[indexarr[1]].quantity,
            priceBookProId : PricebookData,
            priceByCurr : currency,
            custRefModel : custRefModel
        });
        actionsave.setCallback(this, function(response) 
                               {
                                   var state = response.getState();
                                   console.log('state:::'+state);
                                   if (state === "SUCCESS") 
                                   {
                                       //alert("Product added to cart successfully:"+response.getReturnValue());
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
        component.set("qty",'');
    },
    saveBulkToCart: function(component, event,helper,retailerCodeId,bulkCartDataToSave) 
    {
        //alert(JSON.stringify(bulkCartDataToSave));
        var custid = component.get("v.onselectcustomeid");
        var actionSaveBulk = component.get("c.addBulkProduct");
        actionSaveBulk.setParams({ 
            custid : custid,
            retailerCodeId : retailerCodeId,
            bulkCartDataToSave : JSON.stringify(bulkCartDataToSave),
        });
        actionSaveBulk.setCallback(this, function(response) {
            var state = response.getState();
            //alert('state:::'+response.getState());
            if (state === "SUCCESS") 
            {
                //alert("Product added to cart successfully:"+response.getReturnValue());
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
                    //alert(JSON.stringify(response.getError()));
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
        $A.enqueueAction(actionSaveBulk);  
    },
     zoom: 1,

    setLensPosition: function (component, event) {

        var img, lens, pos, x, y, lensShadow, zoom;

        zoom = component.get('v.zoom');

        img = component.find('imgContainer').getElement().querySelector('img')
        //alert(img);
        lens = component.find('lens').getElement();
        lensShadow = component.find('lensShadow').getElement();

        /* Get the cursor's x and y positions: */
        pos = this.getCursorPos(event, img, lens, zoom);

        this.calculateLensPosition(event, lens);

        if (!pos) {
            return
        }

        /* Calculate the position of the lens: */
        x = pos.x;
        y = pos.y;

        let xMax = img.offsetWidth - lens.offsetWidth / zoom;

        if (x > xMax) {
            x = xMax;
        } else if (x < 0) {
            x = 0;
        }

        let yMax = img.offsetHeight - lens.offsetHeight / zoom;

        if (y > yMax) {
            y = yMax;
        } else if (y < 0) {
            y = 0
        }


        lens.style.backgroundImage = "url('" + img.src + "')";
        lens.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
        lens.style.backgroundPosition = "-" + (x * zoom) + "px -" + (y * zoom) + "px";

        lensShadow.style.left = x + "px";
        lensShadow.style.top = y + "px";

        lensShadow.style.width = lens.offsetWidth / zoom + 'px'
        lensShadow.style.height = lens.offsetHeight / zoom + 'px'
    },

    getCursorPos: function (e, img, zoomer, zoom) {
        var a, x = 0, y = 0;
        if (!img) {
            return
        }
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left - zoomer.offsetWidth / (zoom * 2) - window.pageXOffset
        y = e.pageY - a.top - zoomer.offsetHeight / (zoom * 2) - window.pageYOffset
        return {x: x, y: y};
    },

    calculateLensPosition: function (event, lens) {
        // debugger
        let top, left, shift;

        shift = 50;

        if (document.documentElement.clientWidth > event.clientX + lens.offsetWidth + shift*2) {
            left = (event.clientX + shift);
        } else {
            left = (event.clientX - lens.offsetWidth - shift);
        }

        if (document.documentElement.clientHeight > event.clientY + lens.offsetHeight + shift*2) {
            top = (event.clientY + shift);
        } else {
            top = (document.documentElement.clientHeight - shift) - lens.offsetHeight
        }
        lens.style.left = left + 'px'
        lens.style.top = top + 'px'
    },

    setFullViewImgSize: function (img, fullSizeImageBlock, isRotated, zoom) {

        let maxWidth = document.documentElement.clientWidth - 60;
        let maxHeight = document.documentElement.clientHeight - 60;

        let width, height, imgProportions, screenProportions, x, y;

        if (!isRotated) {
            x = img.naturalWidth;
            y = img.naturalHeight;
        } else {
            x = img.naturalHeight;
            y = img.naturalWidth;
        }

        //calculate width and height by image and screen size and proportions

        screenProportions = maxWidth / maxHeight;
        imgProportions = x / y;

        if (x < maxWidth && y < maxHeight) {
            width = x;
            height = y;
        } else if (x > maxWidth && y < maxHeight) {
            width = maxWidth;
            height = maxWidth / imgProportions;
        } else if (x < maxWidth && y > maxHeight) {
            height = maxHeight;
            width = maxHeight * imgProportions;
        } else if (x > maxWidth && y > maxHeight) {
            if (screenProportions > imgProportions) {
                height = maxHeight;
                width = maxHeight * imgProportions;
            } else if (screenProportions < imgProportions) {
                width = maxWidth;
                height = maxWidth / imgProportions;
            }
        }

        if (!width || !height) {
            width = maxWidth;
            height = maxHeight;
        }

        if (!zoom) {
            zoom = 1;
        }

        if (isRotated) {
            fullSizeImageBlock.style.backgroundSize = height * zoom + 'px ' + width * zoom + 'px';
            fullSizeImageBlock.style.width = height * zoom + 'px';
            fullSizeImageBlock.style.height = width * zoom + 'px';
        } else {
            fullSizeImageBlock.style.backgroundSize = width * zoom + 'px ' + height * zoom + 'px';
            fullSizeImageBlock.style.width = width * zoom + 'px';
            fullSizeImageBlock.style.height = height * zoom + 'px';
        }
    },

    rotateImage: function (component, rotate) {

        let img = component.find('imgContainer').getElement().querySelector('img');
        let fullSizeImageBlock = component.find('fullSizeImageBlock').getElement();

        var rotate = this.calcNewRotate(fullSizeImageBlock, rotate);

        let isRotated = this.checkIsRotated(rotate)

        this.setFullViewImgSize(img, fullSizeImageBlock, isRotated)

        fullSizeImageBlock.style.position = '';

        let oldPosition = fullSizeImageBlock.getBoundingClientRect();

        this.setNewRotate(fullSizeImageBlock, rotate)

        this.setNewPosition(fullSizeImageBlock, oldPosition, isRotated)
    },

    calcNewRotate: function (fullSizeImageBlock, rotate) {
        let newRotate = -90;
        if (fullSizeImageBlock.style.transform) {
            newRotate = this.getOldRotate(fullSizeImageBlock);
            newRotate = parseInt(newRotate) + rotate;
            newRotate = (rotate === -360 || rotate === 360) ? 0 : newRotate;
        }
        return newRotate;
    },

    checkIsRotated: function (rotate) {
        if (!(rotate / 90 % 2)) {
            return false;
        }
        return true
    },

    getOldRotate: function (fullSizeImageBlock) {
        return parseInt(fullSizeImageBlock.style.transform.replace('rotate(', '').replace(')', ''));
    },

    setNewRotate: function (fullSizeImageBlock, rotate) {
        fullSizeImageBlock.style.webkitTransform = 'rotate(' + rotate + 'deg)';
        fullSizeImageBlock.style.MozTransform = 'rotate(' + rotate + 'deg)';
        fullSizeImageBlock.style.msTransform = 'rotate(' + rotate + 'deg)';
        fullSizeImageBlock.style.OTransform = 'rotate(' + rotate + 'deg)';
        fullSizeImageBlock.style.transform = 'rotate(' + rotate + 'deg)';
    },

    setNewPosition: function (fullSizeImageBlock, oldPosition, isRotated) {

        let pos = fullSizeImageBlock.getBoundingClientRect();

        if (!isRotated) {
            fullSizeImageBlock.style.top = pos.top + 'px';
            fullSizeImageBlock.style.left = pos.left + 'px';
            return
        }

        let yNew = oldPosition.top //+ (pos.height - oldPosition.height)/2;
        let xNew = oldPosition.left //- (pos.width - oldPosition.width)/2;

        fullSizeImageBlock.style.top = yNew + 'px';
        fullSizeImageBlock.style.left = xNew + 'px';

        fullSizeImageBlock.style.position = 'absolute';
    },

    clearRotation: function (fullSizeImageBlock) {
        fullSizeImageBlock.style.webkitTransform = '';
        fullSizeImageBlock.style.MozTransform = '';
        fullSizeImageBlock.style.msTransform = '';
        fullSizeImageBlock.style.OTransform = '';
        fullSizeImageBlock.style.transform = '';
    }

})