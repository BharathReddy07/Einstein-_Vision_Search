({
    GetcustomInfoidNew: function (component, event, helper) {
        
        var action = component.get("c.getUserId");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               // alert("Respone:" + response.getReturnValue());
               // var id = response.getReturnValue();
                //alert('id :'+id);
                component.set('v.onselectcustomeid', response.getReturnValue());
                   component.set('v.displayVertical', true);
                  component.rerenderCartCount();
                 }
             });
        $A.enqueueAction(action);
         },
   
        productListNew: function(component, event,helper){

        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.listProducts");
        var pageSize = component.get("v.pageSize").toString();
        var pageNumber = component.get("v.pageNumber").toString();
        
         action.setParams({
            'pageSize' : pageSize,
            'pageNumber' : pageNumber
        });
       
        action.setCallback(this, function(response) {
             // hide spinner when response coming from server 
             component.find("Id_spinner").set("v.class" , 'slds-hide');
             var state = response.getState();
             if (state === "SUCCESS") {
                var res = response.getReturnValue();
                 if(res.length < component.get("v.pageSize")){
                    component.set("v.isLastPage", true);
                } else{
                    component.set("v.isLastPage", false);
                }
                component.set("v.dataSize", res.length);
                component.set('v.completeWrap', res);
                  //alert(res);
                component.set('v.catalogVertical', true);
             }                 
        });
        $A.enqueueAction(action);
    },

   /* productSearchNew: function(component, event,helper){

        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.searchProducts");
       // var ser = component.get("v.searchKeyword");
       // alert('getInputkeyWord :'+getInputkeyWord);
        
        
        action.setParams({
            'SearchKeyword': getInputkeyWord

        });
        action.setCallback(this, function(response) {
             // hide spinner when response coming from server 
             component.find("Id_spinner").set("v.class" , 'slds-hide');
             var state = response.getState();
             if (state === "SUCCESS") {
                var res = response.getReturnValue();
                // alert('res :'+res);
               
                  component.set('v.listOfSearchRecords', res);
                  component.set('v.completeWrap', res);
                component.set('v.catalogVertical', true);
                 
                                 
                

                //component.set("v.isSearch",true);
             }                 
        });
        $A.enqueueAction(action);
    },*/
     productSearchNew: function(component, event,helper){
         var key = component.get("v.searchKeyword");
        //alert('key :'+key);
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.searchProducts");
        action.setParams({
            'SearchKeyword': component.get("v.searchKeyword")

        });
        action.setCallback(this, function(response) {
             // hide spinner when response coming from server 
             component.find("Id_spinner").set("v.class" , 'slds-hide');
             var state = response.getState();
             if (state === "SUCCESS") {
                var res = response.getReturnValue();
                component.set('v.completeWrap', res);
                // alert('res :'+  res);
                component.set('v.catalogVertical', true);
                //component.set("v.isSearch",true);
             }                 
        });
        $A.enqueueAction(action);
    },
    getCartCount: function(component, event,helper){
        var action = component.get('c.getCartDataCount');
        action.setParams({ 
            "customerid": component.get('v.onselectcustomeid')
        });
        action.setCallback(this, function(actionResult) {
            var status=actionResult.getState();
            if(status==="SUCCESS")
            {
                var response = actionResult.getReturnValue();
                //alert("response:" + response);
                component.set('v.CartCount',response);
            }
        });
        $A.enqueueAction(action);
    },

    productSearch: function(component, event,helper) //revoked onClick of the search button
    {
       /*if((component.get("v.selectedCurrency") =='NULL') || (component.get("v.selectedCurrency") ==''))
        {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "warning",
                message: 'Select the Preferred Currency',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }*/
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.searchProducts");
        action.setParams({
            'SearchKeyword': component.get("v.searchKeyword"),
            'selectedFamily': component.get("v.selectedFamily"),
            'selectedTab': component.get("v.selectedTab"),
            'retailerCode': component.get("v.SelectedRetailercode"),
            'offsetValue': component.get("v.RecordStart"),
            'orderToCompany': component.get("v.selectedCompany"),
            'preCurrency': component.get("v.selectedCurrency"),
            'pageNumber' : component.get("v.page")
        });
        action.setCallback(this, function(response) {
            // hide spinner when response coming from server 
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                
                var res = response.getReturnValue();
                for(var i=0;i< res.productList.length;i++)
                {
                    var tempList=[];
                    for(var key in res.productList[i].ProductDataMap){
                        tempList.push({value:res.productList[i].ProductDataMap[key], key:key,quantity:res.productList[i].ProductDataMap[key].quantity});
                    }
                    res.productList[i].tempMap=tempList;
                }
                //alert('res>>>'+JSON.stringify(res.productFamilyList));
                component.set('v.completeWrap', res);
                //component.set("v.TotalPages", Math.ceil(res.totalRecords / 12)); 
                //component.set('v.RecordStart', 0);
                //component.set('v.RecordEnd', 12);
                //component.set('v.PageNumber', 1);
                //component.set('v.selectedTab',res.tabOverride);
                //component.set('v.TotalRecords', res.totalRecords);
                component.set('v.total', res.totalRecords);
                component.set('v.page',	res.pageNumber);
                component.set('v.pages', Math.ceil(res.totalRecords/res.pageSize));
                component.set('v.listOfCurrency', res.PcurrList);
                if(res.productFamilyList.length!=0)
                	component.set('v.fieldList', res.productFamilyList);
                else
                {
                    component.set('v.selectedFamily','NULL');
                    var temp = [];
                    component.set('v.fieldList',temp);
                }
                
                component.set('v.selectedCompany', res.Ocomp);
                component.set('v.selectedCurrency', res.Pcurr);
                component.set('v.catalogVertical', true);
                component.set('v.sizerhanger', false);
                component.set('v.displayPagination', true);
                //console.log('curerncy'+component.get("v.selectedCurrency"));
                //console.log('selectedCompany'+component.get("v.selectedCompany"));
                //console.log('helper productSearch success'+JSON.stringify(component.set('v.completeWrap')));
                component.set("v.isSearch",true);  
            }
            else if (state === "ERROR") {
                alert('Error : ' + JSON.stringify(response.getError()));
            } 
        });
        $A.enqueueAction(action);
        console.log('helper productSearch');
    },
    toGetTabData : function(component, event,helper,tabId)	//revoked onload of catalog order or on selecting another tab
    {
       //alert('toGetTabData>>'+tabId);
        var page = component.get("v.page");
        var action = component.get("c.searchProducts");
        action.setParams({
            'selectedTab': tabId,
            'retailerCode': component.get("v.SelectedRetailercode"),
            'offsetValue': component.get("v.OffsetValue"),
            'orderToCompany': component.get("v.selectedCompany"),
            'preCurrency': component.get("v.selectedCurrency"),
            'pageNumber' : page
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            { 
                var res = response.getReturnValue();
                //alert('res>>>>'+JSON.stringify(response.getReturnValue()));
                for(var i=0;i< res.productList.length;i++){
                    var tempList=[];
                   //alert(response.getReturnValue().productList[i].Name+'-->'+JSON.stringify(response.getReturnValue().productList[i].ProductDataMap))
                    for(var key in res.productList[i].ProductDataMap){
                        tempList.push({value:res.productList[i].ProductDataMap[key], key:key,quantity:res.productList[i].ProductDataMap[key].quantity});
                    }
                    res.productList[i].tempMap=tempList;
                }
                component.set('v.total', res.totalRecords);
                component.set('v.page',	res.pageNumber);
                component.set('v.pages', Math.ceil(res.totalRecords/res.pageSize));
                component.set('v.completeWrap', res);
                component.set('v.listOfCurrency', res.PcurrList);
                component.set('v.selectedCompany', res.Ocomp);
                component.set('v.TotalRecords', res.totalRecords);
                console.log('2 No of family options :'+res.productFamilyList.length);
               if(res.productFamilyList.length!=0)
                	component.set('v.fieldList', res.productFamilyList);
                else
                {
                    component.set('v.selectedFamily','NULL');
                    var temp = [];
                    component.set('v.fieldList',temp);
                }
                var listofcomp = component.get('v.listOfCompanies');
                var selectedcom = component.get('v.selectedCompany');
                for(var i =0 ; i<listofcomp.length;i++)
                {
                     //alert('listcurr>>'+JSON.stringify(listofcomp[i])+' selectedcom>> '+selectedcom);
                    if(selectedcom.localeCompare(listofcomp[i])==0)		// if doesent contains 
                    {
                        component.set('v.selectedCurrency', res.Pcurr);
                    }
                }
              component.set("v.showSpinner",false);  
            }
            else if (state === "ERROR") {
                alert('Error : ' + JSON.stringify(response.getError()));
                component.set("v.showSpinner",false);  
            }
        });
        $A.enqueueAction(action);
    },
    /*ProductfamilyList:function(component, event, helper) {
        var action = component.get("c.getPicklistValues");
        action.setParams({
            "retailerCode": component.get("v.SelectedRetailercode"),
            "vertical":  component.get("v.selectedTab")
        });
        action.setCallback(this, function(response) {
            //alert('ProductfamilyList '+JSON.stringify(response.getReturnValue()));
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                //component.set("v.fieldList", allValues);
            }    
        });
        $A.enqueueAction(action);        
    },*/
    pickListVal:function(component, controllingValue, controllingFields, dependentField) 
    {
        //alert('controllingValue:'+controllingValue+' controllingFields:'+controllingFields+' dependentField:'+dependentField);
        var actionCall = component.get("c.getDependentPicklistValues");
        actionCall.setParams({
            "controllingValue":	controllingValue,
            "controllingFields": controllingFields,
            "dependentField": dependentField
        });
        actionCall.setCallback(this, function(response)
        {
            var state = response.getState();
            //alert(response.getReturnValue());
            if (state === "SUCCESS") 
            {
                if(dependentField=='Order_Country__c')
                {
                    component.set('v.listOfCompanies',response.getReturnValue());
                }
                else if(dependentField=='Preferred_Currency__c')
                    component.set('v.listOfCurrency',response.getReturnValue());
                
                //alert('listOfCompanies>>'+JSON.stringify(component.get('v.listOfCompanies')));
                 //alert('listOfCurrency>>'+JSON.stringify(component.get('v.listOfCurrency')));
            }
            else if (state === "ERROR") 
            {
                alert('Error : ' + JSON.stringify(response.getError()));
            } 
        });
        $A.enqueueAction(actionCall);       
    },
    GetcustomInfoid: function(component, event,helper) {
        var action = component.get("c.getcostomerinfo");
        action.setParams({
            "retailerCode":	component.get("v.SelectedRetailercode"),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.onselectcustomeid', response.getReturnValue().Customer_Information__c);
            }else if (state === "INCOMPLETE") {
               // alert('Response is Incompleted');
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        alert("Error message: " + 
                              errors[0].message);
                    }
                    
                } else {
                    alert("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    toCheckSORetailer: function(component, event,helper,selectedId) 
    {
        var action = component.get('c.checkRetailerInSO');
        action.setParams({ 
            "customerid": component.get('v.onselectcustomeid')
        });
        action.setCallback(this, function(actionResult) {
            var status=actionResult.getState();
            if(status==="SUCCESS")
            {
                var response = actionResult.getReturnValue();
                
                if(response)
                {
                    component.set("v.vertical",response.Vertical__c);
                    var verticalVal =response.Vertical__c;
                    if(!verticalVal || verticalVal==null)
                        verticalVal = 'Hanger Business';
                    if(selectedId == verticalVal)
                    {
                        this.toGetTabData(component, event, helper,selectedId);
                    }
                    else
                    {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title: "warning",
                            message: 'Not Allowed to change tabs when cart is not empty !',
                            type: "warning"
                        });
                        toastEvent.fire();
                        component.set('v.selectedTab',verticalVal);
                    }
                }
                else{
                    this.toGetTabData(component, event, helper,selectedId);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    visionApiSearch: function(component, event,helper,dataURL,fileCount){
        //console.log('dataURL:'+dataURL);
        console.log('fileCount:'+fileCount); 
        var action=component.get("c.predictInternal");
        action.setParams({
            sample: dataURL
            
        });            
        action.setCallback(this,function(response){
            var state=response.getState();
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            //alert(state); 
            if(state === 'SUCCESS'){         
                var keyWordList = component.get("v.keyWordList");
                console.log('response:'+response.getReturnValue().label[0]); 
                keyWordList.push(response.getReturnValue().label[0]);
                component.set("v.keyWordList",keyWordList);
                if(keyWordList.length == fileCount){
                    console.log('keyWordList:'+keyWordList);
                    
                    //SearchKeyword ='%'+searchKeyWord +'%';                    
                    var query = '';
                    for(var j=0; j<keyWordList.length; j++ ){
                        if(j != 0){
                            query += ' OR  Description LIKE \'%' + keyWordList[j] + '%\'';
                        } else {
                            query +=  keyWordList[j] + '%\'';
                        }
                    }
                    query = query.substring(0,query.lastIndexOf('%'));
                    console.log('query:'+query);
                    component.set("v.searchKeyword",query);
                    helper.productSearchNew(component, event, helper);
                    //document.getElementById("search1").click();                    
                }                                               
                //component.set("v.searchKeyword",response.getReturnValue().label[0]);                        
                //document.getElementById("search1").click();                        
            }
        });
        $A.enqueueAction(action);
    },
    
  /*  callFileReader: function(component, event,helper,file){
        var reader = new FileReader();
            console.log('before onload :');
            reader.onload =  function() {
                var dataURL = reader.result;
                var base64 = 'base64,';
                var dataStart = dataURL.indexOf(base64) + base64.length;
                console.log('Inside onload :');
                dataURL= dataURL.substring(dataStart); 
                helper.visionApiSearch(component, event,helper,dataURL);
            };  
            //console.log('i:'+i);
            reader.readAsDataURL(file);
    },*/
    
    getData: function(component,event,helper,file) {
        console.log('inside getData');
        return new Promise(
            $A.getCallback((resolve, reject) => {
                // your logic goes here
                var reader = new FileReader();
                
                reader.onload = () => {
                var dataURL = reader.result;
                var base64 = 'base64,';
                var dataStart = dataURL.indexOf(base64) + base64.length;
                console.log('Inside onload :');
                dataURL= dataURL.substring(dataStart);                
                resolve(dataURL);
            };                           
             reader.onerror = reject;                           
             reader.readAsDataURL(file);
            })
        );
    }
   
})