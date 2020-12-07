({
    doInit : function(component, event,helper) {
        //alert('do init of '+component.get("v.addressType"));
        //alert('CSSToAddAddress of '+component.get("v.CSSToAddAddress"));
    },
	changeAddress : function(component, event,helper) {
        if(event.getSource().get("v.value"))
        {
            var index = event.getSource().get("v.name");
            //alert('index val : '+event.getSource().get("v.value"));
            //component.set('v.addressIndex',index);
            //firing to event to pass index to new selected address
            var addressType = component.get("v.addressType");
            //alert('changing address of '+component.get("v.addressType"));
            var compEvent = component.getEvent("onaddressSelect");
            compEvent.setParams({"recordByEvent" : index });
            compEvent.setParams({"objectAPIName" : index });
            compEvent.setParams({"context" : addressType });
            compEvent.fire();
        }
        //$A.get('e.force:refreshView').fire();
    },
    closeModal : function(component, event,helper) {
         component.set("v.CSSToAddAddress", false);
         $A.get('e.force:refreshView').fire();  
    },
})