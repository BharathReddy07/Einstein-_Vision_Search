({
    /*toGetcustomerDataNew: function (component, event, helper) {
        var actiongetcart = component.get("c.getAllCartDetails");
        var custid = component.get("v.DisplayCustDetail");
        //alert("custid:" + custid);
        actiongetcart.setParams({
            "customerid": custid
        });
        actiongetcart.setCallback(this, function (response) {
            var state = response.getState();
            //alert("State:" + state);
            if (state === "SUCCESS") {                
                if (response.getReturnValue() != null) {
                    component.set('v.CartValue', response.getReturnValue().length);
                    component.set('v.DisplayCartDetail', response.getReturnValue());
                    var result = response.getReturnValue();
                    //for (var i = 0; i < result.length; i++){
                        //alert("inside loop");
                        //var rows = result[i];
                        //if (rows.Product__c) rows.Product__r.Product_Type__c = rows.Product__r.Product_Type__c;                        
                        //alert("ProdType:" + result[i].Product__r.Product_Type__c);
                    //}                   
                } else {
                    if (component.get('v.CartValue') == 0) {
                        component.set("v.HideButtons", false);
                    }
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "warning",
                        message: 'No Product in Cart',
                        type: "warning"
                    });
                    toastEvent.fire();
                }
            }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(actiongetcart);
    },*/

    /*getBundleProductList: function (component, event, helper) {
        var action = component.get("c.getBundleProducts");
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set('v.bundleProductList', response.getReturnValue());                    
                }
            }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);
    },*/
    
    fetchCartDetails: function (component, event, helper) {
        var custid = component.get("v.DisplayCustDetail");
        //alert("custid:" + custid);
        
        var action = component.get("c.FetchCartDetails");
        action.setParams({
            "customerid": custid
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if (response.getReturnValue() != null) {
                    component.set('v.CartValue', response.getReturnValue().length);
                    component.set('v.DisplayCartDetail', response.getReturnValue());   
                    //console.log(response.getReturnValue().soli.Product_Name__c);
                }
            }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);
    },
    
    ClearCartNew:function(component, event,helper){
        var action1 = component.get("c.ClearCartDetails");
        action1.setCallback(this, function(response){
            var state = response.getState();            
            if (state === "SUCCESS"){
                var deleteStatus = response.getReturnValue();
                if (deleteStatus) {
                    var message = 'Cart Cleared Successfully';
                    helper.successToast(component, event, helper, message);
                    $A.get('e.force:refreshView').fire();
                } else {
                    var message = 'Failed to delete';
                    helper.errorToast(component, event, helper, message);
                }
            }
            else if (state === "ERROR") {
                var message = 'Contact System Admin';
                helper.errorToast(component, event, helper, message);
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action1);
    },

    toDeleteProductCart:function(component, event,helper,index) {
        var CartDisplay = component.get('v.DisplayCartDetail');
        /*alert("soId:" + CartDisplay[index].soli.Sales_Order__c + "\n" +
            "soliId:" + CartDisplay[index].soli.Id);*/

        var action = component.get("c.deleteProductFromCart");
        action.setParams({ 
            "soId": CartDisplay[index].soli.Sales_Order__c,
            "soliId": CartDisplay[index].soli.Id
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var deleteStatus = response.getReturnValue();
                if (deleteStatus) {
                    component.rerenderCart();
                    var message = 'Cart Cleared Successfully';
                    helper.successToast(component, event, helper, message);
                } else {
                    var message = 'Failed to delete';
                    helper.errorToast(component, event, helper, message);
                }
                /*component.set('v.CartValue',response.getReturnValue().length);
                component.set("v.DisplayCartDetail", response.getReturnValue());
                if(component.get("v.CartValue") == 0)
                {
                    component.set("v.HideButtons",false);
                }*/
                
            }
        });
        $A.enqueueAction(action);
    },
    UpdateCart:function(component, event,helper) {
        
        //var index=event.getSource().get("v.name");
        //var updatedQuantity=event.getSource().get("v.value");
        //var proName;
        var qtyval;
        var temp= component.get("v.DisplayCartDetail");
        for(var i=0;i<temp.length;i++) {
            //code to add the upper limit of box quantity by chandana  
            //var result = Math.ceil(temp[i].Quantity/temp[i].boxquantity)*temp[i].boxquantity;
            var newqty= temp[i].soli.Quantity__c;
            //alert('newqty'+newqty);
            if(!newqty || newqty<=0)
            {
                qtyval = temp[i].soli.Quantity__c;
            }
        }
        component.set('v.DisplayCartDetail', temp);
        if(qtyval || qtyval<=0 ) {
            var message = 'Entered Product Quantity is not valid';
            helper.warningToast(component, event, helper, message);
            return;
        } else {
            var CartDisplay = JSON.stringify(component.get('v.DisplayCartDetail'));
            var action = component.get("c.updateCartValue");
            action.setParams({ 
                "solilistjson":CartDisplay
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                    var updateStatus = response.getReturnValue();
                    if (updateStatus) {
                        component.rerenderCart();
                        var message = 'Cart Updated Successfully';
                        helper.successToast(component, event, helper, message);
                    } else {
                        var message = 'Failed to Update';
                        helper.errorToast(component, event, helper, message);
                    }
                }
            });
            $A.enqueueAction(action);
        }
        component.set("v.PlaceorderBtn",false);
        var PlaceorderBtn=component.find('placeorder');
        $A.util.removeClass(PlaceorderBtn, 'slds-button_disabled');
    },
    
    successToast: function (component, event, helper,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "success",
            message: message,
            type: "success"
        });
        toastEvent.fire();
    },
    errorToast: function (component, event, helper,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "Error",
            message: message,
            type: "Error"
        });
        toastEvent.fire();
    },
    warningToast: function (component, event, helper,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: "Warning",
            message: message,
            type: "warning"
        });
        toastEvent.fire();
    },
    /*toGetcustomerData: function (component, event, helper) {
        var action1 = component.get("c.FetchCustData");
        action1.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set("v.DisplayCustDetail", response.getReturnValue().Customer_Information__c);
                //alert('displaycustdetails>>'+component.get("v.DisplayCustDetail"));
                var actiongetcart = component.get("c.getAllCartDetails");
                var custid =component.get("v.DisplayCustDetail");
                actiongetcart.setParams({ 
                    "customerid": custid
                });
                actiongetcart.setCallback(this, function(response){
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        if(response.getReturnValue()!= null)
                        {
                            component.set('v.CartValue',response.getReturnValue().length);
                            component.set('v.DisplayCartDetail',response.getReturnValue());
                            //alert('cartdetails>>'+component.get("v.DisplayCartDetail"));
                        }
                        else
                        {
                            if(component.get('v.CartValue') == 0)
                            {
                                component.set("v.HideButtons",false);
                            } 
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title: "warning",
                                message: 'No Product in Cart',
                                type: "warning"
                            });
                            toastEvent.fire();
                        }
                        
                    }
                    var spinner = component.find('spinner');
                    $A.util.toggleClass(spinner, "slds-hide");
                });
                $A.enqueueAction(actiongetcart); 
                
            }
        });
        $A.enqueueAction(action1);
    },*/
    /*toDeleteProductCart:function(component, event,helper,index) {
        var CartDisplay =component.get('v.DisplayCartDetail');
        var action = component.get("c.deleteProductFromCart");
        action.setParams({ 
            "soliId": CartDisplay[index].Id,
            "soId":CartDisplay[index].SOid
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.CartValue',response.getReturnValue().length);
                component.set("v.DisplayCartDetail", response.getReturnValue());
                if(component.get("v.CartValue") == 0)
                {
                    component.set("v.HideButtons",false);
                }
                
            }
        });
        $A.enqueueAction(action);
    },*/
    /*UpdateCart:function(component, event,helper) {
        
        var index=event.getSource().get("v.name");
        var updatedQuantity=event.getSource().get("v.value");
        var proName;
        var qtyval;
        var temp= component.get("v.DisplayCartDetail");
        for(var i=0;i<temp.length;i++)
        {
            //code to add the upper limit of box quantity by chandana  
            var result = Math.ceil(temp[i].Quantity/temp[i].boxquantity)*temp[i].boxquantity;
            var newqty= temp[i].Quantity;
            //alert('newqty'+newqty);
            if(temp[i].boxquantity)
            {
                //alert('inside temp>>'+temp[i].boxquantity);
                var boxqty = temp[i].boxquantity;
                var rem = ((newqty) % boxqty);
                //alert(rem);
                if(rem!=0 && temp[i].fullboxQty == true)
                {
                    //alert('inside rem');
                    if (confirm("Entered value for Mainetti Model Code: "+temp[i].PSBP+" is not the multiples of Box quantity.\nCan system automatically change to nearest mutiples of box quantity ( "+result+" ) ?")) 
                    {
                        temp[i].Quantity = result;
                        proName = temp[i].Name;
                        component.set('v.DisplayCartDetail',temp);
                    }
                    else{
                        return;
                    }
                }
                if(!newqty || newqty<=0)
                {
                    temp[i].Quantity = boxqty;
                }
            }
            if(!newqty || newqty<=0)
            {
                qtyval = temp[i].Quantity;
            }
        }
        component.set('v.DisplayCartDetail',temp);
        if(qtyval || qtyval<=0 )
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
        else{
            var CartDisplay =JSON.stringify(component.get('v.DisplayCartDetail'));
            var action = component.get("c.updateCartValue");
            action.setParams({ 
                "solilistjson":CartDisplay
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") 
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "success",
                        message: 'Cart Updated Successfully',
                        type: "success"
                    });
                    toastEvent.fire();
                }
                else if (state === "INCOMPLETE") {
                    // do something
                }
                    else if (state === "ERROR") 
                    {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: "Error",
                            message: 'Contact System Admin ',
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
            $A.enqueueAction(action);
        }
        component.set("v.PlaceorderBtn",false);
        var PlaceorderBtn=component.find('placeorder');
        $A.util.removeClass(PlaceorderBtn, 'slds-button_disabled');
    },*/
    
    CalBoxQty:function(component, event,helper) 
    {
        var proName;
        var qtyval;
        var temp= component.get("v.DisplayCartDetail");
        for(var i=0;i<temp.length;i++)
        {
            //code to add the upper limit of box quantity by chandana 
            var result = Math.ceil(temp[i].Quantity/temp[i].boxquantity)*temp[i].boxquantity;
            //alert('result>>'+result);
            var newqty= temp[i].Quantity;
            if(temp[i].boxquantity)
            {
                var boxqty = temp[i].boxquantity;
                
                var rem = ((newqty) % boxqty);
                if(rem!=0 && temp[i].fullboxQty == true)
                {
                    temp[i].Quantity = boxqty;
                    proName = temp[i].Name;
                    break;
                }
                else if(!newqty || newqty<=0)
                {
                    //alert('newqty1');
                    qtyval = temp[i].Quantity;
                }
            }
        }
        if(proName)        
        {
            component.set('v.DisplayCartDetail',temp);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'One of the entered Quantity is not the multiple of box quantity, Click Update Cart to update',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        if(qtyval){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Entered Product Quantity is not valid',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        else
        {
            component.set("v.GetAddress",true);
        }
        
    },
    //Added by Seema
    /*checkingAddAndCloneData:function(component,event,helper,custid) 
    { 
        var AddandCloneData=component.get('c.checkLengthAddAndCloneDataToDelete');
        AddandCloneData.setParams({
            "customerid": custid
        });
        AddandCloneData.setCallback(this, function(response) {
            var state = response.getState();
            //alert(response.getState());
            if(state === 'SUCCESS'){
                //alert(response.getReturnValue().length);
                if(response.getReturnValue().length>0)
                {
                    component.set("v.confirmdataSection",true);
                    //var confirmdata=confirm("Some products are selected, but  not added into Cart."+"\n"+"Click OK to add pending products to Cart."+"\n"+"Click Cancel to DELETE selected products and proceed to create Order.");
                    //alert(confirmdata);
                    if (confirmdata) 
                    {
                        component.set("v.GetAddress",false);
                        component.set("v.parentcmp",true);
                        component.set("v.Shipcmp",false);
                        var urlString = window.location.href;
                        var CommunityBaseURL = urlString.substring(0, urlString.indexOf("/s/"));
                        //alert(CommunityBaseURL+'/s/catalog-order')
                        window.location = CommunityBaseURL+'/s/catalog-order';
                    }
                    else
                    {
                        var deleteData=component.get('c.checkAddAndCloneDataToDelete');
                        //alert('???'+JSON.stringify(component.get('c.checkAddAndCloneDataToDelete')));
                        deleteData.setParams({
                            "customerid": custid
                        });
                        deleteData.setCallback(this, function(response) {
                            var state = response.getState();
                            //alert(response.getState());
                            if(state === 'SUCCESS'){
                                this.CalBoxQty(component, event,helper);
                                //component.set("v.GetAddress",true);
                            }
                            else if(state === 'ERROR'){
                                alert('ERROR OCCURED.'+JSON.stringify(response.getError()));
                            }
                        })
                        $A.enqueueAction(deleteData);
                    }
                }
                else
                {
                    this.CalBoxQty(component, event,helper);
                }
            }
            else if(state === 'ERROR'){
                alert('ERROR OCCURED.'+JSON.stringify(response.getError()));
            }
        })
        $A.enqueueAction(AddandCloneData);
        // alert('data>>'+JSON.stringify(AddandCloneData));
    },*/
    confirmdata:function(component,event,helper,custid)
    {
        //alert('confirmdata');
        component.set("v.GetAddress",false);
        component.set("v.parentcmp",true);
        component.set("v.Shipcmp",false);
        var urlString = window.location.href;
        var CommunityBaseURL = urlString.substring(0, urlString.indexOf("/s/"));
        //alert(CommunityBaseURL+'/s/catalog-order')
        window.location = CommunityBaseURL+'/s/catalog-order';
    },
    deleteData:function(component,event,helper,custid)
    {         
        var AddandCloneData=component.get('c.checkLengthAddAndCloneDataToDelete');
        AddandCloneData.setParams({
            "customerid": custid
        });
        AddandCloneData.setCallback(this, function(response) {
            var state = response.getState();
            //alert(response.getState());
            if(state === 'SUCCESS'){
                //alert(response.getReturnValue().length);
                if(response.getReturnValue().length>0)
                {                    
                    var deleteData=component.get('c.checkAddAndCloneDataToDelete');
                    //alert('???'+JSON.stringify(component.get('c.checkAddAndCloneDataToDelete')));
                    deleteData.setParams({
                        "customerid": custid
                    });
                    deleteData.setCallback(this, function(response) {
                        var state = response.getState();
                        //alert(response.getState());
                        if(state === 'SUCCESS'){
                            this.CalBoxQty(component, event,helper);
                            //component.set("v.GetAddress",true);
                        }
                        else if(state === 'ERROR'){
                            alert('ERROR OCCURED.'+JSON.stringify(response.getError()));
                        }
                    })
                    $A.enqueueAction(deleteData);
                }
                
                else
                {
                    this.CalBoxQty(component, event,helper);
                }
            }
            else if(state === 'ERROR'){
                alert('ERROR OCCURED.'+JSON.stringify(response.getError()));
            }
        })
        $A.enqueueAction(AddandCloneData);
        // alert('data>>'+JSON.stringify(AddandCloneData));
        component.set("v.confirmdataSection",false);
    },
    /*ClearCart:function(component, event,helper) 
    {
        var CustomerID=component.get('v.DisplayCustDetail');
        var action1 = component.get("c.ClearCartDetails");
        //action1.setParams({ 
          //  "customerid":CustomerID
        //});
        action1.setCallback(this, function(response){
            var state = response.getState();
            
            if (state === "SUCCESS") 
            {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: "success",
                    message: 'Cart Cleared Successfully',
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
                        message: 'Contact System Admin ',
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
                    else{console.log("Unknown error");}
                }
        });
        $A.enqueueAction(action1);
    }*/
})