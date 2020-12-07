({
    doInit : function(component, event,helper) 
    {
        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-hide");
        //helper.toGetcustomerData(component, event, helper);
        //helper.toGetcustomerDataNew(component, event,helper);
        //helper.getBundleProductList(component, event,helper);
        helper.fetchCartDetails(component, event,helper);
    },
    ClearItems: function(component, event, helper) { 
        // alert('button should hide');
        component.set("v.HideButtons",false);
        //helper.ClearCart(component, event, helper);
        helper.ClearCartNew(component, event,helper); 
    },
    reloadPage : function(component, event,helper)
    {
        //helper.toGetcustomerData(component, event,helper);  
    },
    changehandler : function(component, event,helper) 
    {
        helper.toGetCartDetails(component, event,helper);
    },
    deleteProduct: function(component, event, helper,index) 
    {
        var index = event.getSource().get("v.name");
        helper.toDeleteProductCart(component, event,helper,index);  
        
    },
    UpdateCart : function(component, event,helper) 
    {
        helper.UpdateCart(component, event,helper);
        //component.set("v.PlaceorderBtn",true);
        //helper.CalBoxQty(component, event,helper);
    },
    CalculateBoxQty : function(component, event,helper) 
    {
        //var index=event.getSource().get("v.name");
        component.set("v.PlaceorderBtn",true);
    },
    addCart: function(component, event, helper) { 
        helper.toSaveCart(component, event,helper);     
    },
    /*ClearItems: function(component, event, helper) { 
        // alert('button should hide');
        component.set("v.HideButtons",false);
        helper.ClearCart(component, event,helper);     
    },*/
    placeOrders: function(component, event, helper) {
        //Added by Seema
        /*var custid =component.get("v.DisplayCustDetail");
        helper.checkingAddAndCloneData(component, event, helper, custid);*/
        component.set("v.GetAddress",true);
    },
    BacktoCatalog : function(component, event,helper) {
        component.set("v.parentcmp",true);
        component.set("v.Shipcmp",false);
        /*var urlString = window.location.href;
        var CommunityBaseURL = urlString.substring(0, urlString.indexOf("/s/"));
        //alert(CommunityBaseURL+'/s/catalog-order')
        window.location = CommunityBaseURL+'/s/catalog-order';*/
        
        $A.get('e.force:refreshView').fire();
    },
    confirmdata: function(component, event, helper) {
        var custid =component.get("v.DisplayCustDetail");
        helper.confirmdata(component,event,helper,custid); 
    },
    deleteData: function(component, event, helper) {
        var custid =component.get("v.DisplayCustDetail");
        helper.deleteData(component,event,helper,custid); 
    }
})