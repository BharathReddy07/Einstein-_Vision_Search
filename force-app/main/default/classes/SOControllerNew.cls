public with sharing class SOControllerNew {
    /*@AuraEnabled
    public static List<Sales_Order_Line_Items__c>  getAllCartDetails(id customerid){
        system.debug('customerid>>'+customerid);
        List<Sales_Order_Line_Items__c> SOList = [SELECT Product_Name__c,Product_Code__c,Product_Description__c,
                                                 Quantity__c,Sales_Order__c, Product_image_url__c,Product__r.Product_Type__c
                                                 FROM Sales_Order_Line_Items__c WHERE
                                                 Sales_Order__r.UserId__c =:customerid AND 
                                                 Sales_Order__r.Status__c = 'New Order'];
        system.debug('SOList>>'+SOList);
        return SOList;
    }

    //This method returns the list of bundle products.
    @AuraEnabled
    public static List<Product_Bundle__c>  getBundleProducts(){
        List<Product_Bundle__c> prodBundleList = [SELECT Parent_Product__c,Child_Product__c,Quantity__c,
                                            Child_Product__r.Name,Child_Product__r.ProductCode,
                                            Child_Product__r.Description,Child_Product__r.Product_image_url__c
                                            FROM Product_Bundle__c WHERE Parent_Product__c <> null AND
                                            Child_Product__c <> null];
        system.debug('prodBundleList>>'+prodBundleList);
        return prodBundleList;
    }*/

    @AuraEnabled
    public static List<shipWrapper> FetchCartDetails(String customerid){
        //Id currentuserId = UserInfo.getUserId();
        system.debug('customerid>>'+customerid);
        List<shipWrapper> shipWrapList = new List<shipWrapper>();
        
        
        List<Sales_Order_Line_Items__c> soliList = [SELECT Product_Name__c,Product_Code__c,Product_Description__c,
                                                  Quantity__c,Sales_Order__c, Product_image_url__c,Product_Type__c,
                                                  Product__c FROM Sales_Order_Line_Items__c WHERE
                                                  Sales_Order__r.UserId__c =:customerid AND 
                                                  Sales_Order__r.Status__c = 'New Order'];     
        
        Set<Id> parentProducts = new Set<Id>();
        if (soliList <> null && soliList.size() > 0) {
            for (Sales_Order_Line_Items__c soLineItm : soliList) {
                parentProducts.add(soLineItm.Product__c);
            }
        }
        
        List<Product_Bundle__c> prodBundleList = [SELECT Parent_Product__c,Child_Product__c,Quantity__c,
                                                  Child_Product__r.Name,Child_Product__r.ProductCode,
                                                  Child_Product__r.Description,Child_Product__r.Product_image_url__c
                                                  FROM Product_Bundle__c WHERE Parent_Product__c <> null AND
                                                  Child_Product__c <> null AND Parent_Product__c IN :parentProducts];
        system.debug('soliList:'+soliList);
        system.debug('prodBundleList:'+prodBundleList);
        system.debug('prodBundleListSize:'+prodBundleList.Size());

        //Get assigned PriceBook for an user.
        //There should be only one PriceBook for an user
        //Administrator user will have access to multiple PriceBook, consider only one PriceBook for admin.
        Set<Id> pricbookAssignedForUser =  SharedPricebooks.getPricebooks();        
        System.debug('pricbookAssignedForUser:'+pricbookAssignedForUser);
        String priceBookId = '';
        for(Id priceBook : pricbookAssignedForUser){
            priceBookId = priceBook;
            break;
        }
        List<PricebookEntry> priceBookEntryItems = [select Pricebook2Id,Product2Id,UnitPrice 
                                                    from PricebookEntry where 
                                                    Pricebook2Id  =:priceBookId];
        System.debug('priceBookEntryItems:'+priceBookEntryItems);

        //Add products and their price into map.
        Map<Id,Decimal> productPriceMap = new Map<Id,Decimal>();
        for(PricebookEntry pricebookEntry : priceBookEntryItems){
            if(pricebookEntry.Product2Id <> null && pricebookEntry.UnitPrice <> null)
                productPriceMap.put(pricebookEntry.Product2Id, pricebookEntry.UnitPrice);
        }
        
        for(Sales_Order_Line_Items__c soli : soliList){
            List<Product_Bundle__c> prodBundSubList = new List<Product_Bundle__c>();
            shipWrapper shipWrap = new shipWrapper();

            //Get price from map and multiply with quantity for total price.
            if(productPriceMap.get(soli.Product__c) <> null && soli.Quantity__c <> null)
                soli.Price__c = productPriceMap.get(soli.Product__c) * soli.Quantity__c;
            
            shipWrap.soli = soli;
            
            if(soli.Product_Type__c == 'Bundle'){
                for(Product_Bundle__c prdBund : prodBundleList){
                    if(soli.Product__c == prdBund.Parent_Product__c){
                        Product_Bundle__c prodBundle = prdBund.clone(true, true, false, false);
                        prodBundle.Quantity__c = prdBund.Quantity__c * soli.Quantity__c;

                        if(prodBundle.Quantity__c <> null && productPriceMap.get(prdBund.Child_Product__c) <> null)
                            prodBundle.Price__c = prodBundle.Quantity__c * productPriceMap.get(prdBund.Child_Product__c);
                        
                        prodBundSubList.add(prodBundle);
                    }
                }
                shipWrap.bundleProducts = prodBundSubList;
            }
            shipWrapList.add(shipWrap);
        }
        
        system.debug('shipWrapList:'+shipWrapList);
        return shipWrapList;
    }

    @AuraEnabled
    public static Boolean ClearCartDetails(){
        Boolean deleteStatus = true;
        List<Sales_Order__c> SOobject=new List<Sales_Order__c>();
        try {
            Id currentuserId = UserInfo.getUserId();
            SOobject =[select id from Sales_Order__c where UserId__c =: currentuserId limit 1];
            if(SOobject != null)
                delete SOobject;
        } catch (DmlException e) {
            deleteStatus = false;
            System.debug('Failed to delete:' + e);
        }
        return deleteStatus;
    }

    @AuraEnabled
    public static Boolean  deleteProductFromCart(Id soId, Id soliId){
        System.debug('soId:'+soId + ' '+ 'soliId:'+soliId);
        Boolean deleteStatus = true;
        try {
            delete [Select Id from Sales_Order_Line_Items__c Where Id =:soliId];
            list<Sales_Order_Line_Items__c> remainingrec = [select id from Sales_Order_Line_Items__c where Sales_Order__c=:soId];
            if (remainingrec.size() == 0) {
                delete [Select Id from Sales_Order__c Where Id =:soId];
            }
        } catch (Exception e) {
            deleteStatus = false;
        }
        return deleteStatus;
    }

    // Update product to the cart
    @AuraEnabled 
    public static Boolean updateCartValue(String solilistjson) {
        Boolean updateStatus = true;
        try{
            system.debug('solilistjson:::'+solilistjson);
            //JSON.deserialize will convert json string to an object.
            //list<Sales_Order_Line_Items__c> SolilistUpdated = (List<Sales_Order_Line_Items__c>)JSON.deserialize(solilistjson, List<Sales_Order_Line_Items__c>.class);
            list<shipWrapper> SolilistUpdatedWrap = (List<shipWrapper>)JSON.deserialize(solilistjson, List<shipWrapper>.class);
            system.debug('SolilistUpdatedWrap:::'+SolilistUpdatedWrap);

            list<Sales_Order_Line_Items__c> SolilistUpdated = new list<Sales_Order_Line_Items__c>();
            for(shipWrapper soliWrap : SolilistUpdatedWrap){
                if(soliWrap.soli <> null)
                SolilistUpdated.add(soliWrap.soli);
            }
            system.debug('SolilistUpdated:::'+SolilistUpdated);
            upsert SolilistUpdated;
        }
        catch (Exception e) {
            updateStatus = false;
            System.debug('e:::'+e);
            System.debug(LoggingLevel.ERROR, e.getMessage());
        }
        return updateStatus;
    }

    @AuraEnabled
    public static addressWrapper FetchCustAdd(String custInfoid){

        addressWrapper addWrap = new addressWrapper();
        List<Ship_Bill_Address__c> billAddress = new List<Ship_Bill_Address__c>();
        List<Ship_Bill_Address__c> shipAddress = new List<Ship_Bill_Address__c>();

        Sales_Order__c cartSO = [select id,name, Transportation_Details__c, Shipping_Mark__c,
                                Expected_Delivery_Date__c from Sales_Order__c 
                                where UserId__c  =: custInfoid limit 1];
        System.debug('cartSO:'+cartSO);

        List<Ship_Bill_Address__c> custAddress= [select id,name,recordtype.name,Is_Default__c,Company_Name__c,
                                                Address_1__c,City__c,State__c,Country__c,Postcode__c,
                                                Factory_Name__c,Contact__c,Tel_No__c,Email_Address__c,
                                                Fax_No__c from Ship_Bill_Address__c where 
                                                UserId__c =: custInfoid AND 
                                                Bill_Ship_Status__c=:'Active'];
        
        for(Ship_Bill_Address__c addss:custAddress){
            if(addss.recordtype.name == 'Bill To') {
                billAddress.add(addss);
            }
            else if(addss.recordtype.name == 'Ship To') {
                shipAddress.add(addss);
            }
        }
        
        //get Company Picklist Values
        List<String> companyPicklist = new List<String>();
        Schema.DescribeFieldResult fieldResult = Sales_Order__c.Company__c.getDescribe();
        List<Schema.PicklistEntry> cmpList = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry p: cmpList) {
            //Put Picklist Value in List
            companyPicklist.add(p.getValue());
        }
        //get Currency Picklist Values
        List<String> currencyPicklist = new List<String>();
        Schema.DescribeFieldResult curfieldResult = Sales_Order__c.Currency__c.getDescribe();
        List<Schema.PicklistEntry> curList = curfieldResult.getPicklistValues();
        for (Schema.PicklistEntry p: curList) {
            //Put Picklist Value in List
            currencyPicklist.add(p.getValue());
        }
        //get Delivery Instruction Picklist Values
        List<String> delivPicklist = new List<String>();
        Schema.DescribeFieldResult delivfieldResult = Sales_Order__c.Delivery_Instruction__c.getDescribe();
        List<Schema.PicklistEntry> delivList = delivfieldResult.getPicklistValues();
        for (Schema.PicklistEntry p: delivList) {
            //Put Picklist Value in List
            delivPicklist.add(p.getValue());
        }

        //get Templates Lists
        List<EmailTemplate> templateList = [Select Id,Name from EmailTemplate where FolderId In
                                     (SELECT Id FROM Folder WHERE Name = 'Terms and Conditions') Order by Name asc];
        

        System.debug('companyPicklist:'+companyPicklist);
        System.debug('currencyPicklist:'+currencyPicklist);
        System.debug('delivPicklist:'+delivPicklist);
        System.debug('templateList:'+templateList);
        
        addWrap.billAddList = billAddress;
        addWrap.shipAddList = shipAddress;
        addWrap.protoSO = cartSO;
        addWrap.companyPicklist = companyPicklist;
        addWrap.currencyPicklist = currencyPicklist;
        addWrap.deliveryPicklist = delivPicklist;
        addWrap.templateList = templateList;
        return addWrap;
    }

    //Saving the status of Sales Order clicking on ConfirmOrder.
    @AuraEnabled
    public static String SaveOrder(String custInfoid, Sales_Order__c SO, Ship_Bill_Address__c BillAddress, Ship_Bill_Address__c shipAddress){
        System.debug('custInfoid:'+custInfoid);
        System.debug('SO:'+SO);
        System.debug('BillAddress:'+BillAddress);
        System.debug('shipAddress:'+shipAddress);
        Sales_Order__c cartSO = new Sales_Order__c();
        try {
            //Get SalesOrder for the order added to cart.
            cartSO = [select id,name, Transportation_Details__c, Shipping_Mark__c,
            Expected_Delivery_Date__c from Sales_Order__c 
            where UserId__c  =: custInfoid limit 1];
            System.debug('cartSO:'+cartSO);

            Sales_Order__c cartToOrder = new Sales_Order__c();
            cartToOrder.Id = cartSO.Id;
            cartToOrder.Status__c = 'Order Submitted';
            cartToOrder.UserId__c = custInfoid;
            cartToOrder.Transportation_Details__c = SO.Transportation_Details__c;
            cartToOrder.Shipping_Mark__c = SO.Shipping_Mark__c;
            cartToOrder.Expected_Delivery_Date__c = SO.Expected_Delivery_Date__c;

            cartToOrder = assignBillToAdd(cartToOrder,BillAddress);
            cartToOrder = assignShipToAdd(cartToOrder,shipAddress);
            upsert cartToOrder;
        } catch (DmlException e) {
            System.debug('Failed to Confirm Order:' + e);
        }
        return cartSO.Id;
    }

    @AuraEnabled
    public static Boolean createOpportunityProducts(String custInfoid, Sales_Order__c SO){
        System.debug('#### Inside createOpportunity ####');
        System.debug('custInfoid:'+custInfoid);
        System.debug('SO:'+SO);

        Boolean createStatus = true;
        //Get assigned PriceBook for an user.
        //There should be only one PriceBook for an user
        //Administrator user will have access to multiple PriceBook, consider only one PriceBook for admin.
        Set<Id> pricbookAssignedForUser =  SharedPricebooks.getPricebooks();        
        System.debug('pricbookAssignedForUser:'+pricbookAssignedForUser);
        String priceBookId = '';
        for(Id priceBook : pricbookAssignedForUser){
            priceBookId = priceBook;
            break;
        }
        List<PricebookEntry> priceBookEntryItems = [select Pricebook2Id,Product2Id,UnitPrice 
                                                    from PricebookEntry where 
                                                    Pricebook2Id  =:priceBookId];
        System.debug('priceBookEntryItems:'+priceBookEntryItems);

        //Add products and their price into map.
        Map<Id,Decimal> productPriceMap = new Map<Id,Decimal>();
        for(PricebookEntry pricebookEntry : priceBookEntryItems){
            if(pricebookEntry.Product2Id <> null && pricebookEntry.UnitPrice <> null)
                productPriceMap.put(pricebookEntry.Product2Id, pricebookEntry.UnitPrice);
        }

        List<Sales_Order_Line_Items__c> soliList = [SELECT Product__c,Product_Type__c,Quantity__c FROM Sales_Order_Line_Items__c 
                                                    WHERE Sales_Order__c =:SO.Id];
    
        Set<Id> parentProducts = new Set<Id>();
        if (soliList <> null && soliList.size() > 0) {
            for (Sales_Order_Line_Items__c soLineItm : soliList) {
                parentProducts.add(soLineItm.Product__c);
            }
        }
        
        List<Product_Bundle__c> prodBundleList = [SELECT Parent_Product__c,Child_Product__c,Quantity__c                                                  
                                                  FROM Product_Bundle__c WHERE Parent_Product__c <> null AND
                                                  Child_Product__c <> null AND Parent_Product__c IN :parentProducts];
        
        Id accountId = [SELECT Id FROM Account where Name = 'Kasetti Technologies' limit 1].Id;
        Integer oppCount = [select count() from Opportunity];
        
        Opportunity newOpportunity = new Opportunity();
        newOpportunity.Name = 'Opp-' + String.valueOf( oppCount + 1);
        newOpportunity.AccountId = accountId;
        newOpportunity.CloseDate = SO.Expected_Delivery_Date__c;
        newOpportunity.StageName = 'Closed Won';
        newOpportunity.Type = 'New Business';
        newOpportunity.Pricebook2Id = priceBookId;
        insert newOpportunity;

        List<OpportunityLineItem> oppProductsList = new List<OpportunityLineItem>();
        for(Sales_Order_Line_Items__c soli : soliList){
            //OpportunityLineItem oppProducts = new OpportunityLineItem();            

            if(soli.Product_Type__c == 'Bundle'){
                for(Product_Bundle__c prdBund : prodBundleList){
                    if(soli.Product__c == prdBund.Parent_Product__c){
                        OpportunityLineItem oppProducts = new OpportunityLineItem();
                        oppProducts.OpportunityId = newOpportunity.Id;
                        oppProducts.Product2Id = prdBund.Child_Product__c;
                        oppProducts.Product_Type__c = soli.Product_Type__c;
                        oppProducts.Quantity = prdBund.Quantity__c * soli.Quantity__c;
                        oppProducts.UnitPrice = (productPriceMap.get(prdBund.Child_Product__c) <> null)? productPriceMap.get(prdBund.Child_Product__c) : 0;
                        oppProductsList.add(oppProducts);
                    }
                }
            } else {
                OpportunityLineItem oppProducts = new OpportunityLineItem();
                oppProducts.OpportunityId = newOpportunity.Id;
                oppProducts.Product2Id = soli.Product__c;
                oppProducts.Product_Type__c = soli.Product_Type__c;
                oppProducts.Quantity = soli.Quantity__c;
                oppProducts.UnitPrice = (productPriceMap.get(soli.Product__c) <> null)? productPriceMap.get(soli.Product__c) : 0;
                oppProductsList.add(oppProducts);
            }
        }
        try {
            if(oppProductsList.size() > 0)
                insert oppProductsList;
        } catch (DmlException e) {
            createStatus = false;
            System.debug('Failed to Update Order for pdf generation:' + e);
        }
        return createStatus;
    }

    @AuraEnabled
    public static Boolean createQuoteLineItems(String custInfoid, Sales_Order__c SO){
        Boolean createStatus = true;
        //Get assigned PriceBook for an user.
        //There should be only one PriceBook for an user
        //Administrator user will have access to multiple PriceBook, consider only one PriceBook for admin.
        Set<Id> pricbookAssignedForUser =  SharedPricebooks.getPricebooks();        
        System.debug('pricbookAssignedForUser:'+pricbookAssignedForUser);
        String priceBookId = '';
        for(Id priceBook : pricbookAssignedForUser){
            priceBookId = priceBook;
            break;
        }
        List<PricebookEntry> priceBookEntryItems = [select Pricebook2Id,Product2Id,UnitPrice 
                                                    from PricebookEntry where 
                                                    Pricebook2Id  =:priceBookId];
        System.debug('priceBookEntryItems:'+priceBookEntryItems);

        //Add products and their price into map.
        Map<Id,Decimal> productPriceMap = new Map<Id,Decimal>();
        for(PricebookEntry pricebookEntry : priceBookEntryItems){
            if(pricebookEntry.Product2Id <> null && pricebookEntry.UnitPrice <> null)
                productPriceMap.put(pricebookEntry.Product2Id, pricebookEntry.UnitPrice);
        }

        List<Sales_Order_Line_Items__c> soliList = [SELECT Product__c,Product_Type__c,Quantity__c FROM Sales_Order_Line_Items__c 
                                                    WHERE Sales_Order__c =:SO.Id];
    
        Set<Id> parentProducts = new Set<Id>();
        if (soliList <> null && soliList.size() > 0) {
            for (Sales_Order_Line_Items__c soLineItm : soliList) {
                parentProducts.add(soLineItm.Product__c);
            }
        }
        
        List<Product_Bundle__c> prodBundleList = [SELECT Parent_Product__c,Child_Product__c,Quantity__c                                                  
                                                  FROM Product_Bundle__c WHERE Parent_Product__c <> null AND
                                                  Child_Product__c <> null AND Parent_Product__c IN :parentProducts];
        
        Id accountId = [SELECT Id FROM Account where Name = 'Kasetti Technologies' limit 1].Id;
        Integer oppCount = [select count() from Opportunity];
        
        Quote__c newQuote = new Quote__c();
        newQuote.Account__c = accountId;
        newQuote.Status__c = 'Approved';
        newQuote.Type__c = 'Quote';
        newQuote.Price_Book__c = priceBookId;
        insert newQuote;

        List<Quote_Line__c> quoteLineItemList = new List<Quote_Line__c>();
        for(Sales_Order_Line_Items__c soli : soliList){
            //OpportunityLineItem oppProducts = new OpportunityLineItem();            

            if(soli.Product_Type__c == 'Bundle'){
                for(Product_Bundle__c prdBund : prodBundleList){
                    if(soli.Product__c == prdBund.Parent_Product__c){
                        Quote_Line__c quoteLine = new Quote_Line__c();
                        quoteLine.Quote__c = newQuote.Id;
                        quoteLine.Product__c = prdBund.Child_Product__c;
                        quoteLine.Product_Type__c = soli.Product_Type__c;
                        quoteLine.Quantity__c = prdBund.Quantity__c * soli.Quantity__c;
                        quoteLine.Net_Unit_Price__c = (productPriceMap.get(prdBund.Child_Product__c) <> null)? productPriceMap.get(prdBund.Child_Product__c) : 0;
                        quoteLineItemList.add(quoteLine);
                    }
                }
            } else {
                Quote_Line__c quoteLine = new Quote_Line__c();
                quoteLine.Quote__c = newQuote.Id;
                quoteLine.Product__c = soli.Product__c;
                quoteLine.Product_Type__c = soli.Product_Type__c;
                quoteLine.Quantity__c = soli.Quantity__c;
                quoteLine.Net_Unit_Price__c = (productPriceMap.get(soli.Product__c) <> null)? productPriceMap.get(soli.Product__c) : 0;
                quoteLineItemList.add(quoteLine);
            }
        }
        try {
            if(quoteLineItemList.size() > 0)
                insert quoteLineItemList;
        } catch (DmlException e) {
            createStatus = false;
            System.debug('Failed to Update Order for pdf generation:' + e);
        }
        return createStatus;
    }

    //Update SalesOrder for generating pdf.
    @AuraEnabled
    public static String updateSalesOrderForPDF(String custInfoid, Sales_Order__c SO, Ship_Bill_Address__c BillAddress, Ship_Bill_Address__c shipAddress){
         
        System.debug('SO:'+SO);
        Sales_Order__c soRec = new Sales_Order__c();
        try {
            Sales_Order__c cartSO = [select id,name, Transportation_Details__c, Shipping_Mark__c,
                                    Expected_Delivery_Date__c from Sales_Order__c 
                                    where UserId__c  =: custInfoid limit 1];
            System.debug('cartSO:'+cartSO);
            
            soRec.Id = cartSO.Id;
            soRec.Company__c = SO.Company__c;
            soRec.Currency__c = SO.Currency__c;
            soRec.Expected_Delivery_Date__c = SO.Expected_Delivery_Date__c;
            soRec.Delivery_Instruction__c = SO.Delivery_Instruction__c;
            soRec.Transportation_Details__c = SO.Transportation_Details__c;
            soRec.Template__c = SO.Template__c;
            soRec.Shipping_Mark__c = SO.Shipping_Mark__c;
            soRec = assignBillToAdd(soRec,BillAddress);
            soRec = assignShipToAdd(soRec,shipAddress);
            upsert soRec;
        } catch (DmlException e) {
            System.debug('Failed to Update Order for pdf generation:' + e);
        }
        return soRec.Id;
    }

    //To assign Bill to addess to SalesOrder
    public static Sales_Order__c assignBillToAdd(Sales_Order__c sOrder,Ship_Bill_Address__c BillAddress) {
        sOrder.Bill_to_Address__c = BillAddress.Id;
        sOrder.Bill_to_Factory__c = BillAddress.Factory_Name__c!=null?BillAddress.Factory_Name__c:'';
        sOrder.Bill_to_City__c = BillAddress.City__c!=null?BillAddress.City__c:'';
        sOrder.Bill_to_State__c = BillAddress.State__c!=null?BillAddress.State__c:'';
        sOrder.Bill_to_Country__c = BillAddress.Country__c!=null?BillAddress.Country__c:'';
        sOrder.Bill_to_Postcode__c = BillAddress.Postcode__c!=null?BillAddress.Postcode__c:'';
        return sOrder;
    }

    //To assign ship to addess to SalesOrder
    public static Sales_Order__c assignShipToAdd(Sales_Order__c sOrder,Ship_Bill_Address__c shipAddress) {
        sOrder.Ship_to_Address__c = shipAddress.Id;
        sOrder.Ship_to_Factory__c = shipAddress.Factory_Name__c!=null?shipAddress.Factory_Name__c:'';
        sOrder.Ship_to_City__c = shipAddress.City__c!=null?shipAddress.City__c:'';
        sOrder.Ship_to_State__c = shipAddress.State__c!=null?shipAddress.State__c:'';
        sOrder.Ship_to_Country__c = shipAddress.Country__c!=null?shipAddress.Country__c:'';
        sOrder.Ship_to_Postcode__c = shipAddress.Postcode__c!=null?shipAddress.Postcode__c:'';
        return sOrder;
    }

    //This method saves the pdf generated as attachment.
    @AuraEnabled
    public static String saveCatalogSOPDF(ID SOid) {
        System.debug('inside saveCatalogSOPDF::'+SOid);
        if (SOid !=NULL) {
            Sales_Order__c soPDF = [select id,name from Sales_Order__c where id =: SOid];
            List<Attachment> pdfs = new List<Attachment>([SELECT Id, Name, ParentId, Parent.Type FROM Attachment where ParentId =: SOid]);

            system.debug('step 1');
            Attachment attach = new Attachment();
            system.debug('step 2');
            PageReference pdf = Page.SOConfirmationPDF;
            system.debug('step 3');

            pdf.getParameters().put('id',SOid);
            system.debug('step 4');
            // the contents of the attachment from the pdf
            Blob body = pdf.getContentAsPDF();
            system.debug('step 5');
            Integer versionName = pdfs.size()+1;
            system.debug('step 6');

            attach.Body = body;            
            attach.Name = soPDF.Name + ' v' + versionName +'.pdf'; //Versioning if there are pdf previously generated.
            attach.IsPrivate = false;            
            attach.ParentId = SOid; // attach the pdf to the SO
            insert attach;
            system.debug('attach::'+attach);
            return attach.Id;
        } else {
            return 'No Id found';
        }
    }

    //Resets the order if cancelled from confirmation page
    @AuraEnabled
    public static void toCancelOrder(Sales_Order__c dOrder) {
        System.debug('dOrder :'+dOrder);
        /*Sales_Order__c salesOrder = [Select Id, Company__c, Currency__c, Delivery_Instruction__c,Transportation_Details__c,
                Expected_Delivery_Date__c,Shipping_Mark__c,Bill_to_Address__c,Bill_to_City__c,Bill_to_Country__c,
                Bill_to_Factory__c,Bill_to_Postcode__c,Bill_to_State__c, 
                Ship_to_Address__c,Ship_to_City__c,Ship_to_Country__c,Ship_to_Factory__c,
                Ship_to_Postcode__c,Ship_to_State__c from Sales_Order__c where Id =: dOrder.Id];
        System.debug('salesOrder:'+salesOrder);*/
        Sales_Order__c resetSO = new Sales_Order__c();
        resetSO.Id = dOrder.Id;
        resetSO.Bill_to_Address__c = null;
        resetSO.Ship_to_Address__c = null;
        resetSO.Transportation_Details__c = '';
        resetSO.Shipping_Mark__c = '';

        resetSO.Bill_to_City__c = '';
        resetSO.Bill_to_State__c = '';
        resetSO.Bill_to_Country__c = '';
        resetSO.Bill_to_Postcode__c = '';
        resetSO.Bill_to_Factory__c = '';
        
        resetSO.Ship_to_City__c = '';
        resetSO.Ship_to_State__c = '';
        resetSO.Ship_to_Country__c = '';
        resetSO.Ship_to_Postcode__c = '';
        resetSO.Ship_to_Factory__c = '';
        upsert resetSO;
    }


    //wrapper for cartDetails on shipmentPage 
    public class shipWrapper{
        @AuraEnabled
        public Sales_Order_Line_Items__c soli;
        @AuraEnabled
        public List<Product_Bundle__c> bundleProducts;        
    }

    //wrapper for address
    public class addressWrapper
    { 
        @AuraEnabled
        public List<Ship_Bill_Address__c> billAddList;
        @AuraEnabled
        public List<Ship_Bill_Address__c> shipAddList;
        @AuraEnabled
        public List<String> shipTermList;
        @AuraEnabled
        public boolean SuzhouFlag;
        @AuraEnabled
        public String defaultCompany;
        @AuraEnabled
        public String defaultCurrency;
        @AuraEnabled
        public List<String> seasonsList;
        @AuraEnabled
        public List<String> seasonsYearList;
        @AuraEnabled
        public List<String> divisionList;
        @AuraEnabled
        public Sales_Order__c protoSO;
        @AuraEnabled
        public List<String> companyPicklist;
        @AuraEnabled
        public List<String> currencyPicklist;
        @AuraEnabled
        public List<String> deliveryPicklist;
        @AuraEnabled
        public List<EmailTemplate> templateList;
    } 
}