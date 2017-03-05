function msg(title, message){
  chrome.notifications.create(
    'name-for-notification', {   
      type: 'basic', 
      iconUrl: 'icon48.png', 
      title: title, 
      message: message
    }, 
    function() {}  
  ); 
}

var demoSettings =  {
  "Deep Auto Fill Chrome Demo" : {
    "randomLocale" : "de",
    "fields" : [
      {
        "selector" : "#textbox2",
        "random": "A bunch of random values: {{name.lastName}}, {{name.firstName}} {{name.suffix}}"
      },
      {
        "selector" : "input[name=textbox1]",
        "random": "A bunch of another random values: {{internet.email}}, {{helpers.createCard}} {{address.secondaryAddress}}",
        "static" : "A static value"
      },
      {
        "selector" : "#textbox4",
        "static" : "A static value"
      } 
    ]
  }
}


jQuery(function($){
  var text = localStorage.settings ? localStorage.settings : JSON.stringify(demoSettings, null, '\t');
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setValue(text);
  editor.commands.addCommand({
      name: 'save_settings',
      bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
      exec: function(editor) {
        try {
          var data = editor.session.getValue();
          var parsedData = JSON.parse(data); // try it to see if setting are valid
          localStorage.settings = data;  
          chrome.runtime.reload();
          msg("Settings saved successfully", "☑️"); // error in the above string (in this case, yes)!
        } catch(e) {
          msg("⚠️ Error", e); // error in the above string (in this case, yes)!
        }
      }
  })
});

 