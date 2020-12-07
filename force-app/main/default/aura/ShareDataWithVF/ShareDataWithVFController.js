({
	doInit : function(component) {
       
        var visualforceDomain = "https://" + component.get("v.visualforceDomain");
        /**
         * Adding a new event listner on window object
         * to listen for message event
         **/
        
        window.addEventListener("message", function(event) {
            //Check if origin is not your org's my domain url, in this case, simply return out of function
            if (visualforceDomain.indexOf(event.origin) == -1) {
                // Not the expected origin: reject message!
                console.error('Discarding Message | Message received from invalid domain: ',event.origin);
                return;
            }
            // Handle the message event here
            console.log('Lightning Gets: ', event.data);
            document.querySelector('#allMessages').innerHTML += '<p>'+event.data+'</p>';
        }, false);
    },
    
    /**
     * This function will be sending the data to visualforce page's window
     * object using postMessage function
     * */
   sendToVF : function(component, event, helper) {
      
		console.log('Lightning Sends: ', component.get("v.GetName"));
        const visualforceDomain = 'https://'+component.get('v.visualforceDomain');
        //Visualforce Page's iframe window object
        const vfWindow = component.find("vfFrame").getElement().contentWindow;
		//Sending message using postMessage function
		//If sending an json object, its better to stringify first and send the object
		var strName = component.get("v.GetName");
       var strUser = component.get("v.GetProductcode");
        var strUserEmail = component.get("v.GetUserEmail");
       var strsearchres = component.get("v.Getsearchres");
      // alert('strUser :'+strUser);
       //alert('strUserEmail :'+strUserEmail);
       //alert('strName :'+strName);
      // alert('strsearchres :'+strsearchres);
       /* if (strsearchres.charAt(0) === '"' && strsearchres.charAt(strsearchres.length -1) === '"')
{
    console.log(strsearchres.substr(1,strsearchres.length -2));
    var substrsearch = strsearchres.substr(1,strsearchres.length -2);
    //alert('substrsearch :'+substrsearch);
}*/
		if (strName.charAt(0) === '"' && strName.charAt(strName.length -1) === '"')
{
    console.log(strName.substr(1,strName.length -2));
    var substr = strName.substr(1,strName.length -2);
}
       if (strUser.charAt(0) === '"' && strUser.charAt(strUser.length -1) === '"')
{
    console.log(strUser.substr(1,strUser.length -2));
    var substrprod = strUser.substr(1,strUser.length -2);
}
       if (strUserEmail.charAt(0) === '"' && strUserEmail.charAt(strUserEmail.length -1) === '"')
{
    console.log(strUserEmail.substr(1,strUserEmail.length -2));
    var substrusr = strUserEmail.substr(1,strUserEmail.length -2);
}
     
        //component.find('submit').click();
        vfWindow.postMessage(substr + "," + substrprod +  "," + substrusr, visualforceDomain);
        //vfWindow.postMessage(strUser, visualforceDomain);
      // vfWindow.postMessage(substrusr, visualforceDomain);
        //resetting my text box with blank value
        component.set("v.message", "");
	},
    
    act : function(component, event, helper) {
    var showName = event.getParam("eventAttributeName");
        var showUserEmail = event.getParam("eventAttributeuser");
        // alert('showName :'+showName);
         //alert('showUserId :'+showUserId);
        // alert('showUserEmail :'+showUserEmail);
        // alert('showSearchResult :'+showSearchResult);
      var str=   JSON.stringify(showName.Name);
       //  alert('str :'+str);
        var str1 = JSON.stringify(showName.ProductCode);
        // alert('str1 :'+str1);
                  var strusr = JSON.stringify(showUserEmail);
        // alert('strusr :'+strusr);
        
        
    component.set("v.GetName", str);
        component.set("v.GetProductcode", str1);
         component.set("v.GetUserEmail", strusr);
       // $A.get("e.force:sendToVF").fire();
        var action = component.get('c.sendToVF');
        $A.enqueueAction(action);
        
},
    
   /*  actsearch : function(component, event, helper) {
    var showName = event.getParam("eventAttributeName");
         var showUserId = event.getParam("eventAttributeCustId");
         var showUserEmail = event.getParam("eventAttributeuser");
         var showSearchResult = event.getParam("eventAttributeSearch");
         alert('showName :'+showName);
         //alert('showUserId :'+showUserId);
         //alert('showUserEmail :'+showUserEmail);
         //alert('showSearchResult :'+showSearchResult);
      var strser=   JSON.stringify(showName.Name);
        // alert('strser :'+strser);
        var str1 = JSON.stringify(showName.ProductCode);
         //alert('str1 :'+str1);
         var strusr = JSON.stringify(showUserEmail);
         //alert('strusr :'+strusr);
        
    component.set("v.Getsearchres", strser);
        
       // $A.get("e.force:sendToVF").fire();
        var action = component.get('c.sendToVF');
        $A.enqueueAction(action);
        
},*/
    onRecordSubmit: function (component, event, helper) 
{   
    component.find('myForm').submit();
},
})