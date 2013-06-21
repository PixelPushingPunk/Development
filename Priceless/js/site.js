function StripTags(html) {
	return html.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "");
}
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
        return sParameterName[1];
    }
  }
}

function Offer(data) {
	// Data - I'm being lazy here and not explicitly mapping the object!
	
  // We do need to tidy / reformat some bits
	data.OfferTitle = StripTags(data.OfferTitle);
	data.OfferSubtitle = StripTags(data.OfferSubtitle);
	
	return data;
}
function Category(data, allOffers) {
	// Data - I'm being lazy here and not explicitly mapping the object!

  // Tie into the offers here
  data.Offers = ko.observableArray([]);
  data.Offers($.grep(allOffers, function(offer){ return offer.Category == data.Id; }));
  
  // Version 1
  data.IsHidden = ko.observable();
  data.IsHidden(false);
  
	return data;
}

function CityViewModel(preFetch, postFetch, kill) {
	// Data
	var self = this;
	self.Name = null;
	self.Categories = ko.observableArray([]);
	self.Offers = ko.observableArray([]);
	
  if ($.isFunction(preFetch)) {
    preFetch(self);
  }
  
  self.Kill = function() {
    if ($.isFunction(kill)) {
      kill(self);
    }
  };
   
	// Load initial state from server
  $.getJSON("/js/data.json", function(allData) {
    jsonData = allData;
    
    var data = allData.Home;
    self.Name = data.Name;
    
    var mappedOffers = $.map(data.Offers, function(item) { return new Offer(item); });
    self.Offers($.grep(mappedOffers, function(item) { return item.OfferTitle != ""; }));
    
    var mappedCategories = $.map(data.Categories, function(item) { return new Category(item, self.Offers()); });
    self.Categories(mappedCategories);
    
    if ($.isFunction(postFetch)) {
      postFetch(self);
    }
  });
}
function PreFetchVersion1(cityVM) {
	// Version1 Data, Behaviours & Methods
  cityVM.VisibleCount = ko.observable();
  cityVM.VisibleCount(cityVM.Categories().length);  
  cityVM.VisibleCategories = 
    ko.computed(
      function() {
          return $.grep(cityVM.Categories(), function(category){ return category.IsHidden() != true; });
      }, 
      cityVM
    );
  
	cityVM.ChosenCategory = ko.observable();
	cityVM.ChosenOffer = ko.observable();
  cityVM.OffersScroller = null;
  
	cityVM.ToggleOffers = function(category) {
    if (cityVM.ChosenCategory() == null) {
      $.each(cityVM.Categories(), function(index, value) {
         if (value != category) {
            value.IsHidden(true);
         }
      });
    }
    else {
      cityVM.ChosenCategory(null);
      cityVM.ChosenOffer(null);
      $.each(cityVM.Categories(), function(index, value) {
        value.IsHidden(false);
      });
    }
  };
  cityVM.ShowOffer = function(offer) {
		cityVM.ChosenOffer(offer);
	};

  // Manual subscriptions
  cityVM.VisibleCategoriesChanging = cityVM.VisibleCount.subscribe(function(newValue) {
    cityVM.ChosenCategory(null);
    if (newValue !== 1) return;
    
    cityVM.ChosenCategory(cityVM.VisibleCategories()[0]);
    
    // Set up the nice scroller forcing a resize of the UI first...
    Resize();
    
    // Need to make sure we destroy the scroller to prevent
    // it jumping around like crazy.
    if (cityVM.OffersScroller != null) {
      cityVM.OffersScroller.destroy();
      cityVM.OffersScroller = null;
    }
    var offersWrapper = $("#version1 .offers-wrapper").get(0);
    cityVM.OffersScroller = new iScroll(offersWrapper, { hScroll: false, hScrollbar: false, vScrollbar: false });
  });
  
  // Animation callbacks for the categories list
  cityVM.ShowCategory = function(elem) { 
    if (elem.nodeType === 1) {
      $(elem).hide().slideDown(400, function() { cityVM.VisibleCount(cityVM.VisibleCount()+1); });
    }
  };
  cityVM.HideCategory = function(elem) {
    if (elem.nodeType === 1) {
      $(elem).slideUp(200, function() { $(elem).remove(); cityVM.VisibleCount(cityVM.VisibleCount()-1); });
    }
  };
}
function PostFetchVersion1(cityVM) {
}
function KillVersion1(cityVM) {
  cityVM.VisibleCategoriesChanging.dispose();
  cityVM.VisibleCategoriesChanging = null;
  
  cityVM.VisibleCount = null;
  cityVM.VisibleCategories = null;
	cityVM.ChosenCategory = null;
	cityVM.ChosenOffer = null;

  // Destroy all scrollers
  if (cityVM.OffersScroller != null) {
    cityVM.OffersScroller.destroy();
    cityVM.OffersScroller = null;
  }
  
  // Destroy all methods
  cityVM.ToggleOffers = null;
  cityVM.ShowOffer = null;
  cityVM.ShowCategory = null;
  cityVM.HideCategory = null;
}

function PreFetchVersion2(cityVM) {
	// Version2 Data, Behaviours & Method
  cityVM.CategoriesScroller = null;
  cityVM.OffersScrollers = [];
  cityVM.SetupScrollers = function(){
    // Destroy all scrollers
    $.each(cityVM.OffersScrollers, function(i, oScroll) {
      oScroll.Scroller.destroy();
      oScroll = null;
    });
    cityVM.OffersScrollers = [];
    
    if (cityVM.CategoriesScroller != null) {
      cityVM.CategoriesScroller.destroy();
      cityVM.CategoriesScroller = null;
    }
    
    // Rebuild all scrollers
    $.each(cityVM.Categories(), function(i, category) {
      var offersWidth = 0;
      $("#" + category.TextId + " ul.offers-list li").each(function() {
        offersWidth += $(this).outerWidth(true);
      });
      $("#" + category.TextId + " ul.offers-list").width(offersWidth);

      var categoryWrapper = document.getElementById(category.TextId);
      if (categoryWrapper != null) {
        var scroller = new iScroll(categoryWrapper, { hScroll: true, vScroll: false, hScrollbar: false, vScrollbar: false });
        cityVM.OffersScrollers.push(scroller);
      }
    });
    
    var categoriesHeight = 0;
    $("#version2-categories-wrapper ul.categories-list > li").each(function() {
      categoriesHeight += $(this).outerHeight(true);
    });
    $("#version2-categories-wrapper ul.categories-list").height(categoriesHeight);
    cityVM.CategoriesScroller = new iScroll("version2-categories-wrapper", { hScroll: false, vScroll: true, hScrollbar: false, vScrollbar: false });
    setTimeout(
      function() { cityVM.CategoriesScroller.refresh(); },
      0
    );
  }
}
function PostFetchVersion2(cityVM) { 
  Resize(); 
  cityVM.SetupScrollers(); 
}
function KillVersion2(cityVM) {
  // Destroy all scrollers
  $.each(cityVM.OffersScrollers, function(i, oScroll) {
    if (oScroll.Scroller != null && oScroll.Scroller != undefined && $.isFunction(oScroll.Scroller.destroy)) { 
      oScroll.Scroller.destroy();
      oScroll.Scroller = null;
    }
    oScroll = null;
  });
  cityVM.OffersScrollers = [];
  if (cityVM.CategoriesScroller != null) {
    cityVM.CategoriesScroller.destroy();
    cityVM.CategoriesScroller = null;
  }
  
  // Destroy all methods
  cityVM.SetupScrollers = null;
}

function PreFetchVersion2Detail(cityVM) { 
  cityVM.SelectedCategory = ko.observable(); 
  cityVM.SelectedOffer = ko.observable(); 
  cityVM.NextOffer = ko.observable();
}
function PostFetchVersion2Detail(cityVM) {
  Resize();
  var offerId = GetURLParameter("offerId");
  var offer = $.grep(cityVM.Offers(), function(offer){ return offer.OfferID == offerId; })[0];
  var category = $.grep(cityVM.Categories(), function(category){ return category.Id == offer.Category; })[0];

  var nextOfferIndex = cityVM.Offers.indexOf(offer)+1;
  if (nextOfferIndex < cityVM.Offers().length) {
    var nextOffer = cityVM.Offers()[nextOfferIndex];
    if (nextOffer != null && nextOffer.Category === offer.Category) {
      cityVM.NextOffer(nextOffer);
    }
  }

  cityVM.SelectedCategory(category);
  cityVM.SelectedOffer(offer);
}
function KillVersion2Detail(cityVM) {
  cityVM.SelectedCategory = null; 
  cityVM.SelectedOffer = null; 
  cityVM.NextOffer = null;
}

function PreFetchVersion3(cityVM) {
	// Version3 Data, Behaviours & Method
  cityVM.SelectedCategory = ko.observable();
  cityVM.SelectedOffer = ko.observable();
  cityVM.CategoriesScroller = null;
  cityVM.OffersScrollers = [];  
  cityVM.SetupScrollers = function(){
    // Destroy all scrollers
    $.each(cityVM.OffersScrollers, function(i, oScroll) {
      oScroll.Scroller.destroy();
      oScroll = null;
    });
    cityVM.OffersScrollers = [];
    
    if (cityVM.CategoriesScroller != null) {
      cityVM.CategoriesScroller.destroy();
      cityVM.CategoriesScroller = null;
    }
    
    // Rebuild all scrollers
    $.each(cityVM.Categories(), function(i, category) {
      var offersWidth = 0;
      $("#" + category.TextId + " ul.offers-list li").each(function() {
        offersWidth += $(this).outerWidth(true);
      });
      $("#" + category.TextId + " ul.offers-list").width(offersWidth);

      var categoryWrapper = document.getElementById(category.TextId);
      if (categoryWrapper != null) {
        var scroller = new iScroll(categoryWrapper, { hScroll: true, vScroll: false, hScrollbar: false, vScrollbar: false });
        cityVM.OffersScrollers.push(scroller);
      }
    });
    
    var categoriesHeight = 0;
    $("#version3-categories-wrapper ul.categories-list > li").each(function() {
      categoriesHeight += $(this).outerHeight(true);
    });
    $("#version3-categories-wrapper ul.categories-list").height(categoriesHeight);
    cityVM.CategoriesScroller = new iScroll("version3-categories-wrapper", { hScroll: false, vScroll: true, hScrollbar: false, vScrollbar: false });
    setTimeout(
      function() { cityVM.CategoriesScroller.refresh(); },
      0
    );
  }

  // Animation callbacks for the categories list
  cityVM.ShowOffer = function(offer) {
    var category = $.grep(cityVM.Categories(), function(category){ return category.Id == offer.Category; })[0];
    cityVM.SelectedCategory(category);
    cityVM.SelectedOffer(offer);
  }
  cityVM.HideOffer = function() {
    cityVM.SelectedCategory(null);
    cityVM.SelectedOffer(null);
  }
}
function PostFetchVersion3(cityVM) { 
  Resize(); 
  cityVM.SetupScrollers(); 
}
function KillVersion3(cityVM) {
  cityVM.SelectedCategory = null;
  cityVM.SelectedOffer = null;

  // Destroy all scrollers
  $.each(cityVM.OffersScrollers, function(i, oScroll) {
    if (oScroll.Scroller != null && oScroll.Scroller != undefined && $.isFunction(oScroll.Scroller.destroy)) { 
      oScroll.Scroller.destroy();
      oScroll.Scroller = null;
    }
    oScroll = null;
  });
  cityVM.OffersScrollers = [];
  if (cityVM.CategoriesScroller != null) {
    cityVM.CategoriesScroller.destroy();
    cityVM.CategoriesScroller = null;
  }
  
  // Destroy all methods
  cityVM.SetupScrollers = null;
  cityVM.ShowOffer = null;
  cityVM.HideOffer = null;
}

function PreFetchVersion4(cityVM) {
	// Version3 Data, Behaviours & Method
  cityVM.SelectedCategory = ko.observable();
  cityVM.SelectedOffer = ko.observable();
  cityVM.OffersScroller = null;
  
  cityVM.SelectCategory = function(category) {
    cityVM.SelectedCategory(category);
    
    if (cityVM.OffersScroller != null) {
      cityVM.OffersScroller.destroy();
      cityVM.OffersScroller = null;
    }
    
    var offersWidth = 0;
    $("#version4-offers-wrapper ul.offers-list li").each(function() {
      offersWidth += $(this).outerWidth(true);
    });
    $("#version4-offers-wrapper ul.offers-list").width(offersWidth);
    
    cityVM.OffersScroller = new iScroll("version4-offers-wrapper", { hScroll: true, hScrollbar: false, vScroll: false, vScrollbar: false });
    setTimeout(
      function() { cityVM.OffersScroller.refresh(); },
      0
    );
  };
  cityVM.ShowOffer = function(offer) {
    cityVM.SelectedOffer(offer);
    Resize();
  }
}
function PostFetchVersion4(cityVM) { 
  Resize();
  setTimeout(
    function() { var firstCategory = cityVM.Categories()[0]; cityVM.SelectCategory(firstCategory); },
    0
  );
}
function KillVersion4(cityVM) {
  cityVM.SelectedCategory = null;
  cityVM.SelectedOffer = null;
  if (cityVM.OffersScroller != null) {
    cityVM.OffersScroller.destroy();
    cityVM.OffersScroller = null;
  }
  
  cityVM.SelectCategory = null;
  cityVM.ShowOffer = null;
}

function Resize() {
  var width = $(window).width();
  var height = $(window).height();
  
  var headerHeight = $(".ui-header", $.mobile.activePage).height();
  var footerHeight = $(".ui-footer", $.mobile.activePage).height();
  var contentHeight = height - headerHeight - footerHeight;

  // Resize for version 1
  if ($("#version1").length > 0 && $("#version1").is(":visible")) {
    $("#version1 .right-content").height(contentHeight - 35).css("overflow-y", "scroll");  
    
    var offersHeaderHeight = $("#version1 .offers-header").outerHeight(true);
    var offersWrapperHeight = contentHeight - offersHeaderHeight - 40;
    
    // Make the wrapper height no higher than the screen
    $("#version1 .offers-wrapper").height(offersWrapperHeight);
    
    // Make the offers list height as high as all of the items in it
    var offersHeight = 0;
    $("#version1 ul.offers-list li").each(function() {
      offersHeight += $(this).outerHeight(true);
    });
    $("#version1 ul.offers-list").height(offersHeight);    
  }

  // Resize for version 2
  if ($("#version2").length > 0 && $("#version2").is(":visible")) {
    $("#version2 .categories-wrapper").height(contentHeight - 40); 
  }

  // Resize for version 2 detail
  if ($("#version2-detail").length > 0 && $("#version2-detail").is(":visible")) {
    $("#version2-detail .content").height(contentHeight - 40).css("overflow-y", "scroll");
  }
  
  // Resize for version 3
  if ($("#version3").length > 0 && $("#version3").is(":visible")) {
    $("#version3-categories-wrapper").height(contentHeight - 40); 
    var theWidth = $("#version3-categories-wrapper").width() - 80;
    $("#version3-categories-wrapper .offers-wrapper").width(theWidth);
  }

  // Resize for version 4
  if ($("#version4").length > 0 && $("#version4").is(":visible")) {
    var bottom = $("#version4 .bottom");
    var bottomHeight = bottom.outerHeight();
  
    var offerDetail = $("#version4 .offer-detail");
    offerDetail.height(contentHeight - bottomHeight - 50);
    
    var offerImage = $("#version4 .offer-detail .offerImage");
    var offerDetails = $("#version4 .offer-detail .offerDetails");
    offerDetails.width(width - offerImage.outerWidth() - 55);    
  }
}

var jsonData = null;
var cityViewModel = null;

// Disable ipad / iphone page scrolling 
//document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);
//document.addEventListener("touchstart", function (e) { e.preventDefault(); }, false);

$("div").live("pageshow", function(e, data) {
  if ($("#version1").is(":visible")) {
    $.mobile.defaultHomeScroll = 0;
    cityViewModel = new CityViewModel(PreFetchVersion1, PostFetchVersion1, KillVersion1);
    ko.applyBindings(cityViewModel);
  }
  
  if ($("#version2").is(":visible")) {
    $.mobile.defaultHomeScroll = 0;
    cityViewModel = new CityViewModel(PreFetchVersion2, PostFetchVersion2, KillVersion2);
    ko.applyBindings(cityViewModel);
  }
  
  if ($("#version2-detail").is(":visible")) {
    $.mobile.defaultHomeScroll = 0;
    cityViewModel = new CityViewModel(PreFetchVersion2Detail, PostFetchVersion2Detail, KillVersion2Detail);
    ko.applyBindings(cityViewModel);
  }
  
  if ($("#version3").is(":visible")) {
    $.mobile.defaultHomeScroll = 0;
    cityViewModel = new CityViewModel(PreFetchVersion3, PostFetchVersion3, KillVersion3);
    ko.applyBindings(cityViewModel);
  }
  
  if ($("#version4").is(":visible")) {
    $.mobile.defaultHomeScroll = 0;
    cityViewModel = new CityViewModel(PreFetchVersion4, PostFetchVersion4, KillVersion4);
    ko.applyBindings(cityViewModel);
  }
});

$("div").live("pagehide", function(e, data) {
  if (cityViewModel != null && cityViewModel.Kill != null && $.isFunction(cityViewModel.Kill)) {
    cityViewModel.Kill();
    cityViewModel = null;
  }
});

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
}; 

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.slideVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        //ko.utils.unwrapObservable(value) ? $(element).show('slide', {direction: 'left'}, 1000) : $(element).hide('slide', {direction: 'right'}, 1000);

        var width = $(element).outerWidth();
        if (ko.utils.unwrapObservable(value)) {
          $(element)
            .css("right", "-=width")
            .show(400)
            .animate({right:0}, 800);
        }
        else {
          $(element).hide();
          // $(element)
          // .hide()
          // .animate({right:-width}, 400);
        }
    }
}; 