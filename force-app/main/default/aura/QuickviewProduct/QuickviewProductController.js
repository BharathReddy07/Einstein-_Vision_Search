({
    doInit : function(component, event,helper) 
    { 
        //alert(JSON.stringify(component.get('v.onselectcustomeid')));
        
    },
    magnify : function(component, event,helper)
    {
        helper.magnify(component, event,helper);
        
    },
    magnifyleave : function(component, event,helper)
    {
        helper.magnifyleave(component, event,helper);
    },
    colorChange: function(component, event, helper){
        var ind=event.target.name;
        var color=event.target.id;
        var completeWrap=component.get('v.quickviewedProduct');
        //alert('completeWrap :'+completeWrap);
        //console.log(completeWrap);
        completeWrap.selectedColor = color;
        component.set('v.quickviewedProduct',completeWrap);
        helper.magnifierHelper(component, event,helper);
    },
    // code for Saveing SO and SOLI by chandana 
    saveproddata :function(component, event, helper) {
        var index = event.currentTarget;
        var indexval = index.dataset.record;
        //alert('indexval'+indexval);
        helper.saveToCart(component, event, helper,indexval);
    },
    quickviewcmp :function(component, event, helper)
    {
        //alert(event.target);
        
    },
    
    
    close : function(component, event, helper)
    {        
        component.set("v.quickviewprod",false);
        component.set("v.LabelQuickview",false);
        // component.set("v.catalogVertical",true);   
    }
    
})