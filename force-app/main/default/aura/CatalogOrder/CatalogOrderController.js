({ 
    vision: function(cmp, evt, helper) {
        
        cmp.set("v.isVisionPopup",true);
        
    },
    closeModel: function(cmp, evt, helper) {
        
        cmp.set("v.isVisionPopup",false);
    },
    readFile: function (component, event, helper) {
        
        var files = component.get("v.files");        
        if (files && files.length > 0 && files[0] && files[0][0]) {
            var file = files[0][0];
            if (file.size > 5000000) {
                return alert("The file exceeds the limit of 5MB.");
            }
            var reader = new FileReader();
            reader.onloadend = function () {
                var dataURL = reader.result;
                component.set("v.imageURL", null);
                component.set("v.pictureSrc", dataURL);  
                // FileReader.readAsDataURL()
                
                //component.set("v.Label", a);
                // alert(str);
                //helper.upload(component);
                var ret = dataURL.replace('data:image/png;base64,','');
                //console.log(ret); 
                component.set("v.Label1",dataURL);
                //alert(component.get("v.Label1"));
                component.find("Id_spinner").set("v.class" , 'slds-show');
                var action=component.get("c.predictInternal");
                action.setParams({
                    sample: ret
                    
                });
                
                action.setCallback(this,function(response){
                    var state=response.getState();
                    component.find("Id_spinner").set("v.class" , 'slds-hide');
                    alert(state);
                    console.log('status:'+  status);
                    if(state==='SUCCESS'){
                        
                        
                        console.log(response.getReturnValue());
                        alert(' label Name :'+response.getReturnValue().label[0]);
                        
                        component.set("v.searchKeyword",response.getReturnValue().label[0]);
                        document.getElementById("search1").click();
                    }
                });
                $A.enqueueAction(action);
                
                
            };
            reader.readAsDataURL(file);
            component.set("v.isVisionPopup",false);
            //alert(reader.readAsDataURL(file));
            
        }
        
    },
    init: function(cmp, evt, helper) {
        var myPageRef = cmp.get("v.pageReference");
        var firstname = myPageRef.state.c__productname;
        if(firstname){
            cmp.set("v.firstname", firstname);
            cmp.set("v.searchKeyword",firstname);
            window.setTimeout(
                $A.getCallback(function() {
                    
                    document.getElementById("search1").click();  
                }), 4000
            );  
            // document.getElementById("search1").click();  
        }
        
        let currentUser = $A.get("$SObjectType.CurrentUser.Email");
        //var  currentUser="selvapmk5@gmail.com";
        // alert('selva'+currentUser);
        var url1=cmp.get("v.RecProUrl1")+currentUser;
        cmp.set("v.RecProUrl1",url1);
        var img1=cmp.get("v.RecProImg1")+currentUser;
        cmp.set("v.RecProImg1",img1);
        var url2=cmp.get("v.RecProUrl2")+currentUser;
        cmp.set("v.RecProUrl2",url2);
        var img2=cmp.get("v.RecProImg2")+currentUser;
        cmp.set("v.RecProImg2",img2);
        var url3=cmp.get("v.RecProUrl3")+currentUser;
        cmp.set("v.RecProUrl3",url3);
        var img3=cmp.get("v.RecProImg3")+currentUser;
        cmp.set("v.RecProImg3",img3);
        
        var url4=cmp.get("v.RecProUrl4")+currentUser;
        cmp.set("v.RecProUrl4",url4);
        var img4=cmp.get("v.RecProImg4")+currentUser;
        cmp.set("v.RecProImg4",img4);
        
        
        // alert($A.get("$SObjectType.CurrentUser.Email")); document.getElementById('search1').click();
        // var message =$A.get("$SObjectType.CurrentUser.Email");
        //    var vfOrigin = "https://" + component.get("v.vfHost");
        //  var vfWindow = component.find("vfFrame").getElement().contentWindow;
        //vfWindow.postMessage(message, vfOrigin);
        
    },
    showRec: function(cmp, evt, helper) {
        cmp.set("v.RecPro",true);
        //document.getElementById('submitForm').click();
        
    },
    
    doInit : function(component, event,helper,page) 
    {
        //helper.GetcustomInfoid(component, event, helper);
        //var res = helper.pickListVal(component,component.get("v.SelectedRetailer"),'Retailer_Code_Hidden__c','Order_Country__c');
        //helper.getCartCount(component, event, helper);
        helper.GetcustomInfoidNew(component, event, helper);
        helper.productListNew(component, event, helper);
        //helper.getCartCount(component, event, helper);
    },
    cartCount: function (component, event, helper) {
        helper.getCartCount(component, event, helper);
    },
    Search: function(component, event, helper) 
    {
        // component.set("v.page",1)
        // alert('inside search');
        helper.productSearchNew(component, event, helper);
    },
    Shipcmp:function(component, event, helper) {
        component.set("v.parentcmp",false);
        component.set("v.isShipcmp",true);
    },
    selectTab : function(component, event, helper) 
    {
        /*component.set("v.showSpinner",true);
        helper.toCheckSORetailer(component, event, helper,event.getSource().get('v.id'));  
        component.set("v.viewbulk",true);
        component.set("v.selectedFamily",'NULL');
        component.set("v.displayPagination",true);
        component.set("v.catalogVertical",true);
        component.set("v.catalogOrder",false);
        component.set("v.sizerhanger",false);
        component.set("v.careLabelOrder",false);*/
        component.set("v.showSpinner",false); 
        component.set("v.viewbulk",false);
        component.set("v.selectedFamily",'NULL');
        component.set("v.displayPagination",false);
        component.set("v.catalogVertical",false);
        component.set("v.catalogOrder",false);
        component.set("v.sizerhanger",false);
        component.set("v.careLabelOrder",false);
        
    },
    pageChange: function(component, event, helper) {
        //var spinner = component.find('spinner');
        //$A.util.toggleClass(spinner, "slds-hide");
        var page = component.get("v.page") || 1;
        var direction = event.getParam("direction");
        page = direction === "previous" ? (page - 1) : (page + 1);
        component.set("v.page",page);
        
        if(component.get("v.isSearch"))
        {
            helper.productSearch(component, event, helper);
        }
        else
        {
            helper.toGetTabData(component, event, helper,component.get("v.selectedTab"));
        }
    },
    /*Shipcmp:function(component, event, helper) {
        component.set("v.parentcmp",false);
        component.set("v.isShipcmp",true);
    },*/
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
    OrderToCompany:function(component, event, helper)
    {
        var compName = event.getSource().get("v.value");
        helper.pickListVal(component,compName,'Order_Country__c','Preferred_Currency__c');
    },
    preferredCurrency:function(component, event, helper)
    {
        component.set('v.selectedFamily','NULL');
        var templist = [];
        component.set('v.fieldList',templist);
    },
    handleCatalogEvent:function(component, event, helper){
        var flag = event.getParam("flag");
        if(flag=='BlockRetailer')
        {
            component.set('v.cartFlag',true);
        }
        else if(flag=='fromSizer')
        {  
            helper.productSearch(component, event, helper);
        }
            else if(flag=='allSizerRemoved' && !component.get('v.CartCount'))
            {
                component.set('v.cartFlag',false);
            }
    },
    /*bulkAdd:function(component,event,helper)
    {
        var bulkadd='';
        if(component.get('v.selectedTab')=='Hanger Business')            
        {
            bulkadd = component.find("hangerBulkaddId");
        }
        else if(component.get('v.selectedTab')=='Flexible Packaging')
        {
            bulkadd = component.find("fexyBulkaddId");
        }
            else if(component.get('v.selectedTab')=='TLA')
            {
                bulkadd = component.find("tlaBulkaddId");
            }
                else if(component.get('v.selectedTab')=='EAS & RFID')
                {
                    bulkadd = component.find("rfidBulkaddId");
                }
                    else if(component.get('v.selectedTab')=='Labels & Tickets')
                    {
                        bulkadd = component.find("labelBulkaddId");
                    }
        var status=bulkadd.getBulkData();
    },*/
    UploadImage:function(component, event, helper){
        
        component.set('v.searchKeyword','Tcg');
        component.set("v.page",1)
        helper.productSearch(component, event, helper);        
    },
    handleNext : function(component, event, helper) { 
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber+1);
        helper.productListNew(component, helper);
    },
    
    handlePrev : function(component, event, helper) {        
        var pageNumber = component.get("v.pageNumber");
        component.set("v.pageNumber", pageNumber-1);
        helper.productListNew(component, helper);
    },
    
    onfocus : function(component,event,helper){
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC  
        var getInputkeyWord = '';
        // helper.productSearchNew(component,event,getInputkeyWord);
    },
    onblur : function(component,event,helper){       
        component.set("v.listOfSearchRecords", null );
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },
    keyPressController : function(component, event, helper) {
        // get the search Input keyword   
        var getInputkeyWord = component.get("v.SearchKeyWord");
        // check if getInputKeyWord size id more then 0 then open the lookup result List and 
        // call the helper 
        // else close the lookup result List part.   
        if( getInputkeyWord.length > 0 ){
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.productSearchNew(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        }
    },
    
    // function for clear the Record Selaction 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );   
    },
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
        // get the selected Account record from the COMPONETN event 	 
        var selectedAccountGetFromEvent = event.getParam("recordByEvent");
        //  alert('selectedAccountGetFromEvent ;'+selectedAccountGetFromEvent);
        component.set("v.selectedRecord" , selectedAccountGetFromEvent); 
        
        var formSubmit = $A.get("e.c:FormSubmitforSearch");
        // alert('formSubmit :'+formSubmit);
        formSubmit.setParams({"eventAttributeSearch" : selectedAccountGetFromEvent,
                             })
        var test = formSubmit.getParam("eventAttributeSearch");
        // alert('test :'+test.Name);
        formSubmit.fire();
        // return;
        // alert('Inside');
        
        var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');
        
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
        var lookUpTarget = component.find("lookupField");
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');  
        
    },
    handleFilesChange: function (component, event, helper) {
        // This will contain the List of File uploaded data and status
        
        component.set("v.keyWordList",[]);
        var uploadFile = event.getSource().get("v.files");
        console.log('uploadFile :'+uploadFile);
        //alert('file length:'+uploadFile.length)
        //return;
        var self = this;
        
        var keyWordList = [];   
        var fileCount = uploadFile.length;
        for(var i=0; i < uploadFile.length; i++) {
            
            console.log('inside loop:'+i);
            var file = uploadFile[i]; // getting the first file, loop for multiple files
            console.log('inside loop after read:');
            //var dataURL = helper.getData(component,event,helper,file);
            //console.log('dataURL:'+dataURL);
            
            helper.getData(component,event,helper,file)
            .then(
                // resolve handler
                $A.getCallback(function(result) {
                    //console.log('result:'+result);
                    helper.visionApiSearch(component, event,helper,result,fileCount);
                }),
                
                // reject handler
                $A.getCallback(function(error) {
                    fileCount = fileCount -1;
                    console.log('Promise was rejected:'+error);
                })
            );
            
            
            component.set("v.isVisionPopup",false);
            component.find("Id_spinner").set("v.class" , 'slds-show');            
        }
        //alert('keyWordList:'+keyWordList);
        //document.getElementById("search1").click();
        //helper.productSearchNew(component, event, helper);
    },
    getEmail: function (component, event, helper) {
         var emil = event.getParam("Email");
       
        //alert("from catalogorder"+emil);
         var imgurl1 = component.get("v.RecImgUrl");
        imgurl1=imgurl1+'1/'+emil;
        var imgurl2 = component.get("v.RecImgUrl");
        imgurl2=imgurl2+'2/'+emil;
        var imgurl3 = component.get("v.RecImgUrl");
        imgurl3=imgurl3+'3/'+emil;
        var imgurl4 = component.get("v.RecImgUrl");
        imgurl4=imgurl4+'4/'+emil;
        // alert(imgurl4);
        component.set("v.RecImgUrl1",imgurl1);
        component.set("v.RecImgUrl2",imgurl2);
        component.set("v.RecImgUrl3",imgurl3);
        component.set("v.RecImgUrl4",imgurl4); 
        
         var hrefurl1 = component.get("v.RecHrefUrl");
        hrefurl1=hrefurl1+'1/'+emil;
        var hrefurl2 = component.get("v.RecHrefUrl");
        hrefurl2=hrefurl2+'2/'+emil;
        var hrefurl3 = component.get("v.RecHrefUrl");
        hrefurl3=hrefurl3+'3/'+emil;
        var hrefurl4 = component.get("v.RecHrefUrl");
        hrefurl4=hrefurl4+'4/'+emil;
        // alert(imgurl4);
        console.log(hrefurl4);
        component.set("v.RecHrefUrl1",hrefurl1);
        component.set("v.RecHrefUrl2",hrefurl2);
        component.set("v.RecHrefUrl3",hrefurl3);
        component.set("v.RecHrefUrl4",hrefurl4); 
        component.set("v.ShowRec",true);
    }
})