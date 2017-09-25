chrome.runtime.onStartup.addListener(function(){
  BitTicker.setupExtension();
});
chrome.runtime.onInstalled.addListener(function(){
  BitTicker.setupExtension();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == chrome.runtime.getManifest().name) {
    BitTicker.getCurrentExchangeRate();
  }
});

var BitTicker = {
  setupExtension: function(receiver) {
    chrome.browserAction.setBadgeBackgroundColor({color: [0,0,0,128]});
    chrome.browserAction.setPopup({popup: "popup.html"});
    chrome.alarms.create(chrome.runtime.getManifest().name, 
      {when: Date.now(), periodInMinutes: 10}
    );
  },

  getCurrentExchangeRate: function() {
    console.log("Running at: " + new Date().toString());
    var request = new XMLHttpRequest();
    if (request == null) {
      console.error("Unable to create request");
    } else {
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          BitTicker.handleResponse(request.responseText);
        }
      }
      
      chrome.storage.local.get("current_units", function(response) {
        var units = response.current_units || "USD";
        chrome.storage.local.get("currency", function(response) {
          var currency = response.currency || "BTC";
          var url = "https://apiv2.bitcoinaverage.com/indices/global/ticker/" + currency + units;
          request.open("GET", url, true);
          request.send(null);
        });
      });
    }
  },

  handleResponse: function(response) {
    if (response.length == 0) {
      setBadge("---");
    } else {
      var results = JSON.parse(response);
      chrome.storage.local.get("current_units", function(response) {
        var units = response.current_units || "USD";
        var current_rate = Math.round(results.last).toString();
        console.log(current_rate + " " + units);
        BitTicker.setBadge(current_rate);
      });
    }
  },

  setBadge: function(current_rate) {
    chrome.browserAction.setBadgeText({text: current_rate});
    chrome.storage.local.set({'current_rate': current_rate});
  }
}
