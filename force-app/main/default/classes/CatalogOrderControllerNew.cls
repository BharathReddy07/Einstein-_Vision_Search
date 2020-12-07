/*=====================================================================================================
Author     : Varun
Company    : Kasetti Technologies Pvt Ltd.
Date       : 18th June 2020
Description: CatalogOrderController class helps to handle following 

* Handle the operation search keyword.
* Fetch the Product,Product description from and Product Object.
* Save to the Sales_Order__c Order and Sales_Order_Line_Items__c of object as a cart.

=======================================================================================================*/

public with sharing class CatalogOrderControllerNew {
    
    //Getting userId of the logged in user which will be stored in onselectcustomeid attribute in cmp.
    @AuraEnabled
    public static Id getUserId() {
        Id currentuserId = UserInfo.getUserId();
        System.debug('currentuserId:'+currentuserId);
        return currentuserId;
    }


    //Getting list of products on init.
    @AuraEnabled
    public static List<Product2> listProducts(String pageSize, String pageNumber) {
        system.debug('pageSize :'+pageSize 	);
         system.debug('pageNumber :'+pageNumber	);
        /*Product List will be filtered based on PriceBook because different PriceBook may be 
        assigned for a perticular uer/group/role.*/
        
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
        System.debug('priceBookId:'+priceBookId);

        List<PricebookEntry> priceBookEntryItems = [select Pricebook2Id,Product2Id,ProductCode 
                                                    from PricebookEntry where 
                                                    Pricebook2Id =:priceBookId];
        System.debug('priceBookEntryItems:'+priceBookEntryItems);

        Set<Id> uniquePrdId = new Set<Id>();
        if (priceBookEntryItems <> null && priceBookEntryItems.size() > 0) {
            for (PricebookEntry priceEntry : priceBookEntryItems) {
                uniquePrdId.add(priceEntry.Product2Id);
            }
        }
       /* List<Product2> productList = [SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c,
                                      Product_image_url__c,Product_Type__c FROM Product2 WHERE Id in :uniquePrdId]; */
        List<Product2> productList = new List<Product2>();
        
      
          
       // ApexPages.StandardSetController ssc = new ApexPages.StandardSetController(Database.getQueryLocator('SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c, Product_image_url__c,Product_Type__c FROM Product2 WHERE Id in :uniquePrdId'));
       
        ApexPages.StandardSetController ssc = new ApexPages.StandardSetController(Database.getQueryLocator('SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c, Product_image_url__c,Product_Type__c FROM Product2 where MagnetProduct__c=false'));
        ssc.setpagesize(Integer.valueOf(pageSize));
        ssc.setPageNumber(Integer.valueOf(pageNumber));
        productList = (List<Product2>)ssc.getRecords();
        System.debug('productList:'+productList);
        return productList;
    }

    //Searching specific products based on enetred keyword.
    @AuraEnabled
    public static List<Product2> searchProducts(String SearchKeyword) {       
        
        //qryPbProWhereClause+=' AND Keywords__c Like \''+SearchKeyword+'\'';
        String queryString = 'SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c,Product_image_url__c FROM Product2';
        String queryWhereClause = ' WHERE Id in :uniquePrdId';
        
        
        if(String.isNotBlank(SearchKeyword)){
            System.debug('SearchKeywordBefore:'+SearchKeyword);        
            SearchKeyword = '%'+ SearchKeyword +'%';
            queryWhereClause +=' AND (Description Like \''+SearchKeyword+'\')';            
        }
        
        queryString = queryString + queryWhereClause;
        System.debug('finalqueryString:'+queryString);
        
        

        /*Product List will be filtered based on PriceBookEntry list because different PriceBook may be 
        assigned for a perticular uer/group/role.*/
        List<PricebookEntry> priceBookEntryItems = [select Pricebook2Id,Product2Id,ProductCode 
                                                    from PricebookEntry];
        System.debug('priceBookEntryItems:'+priceBookEntryItems);

        Set<Id> uniquePrdId = new Set<Id>();
        if (priceBookEntryItems <> null && priceBookEntryItems.size() > 0) {
            for (PricebookEntry priceEntry : priceBookEntryItems) {
                uniquePrdId.add(priceEntry.Product2Id);
            }
        }
        system.debug('uniquePrdId :'+uniquePrdId);
       /* List<Product2> productSearched = [SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c,
                                         Product_image_url__c FROM Product2 WHERE Description LIKE :keyword AND Id in :uniquePrdId];*/
         /*List<Product2> productSearched = [SELECT Name,ProductCode,Family,Description,Quantity_temp_holder__c,
                                         Product_image_url__c FROM Product2 WHERE Description LIKE :keyword AND Id in :uniquePrdId];*/
        
        List<Product2> productSearched = (Database.query(queryString));
        
        System.debug('productSearched:'+productSearched);                                
        return productSearched;
    }

    /*
    Method is called on click of 'Add to Cart'
    this will store added product to salesOrderLineItem object.
    */
    @AuraEnabled
    public static Boolean saveToCart(String userId, Product2 product, Double quantity) {
        System.debug('userId:'+userId+' '+'quantity:'+quantity);
        System.debug('product:'+product);
            Boolean insertSuccess = true;
            try {
                if(product.Product_Type__c == 'Bundle'){
                    List<Sales_Order__c> SOList=new List<Sales_Order__c>(); 
                    SOList =[select id from Sales_Order__c where UserId__c =:userId and Status__c ='New Order'];
                    system.debug('SOList>>'+SOList);
                    system.debug('SOList.size>>'+SOList.size());

                    if(SOList.size()==0){ // if no data on the respective customer then insert the new SO and SOLI
                        Sales_Order__c So=new Sales_Order__c();
                        So.UserId__c = userId;
                        So.Status__c = 'New Order';
                        insert So;
                        Sales_Order_Line_Items__c SOli = new Sales_Order_Line_Items__c();
                        SOli.Sales_Order__c = So.Id;
                        SOli.Product__c = product.Id;
                        SOli.Product_Type__c = product.Product_Type__c;
                        SOli.Product_Name__c = product.Name;
                        SOli.Product_Code__c = product.ProductCode;
                        SOli.Product_Description__c = product.Description;
                        SOli.Product_image_url__c = product.Product_image_url__c;
                        SOli.Quantity__c = quantity;
                        insert SOli;
                    } else {
                        // insert only SOLI
                        List<Sales_Order_Line_Items__c> SoliList=new List<Sales_Order_Line_Items__c>();
                        SoliList =[select id, name,Sales_Order__c,Product_Code__c,Product_Description__c,
                                  Quantity__c from Sales_Order_Line_Items__c where 
                                  Sales_Order__c=:SOList[0].id and Product_Code__c=:product.ProductCode
                                  and Product_Type__c =:product.Product_Type__c];                    
                        system.debug('SoliList>>>>'+SoliList);
                        system.debug('SoliList.size>>'+SoliList.size());

                        if(SoliList.size()==0){ // if no data on the respective productCode then insert the SOLI
                            Sales_Order_Line_Items__c soline=new Sales_Order_Line_Items__c();
                            soline.Sales_Order__c=SOList[0].id;
                            soline.Product__c = product.Id;
                            soline.Product_Type__c = product.Product_Type__c;
                            soline.Product_Name__c = product.Name;
                            soline.Product_Code__c = product.ProductCode;
                            soline.Product_Description__c = product.Description;
                            soline.Product_image_url__c = product.Product_image_url__c;
                            soline.Quantity__c = quantity;
                            insert soline;
                        } else {
                            //if data is there upsert thesame SOLI
                            system.debug('SoliList in else >>'+SoliList[0]);
                            SoliList[0].Quantity__c = quantity;
                            upsert SoliList[0];
                        }

                    }
                } else{
                
                List<Sales_Order__c> SOList=new List<Sales_Order__c>(); 
                SOList =[select id from Sales_Order__c where UserId__c =:userId and Status__c ='New Order'];
                system.debug('SOList>>'+SOList);
                system.debug('SOList.size>>'+SOList.size());

                if(SOList.size()==0){ // if no data on the respective customer then insert the new SO and SOLI
                    Sales_Order__c So=new Sales_Order__c();
                    So.UserId__c = userId;
                    So.Status__c = 'New Order';
                    insert So;
                    Sales_Order_Line_Items__c SOli = new Sales_Order_Line_Items__c();
                    SOli.Sales_Order__c = So.Id;
                    SOli.Product__c = product.Id;
                    SOli.Product_Type__c = product.Product_Type__c;
                    SOli.Product_Name__c = product.Name;
                    SOli.Product_Code__c = product.ProductCode;
                    SOli.Product_Description__c = product.Description;
                    SOli.Product_image_url__c = product.Product_image_url__c;
                    SOli.Quantity__c = quantity;
                    insert SOli;
                } else {
                    // insert only SOLI
                    List<Sales_Order_Line_Items__c> SoliList=new List<Sales_Order_Line_Items__c>();
                    SoliList =[select id, name,Sales_Order__c,Product_Code__c,Product_Description__c,
                              Quantity__c from Sales_Order_Line_Items__c where 
                              Sales_Order__c=:SOList[0].id and Product_Code__c=:product.ProductCode
                              and Product_Type__c =:product.Product_Type__c];                    
                    system.debug('SoliList>>>>'+SoliList);
                    system.debug('SoliList.size>>'+SoliList.size());

                    if(SoliList.size()==0){ // if no data on the respective productCode then insert the SOLI
                        Sales_Order_Line_Items__c soline=new Sales_Order_Line_Items__c();
                        soline.Sales_Order__c=SOList[0].id;
                        soline.Product__c = product.Id;
                        soline.Product_Type__c = product.Product_Type__c;
                        soline.Product_Name__c = product.Name;
                        soline.Product_Code__c = product.ProductCode;
                        soline.Product_Description__c = product.Description;
                        soline.Product_image_url__c = product.Product_image_url__c;
                        soline.Quantity__c = quantity;
                        insert soline;
                    } else {
                        //if data is there upsert thesame SOLI
                        system.debug('SoliList in else >>'+SoliList[0]);
                        SoliList[0].Quantity__c = quantity;
                        upsert SoliList[0];
                    }
                }
            }
            } catch (DmlException e) {
                insertSuccess = false;
                System.debug('Failed to insert:' + e);
            }
            return insertSuccess;
    }

    @AuraEnabled
    public static Integer getCartDataCount(String customerid) {

        List<Sales_Order_Line_Items__c> SOList = [SELECT Id FROM Sales_Order_Line_Items__c WHERE
                                                 Sales_Order__r.UserId__c =:customerid AND 
                                                 Sales_Order__r.Status__c = 'New Order'];
        system.debug('SOList>>'+SOList);
        Integer count= SOList.size();
        system.debug('count>>>'+count);
        return count;
    }
    
     /*this will store Fetch the login user information .*/
    
      @AuraEnabled
    public static user getuserEmail(String customerid) {
        system.debug('customerid :'+customerid);

        user userList = [SELECT Id,email FROM user WHERE  id=:customerid];
                                               
        system.debug('userList>>'+userList);
       
        return userList;
    }
    
      @AuraEnabled
    public static user getuserEmail1(String customerid) {
        system.debug('customerid :'+customerid);

        user userList1 = [SELECT Id,email FROM user WHERE  id=:customerid];
                                               
        system.debug('userList1>>'+userList1);
       
        return userList1;
    }
    @AuraEnabled
    public static probabilities predictInternal(string sample) {
      // String sample ='https://einstein.ai/images/generalimage.jpg';
         //encodingutil.OPU5IRK35NSWZDYJ6FFMJNWSMM -- for kasettiṅṅ
       // String encodedString = EncodingUtil.base64Encode(blobData);ZH7WCD76ML6NUQAWX2A2Q7IYLQ formagent
            String model='OPU5IRK35NSWZDYJ6FFMJNWSMM';
             boolean isBase64= true ;
     string contentType = HttpFormBuilder.GetContentType();
        //  Compose the form
        ContentVersion base64Content = [SELECT  Title, VersionData FROM    ContentVersion WHERE   Title = 'einstein_platform' LIMIT 1 ];
       // Einstein_Settings__mdt einsteinSettings = [Select DeveloperName, Label , Account_Email__c , Service_EndPoint__c , Token_EndPoint__c 
                                                  // from Einstein_Settings__mdt where DeveloperName ='Intent' Limit 1]  ;   
        DateTime tokenExpireTime = DateTime.now().addMinutes(30);
        String tokenExpireTimeinUnixFormate = ''+tokenExpireTime.getTime()/1000;
        
        String keyContents = base64Content.VersionData.tostring();
        keyContents = keyContents.replace('-----BEGIN RSA PRIVATE KEY-----', '');
        keyContents = keyContents.replace('-----END RSA PRIVATE KEY-----', '');
        keyContents = keyContents.replace('\n', '');
        JWT jwt = new JWT('RS256');
        jwt.pkcs8 = keyContents; 
        jwt.iss = 'developer.force.com';
        jwt.sub = 'einsteinbot123@gmail.com' ;
        jwt.aud = 'https://api.einstein.ai/v2/oauth2/token';
        jwt.exp = '3600';
        String access_token = JWTBearerFlow.getAccessToken('https://api.einstein.ai/v2/oauth2/token', jwt);
            system.debug(access_token);
     
     string form64 = '';

        form64 += HttpFormBuilder.WriteBoundary();
        form64 += HttpFormBuilder.WriteBodyParameter('modelId',model);
        form64 += HttpFormBuilder.WriteBoundary();
        if(isBase64) {
         form64 += HttpFormBuilder.WriteBodyParameter('sampleBase64Content', sample);
        } else {
         form64 += HttpFormBuilder.WriteBodyParameter('sampleLocation', sample);
        }
        form64 += HttpFormBuilder.WriteBoundary(HttpFormBuilder.EndingType.CrLf);

        blob formBlob = EncodingUtil.base64Decode(form64);
        string contentLength = string.valueOf(formBlob.size());
        //  Compose the http request
        HttpRequest httpRequest = new HttpRequest();

        httpRequest.setBodyAsBlob(formBlob);
        httpRequest.setHeader('Cache-Control', 'no-cache');
        httpRequest.setHeader('Connection', 'keep-alive');
        httpRequest.setHeader('Content-Length', contentLength);
        httpRequest.setHeader('Content-Type', contentType);
        httpRequest.setMethod('POST');
        httpRequest.setTimeout(120000);
        httpRequest.setHeader('Authorization','Bearer ' + access_token);
        httpRequest.setEndpoint('https://api.einstein.ai/v2/vision/predict');

        Http http = new Http();
        //List<Prediction> predictions = new List<Prediction>();
        probabilities probabilitie = new probabilities();
              HTTPResponse res = http.send(httpRequest);
            system.debug(res.getBody());
    list<string> labels= new list<string>();
              if (res.getStatusCode() == 200) {
                  System.JSONParser parser = System.JSON.createParser(res.getBody());
                  String label ='';
        Decimal probability = 0 ;
                  while(parser.nextToken()!= null){
                      if(parser.getText()=='label'){
                          parser.nextToken();
                          string data = parser.getText();
                // system.debug(data);
               labels.add(data);
                      }
                      
                   probabilitie.label=labels;   
                  }
       
        system.debug(probabilitie);
       
             
              } return probabilitie ;
}
    public  class probabilities {
      @AuraEnabled
        public list<String> label {get;set;}
        

       
}
}