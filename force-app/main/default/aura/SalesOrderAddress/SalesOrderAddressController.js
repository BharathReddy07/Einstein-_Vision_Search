({
    doInit : function(component, event,helper) 
    {
        helper.toGetCustomerAddess(component, event,helper);
        //alert('order Source '+component.get("v.OrderSource"));
        /*if(component.get("v.OrderSource")=="PO")
        {
            var confirmPO = component.get("v.comfirmPOList");
            var po = component.get("v.comfirmPOList[0].POwrap");
            //alert('po '+JSON.stringify(v.comfirmPOList[0].POwrap));
            component.set("v.salesOrderObj.Retailer_Code1__c",po.Retailer_Code1__c);
            var responseList = helper.toGetDependentValues(component,po.Retailer_Code1__r.Name,'Retailer_Code_Hidden__c','Order_Country__c');
            component.set('v.retailerName',po.Retailer_Code1__r.Name);
            component.set('v.companyList',responseList);
            var retailerPOnumber = '';
            for(var i=0;i<confirmPO.length;i++)
            {
                if(i != 0)
                {
                    retailerPOnumber += ',';
                }
                retailerPOnumber += confirmPO[i].POwrap.Order_Number__c;
            }
            component.set("v.salesOrderObj.Order_Number__c",retailerPOnumber);
        }*/
        var today = new Date();
        //today.setDate(today.getDate() + 1);
        var formattedDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
        component.set("v.salesOrderObj.Expected_Delivery_Date__c",formattedDate);
        
    },

    opportunity: function (component, event, helper) {

        var SO = component.get("v.salesOrderObj");
        var custid = component.get("v.CustomerInfoID");
        
        var actionOpp = component.get("c.createOpportunityProducts");
        actionOpp.setParams({
            "custInfoid": custid,
            "SO": SO
        });
        actionOpp.setCallback(this, function (response) {
            var state = response.getState();
            alert('state:' + state);                      
        });
        $A.enqueueAction(actionOpp);
    },

    changeAddress : function(component, event,helper) 
    {
        //var recordByEvent = event.getParam("recordByEvent");
        var objectAPIName = event.getParam("objectAPIName");
        var index = parseInt(objectAPIName);
        //alert('index Inside SalesOrderAddressComp>>'+index);
        
        var context = event.getParam("context");
        if(context === "Bill")
        {
            //alert('Inside context is Bill');
            var BillAddressList = component.get("v.BillAddressList");
            component.set("v.BillAddressIndex",index);
            for(var i=0; i<BillAddressList.length; i++)
            {
                if(index!=i)
                    BillAddressList[i].Is_Default__c = false;
            }
            component.set('v.BillAddressList',BillAddressList);
            
            //below code is to make sure either bill to or bill to locked is selected
            //#BillTolocked seperate section is not required
            /*var BillLockedAddressList = component.get("v.BillLockedAddressList");
            for(var i=0; i<BillLockedAddressList.length; i++)
            {
                BillLockedAddressList[i].Is_Default__c = false;
            }
            component.set('v.BillLockedAddressList',BillLockedAddressList);
        }
        if(context === "BillLocked")
        {
            //alert('Inside context is Bill to locked');
            var BillLockedAddressList = component.get("v.BillLockedAddressList");
            component.set("v.BillLockedAddressList",index);
            for(var i=0; i<BillLockedAddressList.length; i++)
            {
                if(index!=i)
                    BillLockedAddressList[i].Is_Default__c = false;
            }
            component.set('v.BillLockedAddressList',BillLockedAddressList);
            
            //below code is to make sure either bill to or bill to locked is selected
            var BillAddressList = component.get("v.BillAddressList");
            for(var i=0; i<BillAddressList.length; i++)
            {
                BillAddressList[i].Is_Default__c = false;
            }
            component.set('v.BillAddressList',BillAddressList);*/
        }
        else if(context === "Ship")
        {
            var ShipAddressList = component.get("v.ShipAddressList");
            component.set("v.ShipAddressIndex",index);
            for(var i=0; i<ShipAddressList.length; i++)
            {
                if(index!=i)
                    ShipAddressList[i].Is_Default__c = false;
            }
            component.set('v.ShipAddressList',ShipAddressList);
        }
        if(context === "Buyer")
        {
            var BuyerAddressList = component.get("v.BuyerAddressList");
            for(var i=0; i<BuyerAddressList.length; i++)
            {
                if(index!=i)
                    BuyerAddressList[i].Is_Default__c = false;
            }
            component.set('v.BuyerAddressList',BuyerAddressList);
        }
        else if(context === "Invoice")
        {
            var InvoiceAddressList = component.get("v.InvoiceAddressList");
            for(var i=0; i<InvoiceAddressList.length; i++)
            {
                if(index!=i)
                    InvoiceAddressList[i].Is_Default__c = false;
            }
            component.set('v.InvoiceAddressList',InvoiceAddressList);
        }
    },
    closeModal : function(component, event,helper) 
    {
        
        /*if(component.get("v.OrderSource")=="PO")
        {
            helper.cancelPOnPOLIChanges(component, event,helper);
        }
        else
        {
            helper.cancelOrderChanges(component, event,helper);
        }*/
        //component.set("v.cartcmp", true);
        //$A.get('e.force:refreshView').fire();  
        helper.cancelOrderChanges(component, event,helper);
        component.set("v.AddressPopUpFlag", false);
    },
    
    ConfirmOrder : function(component,event,helper) {
        //--Validation for SO Default Address Selection Starts here----- 
        var billAddressList = component.get('v.BillAddressList');
        var checkDefaultBillAddress = false;
        for (var i = 0; i < billAddressList.length; i++) {
            //alert('Inside billAddressList Iteration>>>');
            if (billAddressList[i].Is_Default__c) {
                checkDefaultBillAddress = true;
            }
        }
        if (!checkDefaultBillAddress) {
            var message = "Select atleast one default billing Address.";
            helper.errorToast(component, event, helper, message);
            return;
        }

        var ShipAddressList = component.get('v.ShipAddressList');
        var checkDefaultShippAddress = false;
        for (var i = 0; i < ShipAddressList.length; i++) {
            //alert('Inside billAddressList Iteration>>>');
            if (ShipAddressList[i].Is_Default__c) {
                checkDefaultShippAddress = true;
            }
        }
        if (!checkDefaultShippAddress) {
            var message = "Please select atleast one default shipping Address.";
            helper.errorToast(component, event, helper, message);
            return;
        }
        //---Validation for PO to SO Address Selection ends here-----
        var SO = component.get("v.salesOrderObj");
        if (SO.Company__c == null) {
            var message = "Please select Order To Company.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        if (SO.Currency__c == null) {
            var message = "Please select Preferred Currency.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        if (!SO.Expected_Delivery_Date__c || SO.Expected_Delivery_Date__c == null) {
            var message = "Expected delivery date is mandatory.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        if (SO.Delivery_Instruction__c == null || SO.Delivery_Instruction__c == '') {
            var message = "Please select Delivery Instruction.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        //new date validation to be later thAn today
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var presentDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
        console.log("SO.Expected_Delivery_Date__c:" + SO.Expected_Delivery_Date__c);
        console.log("presentDate:" + presentDate);
        if (SO.Expected_Delivery_Date__c < presentDate) {
            var message = "Expected Delivery date must be later than today.";
            helper.warningToast(component, event, helper, message);
            event.preventDefault();
            return;
        }
        helper.confirmSalesOrder(component, event, helper);

        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-hide");
    },

    createOpportunity : function(component,event,helper) {
        
        var SO = component.get("v.salesOrderObj");
        if (!SO.Expected_Delivery_Date__c || SO.Expected_Delivery_Date__c == null) {
            var message = "Date is mandatory.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        //new date validation to be later thAn today
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var presentDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
        console.log("SO.Expected_Delivery_Date__c:" + SO.Expected_Delivery_Date__c);
        console.log("presentDate:" + presentDate);
        if (SO.Expected_Delivery_Date__c < presentDate) {
            var message = "Date must be later than today.";
            helper.warningToast(component, event, helper, message);
            event.preventDefault();
            return;
        }
        helper.confirmOpportunity(component, event, helper);

        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-hide");

    },

    createQuote : function(component,event,helper) {
        
        var SO = component.get("v.salesOrderObj");
        if (!SO.Expected_Delivery_Date__c || SO.Expected_Delivery_Date__c == null) {
            var message = "Date is mandatory.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        //new date validation to be later thAn today
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var presentDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
        console.log("SO.Expected_Delivery_Date__c:" + SO.Expected_Delivery_Date__c);
        console.log("presentDate:" + presentDate);
        if (SO.Expected_Delivery_Date__c < presentDate) {
            var message = "Date must be later than today.";
            helper.warningToast(component, event, helper, message);
            event.preventDefault();
            return;
        }
        helper.conformQuote(component, event, helper);

        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-hide");

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
            type: "error"
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

    changeDate:function(component, event, helper){
        //alert('changeDate');
        var GivenDate = component.get('v.salesOrderObj.Expected_Delivery_Date__c');
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var presentDate = $A.localizationService.formatDate(today, "yyyy-MM-dd");
        if(GivenDate<presentDate)
        {
            //component.set("v.salesOrderObj.Expected_Delivery_Date__c",presentDate);
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type":"warning",
                "title": "Warning!",
                "message": "Expected Ex-Factory Date must be later than today."
            });
            toastEvent.fire();
            event.preventDefault();
            return;
        }
        if(GivenDate!=undefined)
        {
            //alert('undefined');
            component.find('ExpectedDeliveryDate').showHelpMessageIfInvalid();
            return;
        }
    },
    OrderToCompany:function(component, event, helper)
    {
        var compName = event.getSource().get("v.value");
        helper.toGetDependentValues(component,compName,'Order_Country__c','Preferred_Currency__c');
        var SO = component.get("v.salesOrderObj");
        SO.CurrencyIsoCode='NULL';
        component.set("v.salesOrderObj",SO);
        var compName = event.getSource().get("v.value");
        //helper.toGetDependentValues(component,compName,'Order_Country__c','Export_Term__c');
        helper.toGetDependentValues(component,compName,'Order_Country__c','Delivery_Instruction__c');
        //alert('comp in catalog '+compName);
        if(compName.includes("Suzhou"))
        {
            component.set("v.suzhouFlag",true);
            if(component.get("v.BuyerAddressList").length==0)
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
            if(component.get("v.InvoiceAddressList").length==0)
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
        else
        {
            component.set("v.suzhouFlag",false);
        }
    },
    toGetCurrency:function(component, event, helper)
    {
        var compName = event.getSource().get("v.value");
        helper.toGetDependentValues(component,compName,'Order_Country__c','Preferred_Currency__c');
    },
    openPDF:function(component, event, helper)
    {
        var SO = component.get("v.salesOrderObj");
        //alert('Template:' + SO.Template__c);
        if (SO.Template__c == null || SO.Template__c == '' || SO.Template__c == 'NULL') {
            var message = "Please select Template.";
            helper.warningToast(component, event, helper, message);
            return;
        }

        var billAddressList = component.get('v.BillAddressList');
        var checkDefaultBillAddress = false;
        for(var i = 0 ; i<billAddressList.length ; i++) {
            //alert('Inside billAddressList Iteration>>>');
            if(billAddressList[i].Is_Default__c) {
                checkDefaultBillAddress = true;
            }
        }
        if(!checkDefaultBillAddress) {
            var message = "Select atleast one default billing Address.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        
        var ShipAddressList = component.get('v.ShipAddressList');
        var checkDefaultShippAddress = false;
        for(var i = 0 ; i<ShipAddressList.length ; i++) {
            //alert('Inside billAddressList Iteration>>>');
            if(ShipAddressList[i].Is_Default__c) {
                checkDefaultShippAddress = true;
            }            
        }
        if(!checkDefaultShippAddress) {
            var message = "Please select atleast one default shipping Address.";
            helper.warningToast(component, event, helper, message);
            return;
        }
        
        var SO = component.get("v.salesOrderObj");
        //alert('SO.Company__c>>>>'+SO.Company__c);
        var OrderToCompany = SO.Company__c;
        var PreferredCurrency = SO.Currency__c	;
        var ShipmentTerms = SO.Delivery_Instructions__c;
        var DefaultBillToID;
        var DefaultShippToID;
        //var DefaultBuyerToID;
        //var DefaultInvoiceToID;
          
        helper.PDFForCatalog(component, event,helper);        
    },
})