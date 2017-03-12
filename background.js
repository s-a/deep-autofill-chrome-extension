var currentSetupKey = null;
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
  chrome.tabs.executeScript(null, { file: "jquery-3.1.1.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "faker.js" }, function() {
      chrome.tabs.executeScript(null, {code: "var deepAutofillChromeExtensionSettings = " + JSON.stringify(core.getOptions()) + ";"}, function(){
        chrome.tabs.executeScript(null, { file: "run.js" }, function () {
          chrome.notifications.create(
            'name-for-notification',{   
              type: 'basic', 
              iconUrl: 'monkey48.png', 
              title: "OK", 
              message: "Your HTML form was just filled out by a smart but very wild monkey!" 
            }, 
            function() {}  
          );
        });
      });
    });       
  });       
}
function getScheme(info,tab) {
  chrome.tabs.executeScript(null, { file: "jquery-3.1.1.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "faker.js" }, function() {
      chrome.tabs.executeScript(null, {code: "var deepAutofillChromeExtensionSettings = " + JSON.stringify(tab.url) + ";"}, function(){
        chrome.tabs.executeScript(null, { file: "scheme.js" }, function () {
          
          var optionsUrl = chrome.extension.getURL('options.html');
          chrome.tabs.create({ 'url': optionsUrl });
          chrome.notifications.create(
            'name-for-notification',{   
              type: 'basic', 
              iconUrl: 'monkey48.png', 
              title: "Selectors copied", 
              message: "Simply paste the new configuration to a prefered position in you settings." 
            }, 
            function() {}  
          );
        });
      });
    });       
  });       
}
   
 
  var settings = (localStorage.settings ? JSON.parse(localStorage.settings) : {});
  var mainContextMenuItem = chrome.contextMenus.create({
    title: "Auto Fill"
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
    title: "Random",
    contexts:["page"], 
    onclick: function(info, tab){
      currentSetupKey = null;
      fill(info, tab)
    } 
  });
   
  chrome.contextMenus.create({
    title: "Get Scheme",
    contexts:["page"], 
    onclick: function(info, tab){
      getScheme(info, tab)
    } 
  }); 
   
  chrome.contextMenus.create({
    title: "Options",
    contexts:["page"], 
    onclick: function(info, tab){
      var optionsUrl = chrome.extension.getURL('options.html');
      chrome.tabs.create({ 'url': optionsUrl });
    } 
  }); 


chrome.browserAction.onClicked.addListener(
  function(tab) {
      currentSetupKey = null;
      // chrome.tabs.sendMessage(tab.id,{"message":"hide"});
      fill(null, tab)
  }
);