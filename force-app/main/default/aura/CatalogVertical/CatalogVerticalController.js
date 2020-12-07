({ 
    doInit : function(component, event,helper) 
    { 
       // alert('Working on Side Sizer');
        //alert('hi');
        var id = component.get('v.onselectcustomeid');
        //alert('id : '+id);
         var actionsave = component.get("c.getuserEmail");
        actionsave.setParams({
            customerid: id,
            
        });
        actionsave.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               // alert("Product added to cart successfully:" + response.getReturnValue());
                if (response.getReturnValue()) {
                    var returnvalue = response.getReturnValue();
                    //alert('returnvalue :'+returnvalue.Email);
                   component.set("v.newId",returnvalue);
                   // alert('inside 1');
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
    },

   
    saveproddataNew :function(component, event, helper) {
        var index = event.currentTarget;
        var indexval = index.dataset.record;
        /*alert('index :'+index);
        alert('indexval :'+indexval);
         var vfOrigin = "https://" + component.get("v.visualforceDomain");
        alert('vfOrigin :'+vfOrigin);
        var vfWindow = component.find("vfFrame");
        alert('vfWindow :'+vfWindow);
        vfWindow.postMessage(index, vfOrigin);
        alert('Inside');*/
        
        helper.saveToCartNew(component, event, helper,indexval);
    },

    handleCatalogEvent:function(component, event, helper){
       // alert('3');
        var flag = event.getParam("flag");
        if(flag=='fromSizer')
        {
           // alert('4');
            component.set('v.catalogVertical',true);
        }
        
    },
    close:function(component, event, helper)
    {
        //alert('hie');
      //component.set('v.isSizerQuickview',false);   
    },
    colorChange: function(component, event, helper){
        var ind=event.target.name;
        var color=event.target.id;
        var completeWrap=component.get('v.completeWrap');
        console.log(JSON.stringify(completeWrap));
        completeWrap[ind].selectedColor = color;
        
        component.set('v.completeWrap',completeWrap);
    },
    renderCart:function(component, event, helper) {
        component.set("v.parentcmp",false);
        component.set("v.isShipcmp",true);
    },
    // code for Saving SO and SOLI by chandana 
    saveproddata :function(component, event, helper) {
        var index = event.currentTarget;
        var indexval = index.dataset.record;
        //alert('indexval>>'+indexval);
        helper.saveToCart(component, event, helper,indexval);
    },
    //code for bulk add to cart by Seema
    bulkAdd: function (component, event, helper) {
        console.log(component.get('v.completeWrap'));
        var completeWrap=component.get('v.completeWrap');
        var bulkCartDataToSave=[];
        var retailerCodeId='';
        for(var i=0;i<completeWrap.length;i++)
        {
            //alert(JSON.stringify(completeWrap[i]));
            for(var j=0;j<completeWrap[i].tempMap.length;j++)
            {
                //alert(JSON.stringify(completeWrap[i].tempMap[j]));
                //alert(completeWrap[i].tempMap[j].value.retailercodeId);
                //alert(completeWrap[i].tempMap[j].quantity);
                //alert(completeWrap[i].tempMap[j].value.priceByCurr);
                //alert(completeWrap[i].tempMap[j].value.custRefModel);
                if(completeWrap[i].tempMap[j].quantity && !completeWrap[i].tempMap[j].value.addedToCart)
                {
                    //alert(completeWrap[i].tempMap[j].value.fullboxQty);
                    //alert(completeWrap[i].tempMap[j].value.boxquantity);
                    //alert(completeWrap[i].tempMap[j]);
                    if(completeWrap[i].tempMap[j].value.fullboxQty && completeWrap[i].tempMap[j].value.boxquantity && (completeWrap[i].tempMap[j].quantity<completeWrap[i].tempMap[j].value.boxquantity || completeWrap[i].tempMap[j].quantity % completeWrap[i].tempMap[j].value.boxquantity!=0))
                    {
                        var result = Math.ceil(completeWrap[i].tempMap[j].quantity/completeWrap[i].tempMap[j].value.boxquantity)*completeWrap[i].tempMap[j].value.boxquantity;
                        if (!confirm("Entered value for Product: "+completeWrap[i].tempMap[j].value.MainettiModelCode+" is not the multiples of Box quantity.\nCan system automatically change to nearest mutiples of box quantity ( "+result+" ) ?"))
                        {
                            return; 
                        }
                        retailerCodeId=completeWrap[i].tempMap[j].value.retailercodeId;
                        var singlecartDataToSave={"color":completeWrap[i].tempMap[j].key,"pricebookId":completeWrap[i].tempMap[j].value.priceBookId,"quantity":result,"cur":completeWrap[i].tempMap[j].value.priceByCurr,"custRefModel":completeWrap[i].tempMap[j].value.custRefModel};
                        bulkCartDataToSave.push(singlecartDataToSave);
                    }
                    else
                    {
                        retailerCodeId=completeWrap[i].tempMap[j].value.retailercodeId;
                        var singlecartDataToSave={"color":completeWrap[i].tempMap[j].key,"pricebookId":completeWrap[i].tempMap[j].value.priceBookId,"quantity":completeWrap[i].tempMap[j].quantity,"cur":completeWrap[i].tempMap[j].value.priceByCurr,"custRefModel":completeWrap[i].tempMap[j].value.custRefModel};
                        bulkCartDataToSave.push(singlecartDataToSave); 
                    }
                }
            }
        }
        //alert(JSON.stringify(bulkCartDataToSave));
        if(bulkCartDataToSave.length>0)
            helper.saveBulkToCart(component, event, helper,retailerCodeId,bulkCartDataToSave);
    },
    quickviewcmp :function(component, event, helper)
    {  
        //alert(component.get('v.completeWrap')[event.currentTarget.name].productfamily);
        if(component.get('v.selectedTab')=='Labels & Tickets')            
        { 
            component.set("v.LabelQuickview",true);
            component.set("v.quickviewedProduct",component.get('v.completeWrap')[event.currentTarget.name]); 
        }
        else
            component.set("v.quickviewedProduct",component.get('v.completeWrap')[event.currentTarget.name]);
        if(component.get('v.completeWrap')[event.currentTarget.name].productfamily.includes('SIZER'))
        {
            component.set("v.sizerIndex",event.currentTarget.name);
            component.set("v.quickviewSizer",true);
        }
        else
        {
            component.set("v.quickview",true);
        }
    },
    SelectLabel :function(component, event, helper)
    {
        component.set("v.quickviewedProduct",component.get('v.completeWrap')[event.currentTarget.name]); 
        component.set("v.quickview",true);
        component.set("v.catalogVertical",false);
        component.set("v.displayPagination",false);
        component.set("v.careLabelOrder",true);

    },
    //function helps to hide the increment and  decrement of number field
    afterRender: function (component, event, helper) {
        this.superAfterRender();
        
        //disable up, down, right, left arrow keys
        window.addEventListener("keydown", function(e) {
            if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        
        //disable mousewheel
        window.addEventListener("mousewheel", function(e) {
            e.preventDefault();
        }, false);
        
        window.addEventListener("DOMMouseScroll", function(e) {
            e.preventDefault();
        }, false);
        
    },
    SizerProduct :function(component, event, helper)
    {  
        component.set("v.sizerIndex",event.target.name);
        component.set("v.catalogVertical",false);
        component.set("v.sizerhanger",true);   
        component.set("v.displayPagination",false);
    },
   
    showImageZoomer: function (component, event, helper) {
        //alert('Selected Image');
        event.stopPropagation()

        let zoom;
        let img = component.find('imgContainer')[0].getElement().querySelector('a')
       // var freqRow = component.find('v.imgContainer').find(row => row.Id === event.target.id);
       // alert(img);
        let lensSize = component.get('v.lensSize').replace('px', '');

        //set minimum zoom

        let validateZoom = function (value) {
            if (value < parseInt(lensSize)) {
                zoom = lensSize / value;
                console.log(lensSize);
            }
        }

        if (img.height < img.width) {
            validateZoom(img.height)
        } else {
            validateZoom(img.width);
        }

        if (zoom) {
            component.set('v.zoom', zoom);
        }

        //set lens position

        setTimeout($A.getCallback(() => {
            helper.setLensPosition(component, event)
        }))
        component.set('v.showLens', true);
    },

    hideImageZoomer: function (component, event, helper) {
        component.set('v.showLens', false);
    },

    onmousemove: function (component, event, helper) {
        if (component.get('v.showLens')) {
            helper.setLensPosition(component, event)
        }
    },

    changeZoomValue: function (component, event, helper) {

        if (!component.get('v.showLens')) {
            return
        }

        event.preventDefault();

        let img = component.find('imgContainer').getElement().querySelector('img')
        let lensSize = component.get('v.lensSize').replace('px', '');

        var zoom = component.get('v.zoom');

        var delta = event.deltaY || event.detail || event.wheelDelta;

        if (event.ctrlKey == true) { //change lens size
            lensSize = parseInt(lensSize) - delta / 10;
            if (lensSize < 150 || lensSize > img.offsetWidth * zoom || lensSize > img.offsetHeight * zoom) {
                return
            }
            component.set('v.lensSize', lensSize + 'px')

        } else { //simple wheel scrolling - change zoom

            zoom -= delta / 250;

            if (1 > img.offsetHeight * zoom / lensSize || 1 > img.offsetWidth * zoom / lensSize) {
                return
            }

            component.set('v.zoom', zoom);
        }

        setTimeout($A.getCallback(() => {
            helper.setLensPosition(component, event)
        }))
    },

    showFullScreenMode: function (component, event, helper) {

        component.set('v.showLens', false);

        let modal = component.find('modalWindow').getElement();
        modal.classList.remove('slds-hide')

        let img = component.find('imgContainer').getElement().querySelector('img');
        let fullSizeImageBlock = component.find('fullSizeImageBlock').getElement();

        //set div and backgroundImage size

        fullSizeImageBlock.style.backgroundImage = 'url(' + img.src + ')';
        fullSizeImageBlock.style.backgroundRepeat = 'no-repeat';

        helper.setFullViewImgSize(img, fullSizeImageBlock, false)
        helper.setNewPosition(fullSizeImageBlock, null, false)

        fullSizeImageBlock.style.position = 'absolute';
    },

    closeFullScreenMode: function (component, event, helper) {
        event.stopPropagation()

        let fullSizeImageBlock = component.find('fullSizeImageBlock').getElement();

        fullSizeImageBlock.style.width = '0px';
        fullSizeImageBlock.style.height = '0px';
        fullSizeImageBlock.style.backgroundImage = '';
        fullSizeImageBlock.style.position = '';
        fullSizeImageBlock.style.top = '';
        fullSizeImageBlock.style.left = '';

        helper.clearRotation(fullSizeImageBlock);

        let modal = component.find('modalWindow').getElement();
        modal.classList.add('slds-hide')

        helper.zoom = 1
    },

    stopPropagation: function (component, event, helper) {
        event.stopPropagation()
    },

    rotateRight: function (component, event, helper) {
        event.stopPropagation()
        helper.rotateImage(component, 90)
    },

    rotateLeft: function (component, event, helper) {
        event.stopPropagation()
        helper.rotateImage(component, -90)
    },

    preventDefault: function (component, event, helper) {
        event.preventDefault()
    },

    wheelZoom: function (component, event, helper) {

        event.preventDefault();

        let getPxls = function (value) {
            return parseFloat(value.replace('px', ''))
        }

        let fullSizeImageBlock = component.find('fullSizeImageBlock').getElement();
        let img = component.find('imgContainer').getElement().querySelector('img');

        let oldHeight = getPxls(fullSizeImageBlock.style.height);
        let oldWidth = getPxls(fullSizeImageBlock.style.width);
        let oldTop = event.pageY - getPxls(fullSizeImageBlock.style.top) - window.pageYOffset;
        let oldLeft = event.pageX - getPxls(fullSizeImageBlock.style.left) - window.pageXOffset;

        var delta = event.deltaY || event.detail || event.wheelDelta;

        if (helper.zoom <= delta / 500) {
            return
        }

        helper.zoom -= delta / 500

        let rotate;

        if (fullSizeImageBlock.style.transform) {
            rotate = fullSizeImageBlock.style.transform.replace('px')
        }

        let isRotated = helper.checkIsRotated(rotate);

        helper.setFullViewImgSize(img, fullSizeImageBlock, isRotated, helper.zoom)

        let top = event.pageY - window.pageYOffset - (oldTop*getPxls(fullSizeImageBlock.style.height)/oldHeight);
        let left = event.pageX - window.pageXOffset - (oldLeft*getPxls(fullSizeImageBlock.style.width)/oldWidth);

        fullSizeImageBlock.style.top = top + 'px'// - event.clientY/helper.zoom + 'px'
        fullSizeImageBlock.style.left = left + 'px'// - event.clientX/helper.zoom + 'px'
    },

    startMoving: function (component, event, helper) {

        event.stopPropagation()
        event.preventDefault()

        let x, y

        let fullSizeImageBlock = component.find('fullSizeImageBlock').getElement();

        if (!fullSizeImageBlock.style.top || !fullSizeImageBlock.style.left) {
            let pos = fullSizeImageBlock.getBoundingClientRect();

            y = pos.top;
            x = pos.left;

            fullSizeImageBlock.style.top = y + 'px';
            fullSizeImageBlock.style.left = x + 'px';
        }

        else {
            y = parseFloat(fullSizeImageBlock.style.top.replace('px', ''))
            x = parseFloat(fullSizeImageBlock.style.left.replace('px', ''))
        }

        fullSizeImageBlock.style.position = 'absolute';


        document.body.onmousemove = (e) => {

            console.log(y + (e.pageY - event.pageY) + 'px')
            console.log(x + (e.pageX - event.pageX) + 'px')
            fullSizeImageBlock.style.top = (y + (e.pageY - event.pageY)) + 'px'
            fullSizeImageBlock.style.left = (x + (e.pageX - event.pageX)) + 'px'
        }

        document.body.onmouseup = () => {
            document.body.onmousemove = null
            document.body.onmouseup = null
        }

        document.body.onmouseleave = () => {
            document.body.onmouseleave = null
            document.body.onmousemove = null
            document.body.onmouseup = null
        }
    },
            Image : function (component, event, helper) {
                var action = component.get("c.fetchLookupChildProduct");
                action.setCallback(this, function(response) {
            component.set("v.accounts",response.getReturnValue());
            alert('return value  :' +response.getReturnValue());
           /* var text = 'Bundle Deleted successfully.';
                    helper.successToast(component,event,helper,text);*/
           // alert('Deleted');
            //$A.get('e.force:refreshView').fire();
            
        });
        $A.enqueueAction(action);
    },
             quickviewcmp :function(component, event, helper)
    {  
         //alert("quickview");
        //alert(component.get('v.completeWrap')[event.currentTarget.name].Family);
       
            component.set("v.LabelQuickview",true);
            component.set("v.quickviewedProduct",component.get('v.completeWrap')[event.currentTarget.name]); 
            //alert(component.get('v.completeWrap')[event.currentTarget.name]);
        
            component.set("v.quickviewedProduct",component.get('v.completeWrap')[event.currentTarget.name]);
        component.set("v.sizerIndex",event.currentTarget.name);
            component.set("v.quickviewSizer",true);
        component.set("v.quickview",true);
        if(component.get('v.completeWrap')[event.currentTarget.name].productfamily.includes('SIZER'))
        {
            component.set("v.sizerIndex",event.currentTarget.name);
            component.set("v.quickviewSizer",true);
            
        }
        else
        {
            component.set("v.quickview",true);
        }
    },
             SizerProduct :function(component, event, helper)
    {  
        component.set("v.sizerIndex",event.target.name);
        component.set("v.catalogVertical",false);
        component.set("v.sizerhanger",true);   
        component.set("v.displayPagination",false);
    },

})