({
    toGetCustomerAddess : function(component, event,helper) 
    {
        var custInfoid =component.get("v.CustomerInfoID");
        var action = component.get("c.FetchCustAdd");
        
        action.setParams({ 
            "custInfoid": custInfoid
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            var res = response.getReturnValue();
            if (state === "SUCCESS") 
            {
                //console.log("res "+JSON.stringify(res));
                component.set("v.salesOrderObj", res.protoSO);
                component.set("v.BillAddressList", res.billAddList);
                component.set("v.ShipAddressList", res.shipAddList);
                component.set("v.companyList", res.companyPicklist);
                component.set("v.currencyList", res.currencyPicklist);
                component.set("v.shipTermList", res.deliveryPicklist);
                component.set("v.templateList", res.templateList);
                /*component.set("v.shipTermList", res.shipTermList);
                component.set("v.suzhouFlag", res.SuzhouFlag);
                component.set("v.seasonList", res.seasonsList);
                component.set("v.seasonYearList", res.seasonsYearList);
                component.set("v.divisionList", res.divisionList);*/
                /*if(res.protoSO.OrderSource__c == 'Cloned')
                {
                    var today = new Date();
                    var formattedDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
                    res.protoSO.Expected_Delivery_Date__c = formattedDate;
                    component.set("v.salesOrderObj", res.protoSO);
                }
                else
                {
                	component.set("v.salesOrderObj.Supplier_Code__c", res.protoSO.Supplier_Code__c);
                	component.set("v.salesOrderObj.Manufacturer_Code__c", res.protoSO.Manufacturer_Code__c);
                	component.set("v.salesOrderObj.Id", res.protoSO.Id);
                }*/
                
                /*if(component.get("v.OrderSource")=="PO")
                {
                    var currencyListVar = this.toGetDependentValues(component,res.defaultCompany,'Order_Country__c','Preferred_Currency__c');
                    component.set('v.currencyList',currencyListVar);
                    //var currList = [];
                    //currList.push(res.defaultCurrency);
                    //component.set("v.currencyList", currList);
                    
                    component.set("v.salesOrderObj.Company__c", res.defaultCompany);
                    component.set("v.salesOrderObj.CurrencyIsoCode", res.defaultCurrency);
                    
                    if(res.defaultCompany.includes("Suzhou"))
                    {
                        if(res.buyerAddList.length==0)
                        {
                            var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    title: "Warning",
                                    message: "Please update default company as Suzhou and add at least 1 Buyer address.",
                                    type: "warning"
                                });
                                toastEvent.fire();
                                //component.set("v.salesOrderObj.Company__c","NULL");
                                return;
                        }
                        if(res.invoiceAddList.length==0)
                        {
                            var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    title: "Warning",
                                    message: "Please update default company as Suzhou and add at least 1 Invoice To address.",
                                    type: "warning"
                                });
                                toastEvent.fire();
                                //component.set("v.salesOrderObj.Company__c","NULL");
                                return;
                        }
                    }
                    
                }*/
                /*else
                {
                    component.set("v.companyName", res.defaultCompany);
                    component.set("v.currencyName", res.defaultCurrency);
                    if(res.defaultCompany.includes("Suzhou"))
                    {
                        component.set("v.suzhouFlag",true);
                        
                        if(res.buyerAddList.length==0)
                        {
                            var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    title: "Warning",
                                    message: "Please update default company as Suzhou and add at least 1 Buyer address.",
                                    type: "warning"
                                });
                                toastEvent.fire();
                                component.set("v.salesOrderObj.Company__c","NULL");
                                return;
                        }
                        if(res.invoiceAddList.length==0)
                        {
                            var toastEvent = $A.get("e.force:showToast");
                                toastEvent.setParams({
                                    title: "Warning",
                                    message: "Please update default company as Suzhou and add at least 1 Invoice To address.",
                                    type: "warning"
                                });
                                toastEvent.fire();
                                component.set("v.salesOrderObj.Company__c","NULL");
                                return;
                        }
                    }
                }*/
                
                /*if(res.protoSO.OrderSource__c == 'Cloned')
                {
                    this.getSelectedAddress(component, event,helper);
                }
                else
                {
                	this.getDefaultAddress(component, event,helper);
                }*/
                this.getDefaultAddress(component, event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    getDefaultAddress : function(component, event, helper)
    {
        //to get default address index
        var BillAddressList = component.get("v.BillAddressList");
        var BillAddressIndex = component.get("v.BillAddressIndex");
        
        for(var i=0; i<BillAddressList.length; i++)
        {
            if(BillAddressList[i].Is_Default__c)
                BillAddressIndex = i;
        }
        component.set('v.BillAddressIndex',BillAddressIndex);
        
        var ShipAddressList = component.get("v.ShipAddressList");
        var ShipAddressIndex = component.get("v.ShipAddressIndex");
        for(var i=0; i<ShipAddressList.length; i++)
        {
            if(ShipAddressList[i].Is_Default__c)
                ShipAddressIndex = i;
        }
        component.set('v.ShipAddressIndex',ShipAddressIndex);
        var BuyerAddressList = component.get("v.BuyerAddressList");
        var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
        for(var j=0; j<BuyerAddressList.length; j++)
        {
            if(BuyerAddressList[j].Is_Default__c)
                BuyerAddressIndex = j;
        }
        component.set('v.BuyerAddressIndex',BuyerAddressIndex);
        var InvoiceAddressList = component.get("v.InvoiceAddressList");
        var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
        for(var k=0; k<InvoiceAddressList.length; k++)
        {
            if(InvoiceAddressList[k].Is_Default__c)
                InvoiceAddressIndex = k;
        }
        component.set('v.InvoiceAddressIndex',InvoiceAddressIndex);
    },
    getSelectedAddress : function(component, event, helper)
    {
        //to get default address index
       	var so = component.get("v.salesOrderObj");
        var BillAddressList = component.get("v.BillAddressList");
        var BillAddressIndex = component.get("v.BillAddressIndex");
        for(var i=0; i<BillAddressList.length; i++)
        {
            if(BillAddressList[i].Id == so.Bill_to_Address__c)
            {
                BillAddressList[i].Is_Default__c = true;
                BillAddressIndex = i;
            }
            else
                BillAddressList[i].Is_Default__c = false;
        }
        component.set('v.BillAddressList',BillAddressList);
        component.set('v.BillAddressIndex',BillAddressIndex);
        
        var ShipAddressList = component.get("v.ShipAddressList");
        var ShipAddressIndex = component.get("v.ShipAddressIndex");
        for(var i=0; i<ShipAddressList.length; i++)
        {
            if(ShipAddressList[i].Id == so.Ship_to_Address__c)
            {
                ShipAddressList[i].Is_Default__c = true;
                ShipAddressIndex = i;
            }
            else
                ShipAddressList[i].Is_Default__c = false;
        }
        component.set('v.ShipAddressList',ShipAddressList);
     	component.set('v.ShipAddressIndex',ShipAddressIndex);
        
        var BuyerAddressList = component.get("v.BuyerAddressList");
        var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
        for(var j=0; j<BuyerAddressList.length; j++)
        {
            if(BuyerAddressList[j].Is_Default__c)
            {
                BuyerAddressList[j].Is_Default__c = true;
                BuyerAddressIndex = i;
            }
            else
                BuyerAddressList[j].Is_Default__c = false;
        }
        component.set('v.BuyerAddressList',BuyerAddressList);
        component.set('v.BuyerAddressIndex',BuyerAddressIndex);
     
        var InvoiceAddressList = component.get("v.InvoiceAddressList");
        var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
        for(var k=0; k<InvoiceAddressList.length; k++)
        {
            if(InvoiceAddressList[k].Is_Default__c)
            {
                InvoiceAddressList[k].Is_Default__c = true;
                InvoiceAddressIndex = i;
            }
            else
                InvoiceAddressList[k].Is_Default__c = false;
        }
        component.set('v.InvoiceAddressList',InvoiceAddressList);
        component.set('v.InvoiceAddressIndex',InvoiceAddressIndex);
    },
    /*convertPOToSalesOrder : function(component, event,helper) 
    {
        var BillAddIndex = component.get("v.BillAddressIndex");
        var	BillAdd = component.get("v.BillAddressList")[BillAddIndex];
        
        //alert('selected address: '+JSON.stringify(BillAdd));
        var custInfoid =component.get("v.CustomerInfoID");
        var ShipAddIndex = component.get("v.ShipAddressIndex");
        var ShipAdd = component.get("v.ShipAddressList")[ShipAddIndex];
        var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
        var BuyerAdd = component.get("v.BuyerAddressList")[BuyerAddressIndex];
        var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
        var InvoiceAdd = component.get("v.InvoiceAddressList")[InvoiceAddressIndex];
        //alert('BillAdd:'+JSON.stringify(BillAdd));
        var SO = component.get("v.salesOrderObj");
        var selecPO = component.get("v.comfirmPOList");
        //alert('selecPO:'+JSON.stringify(selecPO));
        var action = component.get("c.convertPOstoSo");
        action.setParams({ 
            "SO": SO,
            "slctRec": JSON.stringify(selecPO),
            //"custInfoid": custInfoid,
            "BillAddress": BillAdd,
            "shipAddress": ShipAdd,
            "buyerAddress": BuyerAdd,
            "invoiceAddress": InvoiceAdd,
            "suzhouFlag": component.get("v.suzhouFlag")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var res = response.getReturnValue();
                var sorecId = res.substring(res.indexOf('Id=')+3);
                    //console.log(sorecId);
                var splitArr = res.split("Id=");
                res = splitArr[0];
                //console.log('final result '+res);
                
          		if(res.includes("Quantity is updated to nearest Box Quantity value"))
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type" :"success",
                        "duration" : "20000ms",
                        "message": "The Order has been placed successfully and "+res
                    });
                    toastEvent.fire();
                    
                    component.set("v.AddressPopUpFlag", false);
                    $A.get('e.force:refreshView').fire(); 
                    
                    
                    this.sendOrderEmailWithAttachment(component, event, helper,sorecId);
                    return;
                }
                if (!res.includes("Success"))
                {
                    var spinner = component.find('spinner');
                    $A.util.toggleClass(spinner, "slds-hide");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "Warning",
                        message: res,
                        type: "warning"
                    });
                    toastEvent.fire();
                    
                    return;
                }
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "type" :"success",
                    "message": "The Order has been placed successfully."
                });
                toastEvent.fire();
                
                //to send email
                this.sendOrderEmailWithAttachment(component, event, helper,sorecId);
                
                component.set("v.AddressPopUpFlag", false);
                $A.get('e.force:refreshView').fire();  
            }
            else if (state === "ERROR") 
            {
                var errorRes = JSON.stringify(response.getError());
                alert('Error : ' + errorRes);
                var errorString = "An error occured, please contact your Administrator";
                if(errorRes.includes("INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST"))
                    errorString = "Selected currency is not supported by the system, Please choose any other currency";
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title: "Warning",
                    message: errorString,
                    type: "warning"
                });
                toastEvent.fire();
                return;
            } 
                else
                {
                    alert('Inside Error Callback');
                }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);
    },*/
    confirmSalesOrder : function(component, event, helper) {

        var BillAddIndex = component.get("v.BillAddressIndex");
        var	BillAdd = component.get("v.BillAddressList")[BillAddIndex];
        var custInfoid =component.get("v.CustomerInfoID");
        var ShipAddIndex = component.get("v.ShipAddressIndex");
        var ShipAdd = component.get("v.ShipAddressList")[ShipAddIndex];
        //var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
        //var BuyerAdd = component.get("v.BuyerAddressList")[BuyerAddressIndex];
        //var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
        //var InvoiceAdd = component.get("v.InvoiceAddressList")[InvoiceAddressIndex];
        var SO = component.get("v.salesOrderObj");
        //alert(JSON.stringify(SO));
        var action = component.get("c.SaveOrder");
        action.setParams({ 
            "SO": SO,
            "custInfoid": custInfoid,
            "BillAddress": BillAdd,
            "shipAddress": ShipAdd
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            var res = response.getReturnValue();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "type" :"success",
                    "message": "The Order has been placed successfully."
                });
                toastEvent.fire();
                $A.get('e.force:refreshView').fire();                
                //to send email
                //this.sendOrderEmailWithAttachment(component, event, helper,res);                
            }
            else if (state === "ERROR") {
                alert('Error : ' + JSON.stringify(response.getError()));
            } 
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);
    },

    confirmOpportunity: function (component, event, helper) {

        var SO = component.get("v.salesOrderObj");
        var custid = component.get("v.CustomerInfoID");
        
        var actionOpp = component.get("c.createOpportunityProducts");
        actionOpp.setParams({
            "custInfoid": custid,
            "SO": SO
        });
        actionOpp.setCallback(this, function (response) {
            var state = response.getState();
            //alert('state:' + state);
            var res = response.getReturnValue();
            if (state === "SUCCESS") {
                if (res) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type": "success",
                        "message": "Opportunity created successfully."
                    });
                    toastEvent.fire();
                    //$A.get('e.force:refreshView').fire();
                }                                
            }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(actionOpp);
    },

    conformQuote: function (component, event, helper) {

        var SO = component.get("v.salesOrderObj");
        var custid = component.get("v.CustomerInfoID");
        
        var actionOpp = component.get("c.createQuoteLineItems");
        actionOpp.setParams({
            "custInfoid": custid,
            "SO": SO
        });
        actionOpp.setCallback(this, function (response) {
            var state = response.getState();
            //alert('state:' + state);
            var res = response.getReturnValue();
            if (state === "SUCCESS") {
                if (res) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type": "success",
                        "message": "Quote created successfully."
                    });
                    toastEvent.fire();
                    //$A.get('e.force:refreshView').fire();
                }                                
            }
            var spinner = component.find('spinner');
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(actionOpp);
    },

    toGetDependentValues : function(component, controllingValue, controllingFields, dependentField) 
    {
        var actionCall = component.get("c.DependentPicklist");
        actionCall.setParams({
            "controllingValue":	controllingValue,
            "controllingFields": controllingFields,
            "dependentField": dependentField
        });
        actionCall.setCallback(this, function(response)
                               {
                                   var state = response.getState();
                                   if (state === "SUCCESS") 
                                   {
                                       //console.log('return value '+response.getReturnValue());
                                       if(dependentField=='Order_Country__c')
                                           component.set('v.companyList',response.getReturnValue());
                                       else if(dependentField=='Preferred_Currency__c')
                                           component.set('v.currencyList',response.getReturnValue());
                                           else if(dependentField=='Delivery_Instruction__c')
                                               component.set('v.shipTermList',response.getReturnValue());
                                   }
                                   else if (state === "ERROR") 
                                   {
                                       alert('Error : ' + JSON.stringify(response.getError()));
                                   } 
                               });
        $A.enqueueAction(actionCall);
    },
    PDFForCatalog : function(component, event,helper) {
        var spinner = component.find('spinner');
		$A.util.toggleClass(spinner, "slds-hide");
        
        var BillAddIndex = component.get("v.BillAddressIndex");
        var	BillAdd = component.get("v.BillAddressList")[BillAddIndex];
        var custInfoid =component.get("v.CustomerInfoID");
        var ShipAddIndex = component.get("v.ShipAddressIndex");
        var ShipAdd = component.get("v.ShipAddressList")[ShipAddIndex];
        var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
        var BuyerAdd = component.get("v.BuyerAddressList")[BuyerAddressIndex];
        var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
        var InvoiceAdd = component.get("v.InvoiceAddressList")[InvoiceAddressIndex];

        var SO = component.get("v.salesOrderObj");
        var  mydate = new Date(SO.Expected_Delivery_Date__c);
        
        /*if(SO.Division__c=='NULL')
            SO.Division__c = '';
        if(SO.Season__c=='NULL')
            SO.Season__c = '';
        if(SO.Season_Year__c=='NULL')
            SO.Season_Year__c = '';*/
        if(SO.Delivery_Instructions__c=='NULL')
            SO.Delivery_Instructions__c = '';
        
        //alert(JSON.stringify(SO));
        var action = component.get("c.updateSalesOrderForPDF");
        action.setParams({ 
            "SO": SO,
            "custInfoid": custInfoid,
            "BillAddress": BillAdd,
            "shipAddress": ShipAdd
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {

                //making another apex call to save pdf as attachment
                var actionNo2 = component.get("c.saveCatalogSOPDF");
                actionNo2.setParams({ 
                    "SOid": response.getReturnValue(),
                });
                actionNo2.setCallback(this, function(responseNo2){
                    var state = responseNo2.getState();
                    if (state === "SUCCESS") {
                        var urlString = window.location.href;
                        //alert("urlString1:" + urlString);
                        //var CommunityBaseURL = urlString.substring(0, urlString.indexOf("/s/"));
                        //urlString = CommunityBaseURL+"/apex/SOConfirmationPDF"+"?DefaultBillToID="+BillAdd.Id+"&DefaultShippToID="+ShipAdd.Id;
                        //alert("urlString2:" + urlString);
                        //var win = window.open(urlString, '_blank');
                        var win = window.open('/apex/SOConfirmationPDF?Id=' + response.getReturnValue());
                    }
                    else if (state === "ERROR") 
                    {                        
                        alert('Error : ' + JSON.stringify(response.getError()));
                    }
                    var spinner = component.find('spinner');
					$A.util.toggleClass(spinner, "slds-hide");
                });
                $A.enqueueAction(actionNo2);
                
                
            }
            else if (state === "ERROR") 
            {
                alert('Error : ' + JSON.stringify(response.getError()));
            } 
        });
        $A.enqueueAction(action);
        
    },
    /*PDFForStagePO : function(component, event,helper,POIdList) 
    {
        var SO = component.get("v.salesOrderObj");
        
        var OrderToCompany = SO.Company__c;
        var PreferredCurrency = SO.CurrencyIsoCode;
        
        if(SO.Delivery_Instructions__c=='NULL')
            SO.Delivery_Instructions__c = '';
        var ShipmentTerms = SO.Delivery_Instructions__c;
        
        var BillAddIndex = component.get("v.BillAddressIndex");
        var BillAdd = component.get("v.BillAddressList")[BillAddIndex];
        //alert('BillAdd>>>>'+BillAdd.Id);
        var DefaultBillToID = BillAdd.Id;
        
        var ShipAddIndex = component.get("v.ShipAddressIndex");
        var ShipAdd = component.get("v.ShipAddressList")[ShipAddIndex];
        //alert('ShipAdd>>>>'+ShipAdd.Id);
        var DefaultShippToID = ShipAdd.Id;
        var suzhouFlag = component.get("v.suzhouFlag");
        
        var DefaultBuyerToID;
        var DefaultInvoiceToID;
        //alert('suzhouFlag>>>>'+suzhouFlag);
        if(suzhouFlag)
        {
            //alert('Inside suzhouFlag true>>>>'+suzhouFlag);
            var BuyerAddressIndex = component.get("v.BuyerAddressIndex");
            var BuyerAdd = component.get("v.BuyerAddressList")[BuyerAddressIndex];
            //alert('BuyerAdd>>>>'+BuyerAdd.Id);
            DefaultBuyerToID = BuyerAdd.Id;
            
            var InvoiceAddressIndex = component.get("v.InvoiceAddressIndex");
            var InvoiceAdd = component.get("v.InvoiceAddressList")[InvoiceAddressIndex];
            //alert('InvoiceAdd>>>>'+InvoiceAdd.Id);
            DefaultInvoiceToID = InvoiceAdd.Id;
            
            
        }else
        {
            DefaultBuyerToID ='DefaultBuyerToID';
            DefaultInvoiceToID = 'DefaultInvoiceToID';
        }
        
        if(!SO.Expected_Delivery_Date__c)
        {
            SO.Expected_Delivery_Date__c = null;
        }
        
        var urlString = window.location.href;
        var CommunityBaseURL = urlString.substring(0, urlString.indexOf("/s/"));
        //alert('CommunityBaseURL>>>>'+CommunityBaseURL);
        urlString = CommunityBaseURL+'/apex/POConfirmationPDF'+'?Id='+POIdList;
        urlString +='&OrderToCompany='+OrderToCompany+'&PreferredCurrency='+PreferredCurrency+'&ShipmentTerms='+ShipmentTerms;
        urlString +='&suzhouFlag='+suzhouFlag;
        urlString +='&DefaultBillToID='+DefaultBillToID+'&DefaultShippToID='+DefaultShippToID;
        if(suzhouFlag)
            urlString +='&DefaultInvID='+DefaultInvoiceToID+'&DefaultBuyerID='+DefaultBuyerToID;
        urlString +='&expectedDeliveryDate='+SO.Expected_Delivery_Date__c;
        if(SO.Division__c=='NULL')
            SO.Division__c = '';
        if(SO.Season__c=='NULL')
            SO.Season__c = '';
        if(SO.Season_Year__c=='NULL')
            SO.Season_Year__c = '';
        if(!SO.Factory_Internal_PO__c)
            SO.Factory_Internal_PO__c = '';
        
        urlString +='&div='+SO.Division__c+'&seaS='+SO.Season__c+'&seaY='+SO.Season_Year__c;
        urlString +='&finternalPO='+SO.Factory_Internal_PO__c;
        //alert(SO.Transportation_Details__c);
        //alert(SO.Transportation_Details__c.replace(new RegExp('\n', 'g'), '_space'));
        if(SO.Transportation_Details__c && SO.Transportation_Details__c.includes('\n'))
            SO.Transportation_Details__c = SO.Transportation_Details__c.replace(new RegExp('\n', 'g'), '_space');
        if(SO.Transportation_Details__c)
            urlString +='&forw='+SO.Transportation_Details__c;
        else
            urlString +='&forw='+'';
        if(SO.Shipping_Mark__c && SO.Shipping_Mark__c.includes('\n'))
            SO.Shipping_Mark__c = SO.Shipping_Mark__c.replace(new RegExp('\n', 'g'), '_space');
        if(SO.Shipping_Mark__c)
            urlString +='&ship='+SO.Shipping_Mark__c;
        else
            urlString +='&ship='+'';
        //urlString +='&forw='+SO.Transportation_Details__c+'&ship='+SO.Shipping_Mark__c;
        //alert('urlString>>>>'+urlString);
        var win = window.open(urlString, '_blank');
    },*/
    
    cancelOrderChanges : function(component, event,helper) 
    {
        var SO = component.get("v.salesOrderObj");
        //alert("SO:" + SO);
        var action = component.get("c.toCancelOrder");
        action.setParams({ 
            "dOrder": SO,
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                //alert("Successfully saved");
            }
        });
        $A.enqueueAction(action);
    },
    sendOrderEmailWithAttachment : function(component, event,helper,SOID) 
    {
        
        var action = component.get("c.sendSOEmailToCustomer");
        action.setParams({ 
            "SOID": SOID,
        });
        action.setCallback(this, function(response){
            var state = response.getState();

            if (state === "SUCCESS") 
            {
                //alert("Successfully sent");
            }
        });
        $A.enqueueAction(action);
    },
    /*cancelPOnPOLIChanges : function(component, event,helper) {
        var selecPO = component.get("v.comfirmPOList");

            var action = component.get("c.cancelPOChanges");
            action.setParams({ 
                "POString": JSON.stringify(selecPO),
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                
                if (state === "SUCCESS") {
                    //alert("Successfully updated");
                }
                else if (state === "ERROR") {
                    alert('Error : ' + JSON.stringify(response.getError()));
                }
            });
            $A.enqueueAction(action);
        
    },*/
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
})