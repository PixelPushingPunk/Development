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
  
  // 
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
  $.getJSON("js/data.json", function(allData) {
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

function PreFetch(cityVM) {
	// Data, Behaviours & Methods
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
    Resize();
	};
  cityVM.HideOffer = function(offer) {
		cityVM.ChosenOffer(null);
	};
  // Manual subscriptions
  cityVM.VisibleCategoriesChanging = cityVM.VisibleCount.subscribe(function(newValue) {
    Resize();
  
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
    var offersWrapper = $(".offers-wrapper").get(0);
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

function PostFetch(cityVM) {

}

function Kill(cityVM) {
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

function Resize() {
  window.scrollTo(0, 1);

  var width = $(window).width();
  var height = $(window).height();
    
  var headerHeight  = $.mobile.activePage.children('[data-role="header"]').outerHeight();
  var footerHeight  = $.mobile.activePage.children('[data-role="footer"]').outerHeight();
  var contentHeight = $.mobile.activePage.children('[data-role="content"]').outerHeight();
  var calculatedContentHeight = height - headerHeight - footerHeight; 
  
  //if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
  if(/iPhone/i.test(navigator.userAgent)) {
    calculatedContentHeight -= 60;
  }  
  
  // Resize scrollers
  if (cityViewModel.ChosenCategory() != null) {
    var offersHeaderHeight = $(".offers-header").outerHeight(true);
    var offersWrapperHeight = (calculatedContentHeight) - offersHeaderHeight;
    
    // Make the wrapper height no higher than the screen
    $(".offers-wrapper").height(offersWrapperHeight);
    
    // Make the offers list height as high as all of the items in it
    var offersHeight = headerHeight;
    $("ul.offers-list li").each(function() {
      offersHeight += $(this).outerHeight(true);        
    });
    $("ul.offers-list").height(offersHeight);
    
    // Adjust the width of the images to stretch across the screen
    $(".offer-item-image").width(width - 10);
  }
  
  if (cityViewModel.ChosenOffer() != null) {
    // Adjust the width of the images to stretch across the screen
    $(".offer-item-image").width(width - 10);
  }
  
  // Resize categories
  var numCategories = cityViewModel.Categories().length;
  var categoriesHeight = calculatedContentHeight / numCategories;
  $(".categories-list li").height(categoriesHeight);
}

var jsonData = null;
var cityViewModel = null;

// Disable ipad / iphone page scrolling 
//document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);
//document.addEventListener("touchstart", function (e) { e.preventDefault(); }, false);

$("div").live("pageshow", function(e, data) {
  $.mobile.defaultHomeScroll = 0;
  cityViewModel = new CityViewModel(PreFetch, PostFetch, Kill);
  ko.applyBindings(cityViewModel);
});

$("div").live("pagehide", function(e, data) {
  if (cityViewModel != null && cityViewModel.Kill != null && $.isFunction(cityViewModel.Kill)) {
    cityViewModel.Kill();
    cityViewModel = null;
  }
});


// doc ready stuff for UI	

$(function() {

	var leftmenuStatus, 
		rightmenuStatus,
		accordion_head = $('.accordion > li > a'), 
		accordion_body = $('.accordion li > .sub-menu'),
		droparrows = $('.accordion li > a .navarrow');
	
	$("a.showLeftMenu").click(function() {
		if(leftmenuStatus != true) {
			$('#leftmenu').addClass('ontop');		
			$('#leftmenu').show();
			$(".ui-page-active").animate({
				marginLeft: "75%",
			}, 300, function(){leftmenuStatus = true});
			return false;
			} else {			
				$(".ui-page-active").animate({
				marginLeft: "0px",
			}, 300, function(){ leftmenuStatus = false; $('#leftmenu').removeClass('ontop'); });
			return false;
		}
	});

	$("a.showRightMenu").click(function() {
		if(rightmenuStatus != true) {
			$('#rightmenu').addClass('ontop');			
			$('#rightmenu').show();
			$(".ui-page-active").animate({
				marginLeft: "-75%",
			}, 300, function(){rightmenuStatus = true});
			return false;
			} else {		
				$(".ui-page-active").animate({
				marginLeft: "0px",
			}, 300, function(){ rightmenuStatus = false; $('#rightmenu').removeClass('ontop'); });
			return false;
		}
	});
	
    // Left Menu Accordian

    // Open the first tab on load
	accordion_head.first().addClass('active').next().slideDown('normal');

	// Show and hide the tabs on click
    if ($(this).attr('class') != 'active') {
        accordion_body.slideUp('normal');
        $(this).next().stop(true,true).slideToggle('normal');
			
        accordion_head.removeClass('active');	
    } 
		
 
    // Click function
	accordion_head.on('click', function(event) {
 
		// Disable header links
		event.preventDefault();

		// Show and hide the tabs on click
        if ($(this).attr('class') != 'active') {
            accordion_body.slideUp('normal');
            $(this).next().stop(true,true).slideToggle('normal');
			
            accordion_head.removeClass('active');
            $(this).addClass('active');
			
			droparrows.removeClass('dropped');
			$(this).find('.navarrow').toggleClass('dropped');
			
        } else {
			//accordion_body.slideDown('normal');
			$(this).next().stop(true,true).slideToggle('normal');

			$(this).find('.navarrow').toggleClass('dropped');
			
			accordion_head.removeClass('active');
		}
		
    });
	
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