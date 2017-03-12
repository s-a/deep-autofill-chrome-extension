

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function randomInt(min,max)
{
    var result = Math.floor((Math.random() * max) + min);
    return result;
}

var htmlInputTypes = {
  "color" : function(){
    return '#'+pad(Math.floor(Math.random()*16777215).toString(16), 6);
  },
  "date" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var result = [
      rndDate.getFullYear(),
      "-",
      pad(rndDate.getMonth() + 1, 2),
      "-",
      pad(rndDate.getDay() + 1, 2), 
    ].join('');
    return result;
  },
  "datetime-local" : "",
  "email" : "internet.email",
  "month" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var result = [
      rndDate.getFullYear(),
      "-",
      pad(rndDate.getMonth() + 1, 2)
    ].join('');
    return result;
  },
  "number" : "random.number",
  "range" : function(el){
    var minValue= parseInt($(el).prop('min'), 10);
    var maxValue = parseInt($(el).prop('max'), 10);
    return randomInt(minValue, maxValue);
  },
  "search" : "lorem.words",
  "tel" : "phone.phoneNumber",
  "url" : "internet.url",
  "week" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var onejan = new Date(rndDate.getFullYear(),0,1);
    var weeknumber = Math.ceil((((rndDate - onejan) / 86400000) + onejan.getDay()+1)/7);
    var result = rndDate.getFullYear() + "-W" + pad(weeknumber, 2);
    return result;
  },
  "radio" : selectRandomRadio,
  "checkbox" : function(el){
    var randomBoolean = Math.random() >= 0.5;
    $(el).attr("checked", randomBoolean);
  }
};

var fakerCultures = ["az", "cz", "de", "de_AT", "de_CH", "en", "en_AU", "en_BORK", "en_CA", "en_GB", "en_IE", "en_IND", "en_US", "en_au_ocker", "es", "es_MX", "fa", "fr", "fr_CA", "ge", "id_ID", "it", "ja", "ko", "nb_NO", "nep", "nl", "pl", "pt_BR", "ru", "sk", "sv", "tr", "uk", "vi", "zh_CN", "zh_TW"];


function selectRandomRadio(el){
  var groupName = $(el).attr("name");
  var radios = $("input:radio:enabled[name='" + groupName + "']");
  var idx = randomInt(0, radios.length - 1);
  $(radios[idx]).prop("checked", true);
}

var randomizeInputValue = function(el){
  if ($(el).length != 0){
    switch( $(el)[0].nodeName.toLowerCase() ) {
      case "input":
        var type = $(el).attr('type');
        var value = faker.lorem.word();
        var fakerMethod = htmlInputTypes[type];
        if (fakerMethod){
          if (isFunction(fakerMethod)){
            value = fakerMethod(el);
          } else {
            value = faker.fake("{{" + fakerMethod + "}}")
          }
        }
        $(el).focus().val(value);
        break;
      case "select":
        var opts = $(el)[0].options;
        var idx = randomInt(0, opts.length - 1);
        var val = opts[idx].value;
        $(el).focus().val(val);
        break; 
      case "textarea":
        $(el).focus().val(faker.lorem.sentences());
        break;
    }  
  }
};

chrome.extension.sendRequest({
  "action": "getOptions",
  "args": []
}, function(response){
  if (deepAutofillChromeExtensionSettings){
    if (deepAutofillChromeExtensionSettings.randomLocale){
      console.info("setting locale", deepAutofillChromeExtensionSettings.randomLocale);
      faker.locale = deepAutofillChromeExtensionSettings.randomLocale
    }
    for(var i = 0; i < deepAutofillChromeExtensionSettings.fields.length; i++){
      var field = deepAutofillChromeExtensionSettings.fields[i];
      var value = faker.lorem.word();
      if (field.static){
        value = field.static;
      }
      if (field.random){
        value = faker.fake(field.random);
      }
      
      if (!field.static && !field.random){
        randomizeInputValue($(field.selector));
      } else {
        $(field.selector).focus().val(value);  
      }
      console.debug(field.selector, value);   
    }
  } else {
    $("input:enabled, select:enabled, textarea:enabled").not(':button,:hidden,input[type=submit],input[readonly]').each(function(){
      randomizeInputValue(this);
    }); 
  }
});  