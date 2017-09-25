var Popup = {
  get_selected: function() {
    chrome.storage.local.get('current_units', function(response){
      var current_units = response.current_units || "USD";
      var units = $("#" + current_units);
      if (units) {
        units.addClass("active");
      }
    })
    chrome.storage.local.get('currency', function(response){
      var current_currency = response.currency || "BTC";
      var currency = $("#" + current_currency);
      if (currency) {
        currency.addClass("active");
      }
    })
  },
  set_selected_currency: function(evt) {
    var target = $(evt.target);
    var new_selection = target.attr("id");
    $(".popup a.currency").removeClass("active");
    target.addClass("active");
    chrome.storage.local.set({'currency': new_selection}, function(){
      BitTicker.getCurrentExchangeRate();
    });
  }, 
  set_selected_units: function(evt) {
    var target = $(evt.target);
    var new_selection = target.attr("id");
    $(".popup a.units").removeClass("active");
    target.addClass("active");
    chrome.storage.local.set({'current_units': new_selection}, function(){
      BitTicker.getCurrentExchangeRate();
    });
  } 
}

$(document).ready(function(){
  Popup.get_selected();
  $(".popup div a.currency").on("click", Popup.set_selected_currency);
  $(".popup div a.units").on("click", Popup.set_selected_units);
});
