var currentSetupKey = null;
var currentTabId = null;
var core = { 
  "getOptions": function(){
    var result;
    try{
      result = JSON.parse(localStorage.settings);
      result = result[currentSetupKey];
    } catch(e){
      result = null;
    }
    return result;
  },
}
 

function fill(info,tab) {
  chrome.tabs.executeScript(null, { file: "jquery-1.8.2.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "faker.js" }, function() {
        chrome.tabs.executeScript(null, { file: "run.js" }, function () {
          chrome.notifications.create(
              'name-for-notification',{   
              type: 'basic', 
              iconUrl: 'icon48.png', 
              title: "OK", 
              message: "Your formular was filled by a smart but wild monkey!" 
              }, 
              function() {}  
            );
        });
    });       
  });       
}
   

window.onload = function(){
  var settings = (localStorage.settings ? JSON.parse(localStorage.settings) : {});


  var mainContextMenuItem = chrome.contextMenus.create({
    title: "Deep Auto Fill"
  });
  if (localStorage.settings !== undefined){
	  for(var key in settings){
	    if (settings.hasOwnProperty(key)){
	      var menuSetup = settings[key];
	      chrome.contextMenus.create({
	        title: key, 
	        contexts:["page"], 
	        onclick: function(info, tab){
	          currentSetupKey = key;
	          currentTabId = tab.id;
	          fill(info, tab)
	        },
	        parentId: mainContextMenuItem
	      });
	    }
	  }
	  for(var key in settings){
	    if (settings.hasOwnProperty(key)){
	      var menuSetup = settings[key];
	    }
	  }
  }

  chrome.contextMenus.create({
    title: "Deep Random Fill",
    contexts:["page"], 
    onclick: function(info, tab){
      currentSetupKey = null;
      currentTabId = tab.id;
      fill(info, tab)
    } 
  });
 

} 

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	if (sender.tab.status !== "loading"){
    var ret = (core[request.action] || function(){}).apply(this, request.args);
    sendResponse(ret);
	}
}); 
