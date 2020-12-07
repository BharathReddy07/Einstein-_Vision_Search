({
    doInit : function(component, event,helper) 
    { 
        var completeWrap=component.get('v.completeWrap')[component.get('v.sizerIndex')];
        //console.log(JSON.stringify(completeWrap));
        var prodName=completeWrap.Name;
        var orderToCompany=component.get("v.selectedCompany");
        var preCurrency=component.get("v.selectedCurrency");
        var action = component.get("c.productSizerDetails");
        action.setParams({
            prodname:prodName,
            retailerCode:component.get('v.retailerID'),
            orderToCompany:orderToCompany,
            preCurrency:preCurrency
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var res=response.getReturnValue();
                component.set('v.colorSizeDependentList',res.colorSizeDependentList);
                var colorlist=[];
                for(var key in res.colorSizeDependentList){
                    colorlist.push(key);
                }
                component.set('v.colorlist',colorlist);
                //alert(completeWrap.selectedColor+'->'+JSON.stringify(colorlist));
                var defaultColor=completeWrap.selectedColor?completeWrap.selectedColor:colorlist[0];
                component.set('v.selectedColor',defaultColor);
                component.find('colorlist').set('v.value',defaultColor);
                if(!component.get('v.isSizerQuickview'))
                {
                	component.find('sizelist').set('v.value',res.colorSizeDependentList[defaultColor][0]); 
                    component.set('v.selectedSize',res.colorSizeDependentList[defaultColor][0]);
                }
                component.set('v.sizelist',res.colorSizeDependentList[defaultColor]);
                
                
                completeWrap.selectedColor = defaultColor;
                component.set('v.selectedProduct',completeWrap);
                component.set('v.sizerList',res.sizerList);
                helper.getSizerListData(component, event,helper);
            }
            else
            {
                alert(JSON.stringify(response.getError()));
            }
        }
                          );
        $A.enqueueAction(action);
        helper.checkCartData(component, event,helper);
    },
    onSelectColor:function(component, event,helper) {
        var colorSizeDependentList=component.get('v.colorSizeDependentList');
        var selectedColor=component.find('colorlist').get('v.value');
        component.set('v.sizelist',colorSizeDependentList[selectedColor]);
        var completeWrap=component.get('v.selectedProduct');
        completeWrap.selectedColor = selectedColor; 
        component.set('v.selectedColor',selectedColor);
        component.find('sizelist').set('v.value',colorSizeDependentList[selectedColor][0]);
        component.set('v.selectedSize',colorSizeDependentList[selectedColor][0]);
        component.set('v.selectedProduct',completeWrap); 
        helper.checkCartDatail(component, event,helper);
    },
    onSelectSize:function(component, event,helper) {
        helper.checkCartDatail(component, event,helper);
    },
    addToList: function(component, event,helper) {
        var completeWrap=component.get('v.selectedProduct');
        var selectedColor=component.find('colorlist').get('v.value');
        var selectedSize=component.find('sizelist').get('v.value'); 
        var sizerList=component.get('v.sizerList');
        //alert(JSON.stringify(component.get('v.selectedProduct.tempMap')));
        //alert(JSON.stringify(sizerList));
        var prodName;
        var finalQuantity;
        var boxquantity;
        var fullboxQty;
        var MainettiModelCode;
        var priceBookId;
        var priceByCurr;
        var custRefModel;
        //alert(component.get("v.selectedCurrency"));
        for(var i=0;i<sizerList.length;i++)
        {
            if(sizerList[i].Name==completeWrap.Name && sizerList[i].Color__c == selectedColor && sizerList[i].Sizer_Print__c == selectedSize)
            {
                prodName=sizerList[i].Name;
                boxquantity=sizerList[i].BOX_QTY__c;
                fullboxQty=sizerList[i].Retailer_Code__r.Full_Box_Order__c;
                MainettiModelCode=sizerList[i].Name;
                priceBookId=sizerList[i].Id;
                //alert(sizerList[i].Price_Product_by_Currency__r.length);
                //priceByCurr=sizerList[i].Price_Product_by_Currency__r[0].Id;
                for(var j=0;j<sizerList[i].Price_Product_by_Currency__r.length;j++)
                {
                    //alert(component.get("v.selectedCurrency").split('-'));
                    //alert(sizerList[i].Price_Product_by_Currency__r[j].CurrencyIsoCode);
                    if(component.get("v.selectedCurrency").split('-')[0].trim()==sizerList[i].Price_Product_by_Currency__r[j].CurrencyIsoCode)
                    {
                        priceByCurr=sizerList[i].Price_Product_by_Currency__r[j].Id;
                    }
                }
                //alert(priceByCurr);
                custRefModel=sizerList[i].Customer_Ref_Model__c;
            }
            
        }
        //var prodName=completeWrap.Name;
        
        if(!selectedColor){ 
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Select the color',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        
        if(!selectedSize){ 
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: "Warning",
                message: 'Select the Size',
                type: "warning"
            });
            toastEvent.fire();
            return;
        }
        var obj=new Object();
        var array=component.get('v.selectedSizer');
        var duplicatePrsentAndApproved=false;
        //alert(JSON.stringify(array));
        if(array.length>0)
        {
            for(var i=0;i<array.length;i++)
            {
                
                if(array[i].prodname==component.get('v.selectedProduct').Name && array[i].color==selectedColor && array[i].size==selectedSize)
                {
                    if (confirm("Entered value  "+array[i].color+ " And "+array[i].size+"  already present. Do you want to update the quantity"))
                    {
                        duplicatePrsentAndApproved=true;
                        //obj=array[i];
                    }  
                    else
                    {
                        return;
                    }
                }
                
            }
        }
        /*alert(duplicatePrsentAndApproved);
        if(duplicatePrsentAndApproved)
        {
            obj.quantity=quantity;
        }
        else
        {*/
        var quantity =parseInt(component.find("quantity").get("v.value"));
        //var boxquantity=completeWrap.ProductDataMap[selectedColor].boxquantity;
        //var fullboxQty=completeWrap.ProductDataMap[selectedColor].fullboxQty;
        //alert(JSON.stringify(completeWrap.ProductDataMap[selectedColor]));
        if(!quantity || quantity<=0)
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
        else if(fullboxQty && boxquantity && (quantity<boxquantity || quantity % boxquantity!=0))
        {
            var result = Math.ceil(quantity/boxquantity)*boxquantity;
            if(result)
            {
                if (!confirm("Entered value for Product: "+MainettiModelCode+" is not the multiples of Box quantity.\nCan system automatically change to nearest mutiples of box quantity ( "+result+" ) ?"))
                {
                    return; 
                }
                completeWrap.ProductDataMap[selectedColor].quantity= result;
                finalQuantity=result;
                component.set("v.completeWrap",completeWrap.ProductDataMap[selectedColor].quantity);                
            }
            else
            {
                return;
            }            
        } 
            else
            {
                completeWrap.ProductDataMap[selectedColor].quantity= quantity;
                finalQuantity=quantity;
                component.set("v.completeWrap",completeWrap.ProductDataMap[selectedColor].quantity); 
            }
        obj.prodname=prodName;
        obj.color=selectedColor;
        obj.size=selectedSize;
        obj.quantity=finalQuantity;
        obj.retailerCodeId=component.get('v.retailerID');
        obj.orderToCompany=component.get("v.selectedCompany");
        //alert(priceByCurr);
        obj.preCurrency=component.get("v.selectedCurrency");
        obj.customeid=component.get("v.onselectcustomeid");
        obj.priceBookId=priceBookId;
        obj.pricebycur=priceByCurr;
        obj.custRefModel=custRefModel;
        //array.push(obj);
        //}
        //component.set('v.selectedSizer',array);
        //alert(JSON.stringify(completeWrap.ProductDataMap));
        component.set('v.hangerListDetail',true);
        component.set("v.displayPagination",false);
              //  alert(JSON.stringify(component.get('v.selectedSizer')));
        helper.saveSizerToCart(component, event, helper,obj); 
    },
    removeRow:function(component,event,helper) {
        var selectedSizer = component.get("v.selectedSizer");
        var selectedItem = event.getSource().get("v.name");
        var idTODalete=selectedSizer[selectedItem].recordId;
        selectedSizer.splice(selectedItem, 1);
        component.set("v.selectedSizer", selectedSizer);
        helper.RemoveRow(component,event,helper,idTODalete);
        if(selectedSizer.length==0)
        {
            component.set("v.hangerListDetail", false);
            var e = component.getEvent("CatalogEvent");
            e.setParams({ "flag": "allSizerRemoved"});
            e.fire();
        }
    },
    changeProd:function(component, event, helper){
        component.set("v.displayPagination",true);
        component.set("v.catalogVertical", true); 
        component.set("v.hangersizer", false); 
        component.set('v.hangerListDetail',false); 
        var e = component.getEvent("CatalogEvent");
        e.setParams({ "flag": "fromSizer"});
        e.fire();
    },
    addTocart:function(component, event, helper){
        helper.addTocart(component, event, helper);
    },
    close:function(component, event, helper){
        component.set("v.displayPagination",true);
        component.set("v.catalogVertical", true); 
        component.set('v.hangerListDetail',false);    
        component.set('v.quickviewSizer',false);
    },
    magnify : function(component, event,helper)
    {
        helper.magnify(component, event,helper);
        
    },
    magnifyleave : function(component, event,helper)
    {
        helper.magnifyleave(component, event,helper);
    }
})