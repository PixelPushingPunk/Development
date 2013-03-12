(function($) {
	$(window).load(function() {
		// do nothing for now
	});// window.load
})(jQuery); 

(function($){
	$(document).ready(function(){
		if(typeof(Storage)!=="undefined") { console.log("Yes! localStorage and sessionStorage support!"); } 
		else { console.log("Sorry! No web storage support.."); } // maybe try dojox.storage or a third-party solution 
		
		// Init Knockout
		//
		ko.applyBindings(new TaskListViewModel());
		
		// Init Simple Colour
		//
		$('.colourInit').simpleColor({
			cellHeight: 12,
			cellWidth: 12
		});

		$('.simpleColorCancelButton, .simpleColorSelectButton ').hide();
		$('.simpleColorDisplay, .simpleColorCell, .simpleColorChooser, .simpleColorContainer').on('click', function(){
			$('.simpleColorCancelButton, .simpleColorSelectButton ').hide();
		});

		// Show login
		//
		$('#login').hide();
		$('.startBtn').on('click', function(e) {
			showLogin();
			e.preventDefault();
		});

		// Disable tabbing
		// /setTimeout(function() {$('input').attr('tabindex','-1'); }, 10);
		$('body, html').on('keydown keypress', 'input', function (myfield, e) { 
			$this = $(this);
			//CatchTab($this, event);
			var keycode;
			if (window.event) {
			    keycode = window.event.keyCode;
			    //alert('test');
			    console.log("keycode: " + keycode);
			} else if (e) { 
			    keycode = e.which;

			    console.log("keycode: " + keycode);
			} else {
			    return true;
			}

			if (keycode === 9) { // if is the tab key
			    // Do stuff, return false to prevent key from being output
			    $this.focus();
			    return false;
			}

			if (keycode === 75) {
				setTimeout(function() { 
					confirm('are you sure you\'re crazy you pressed K 5 seconds ago!!?');
				}, 5000);
			}

		});


		// Init Datepicker
		//
		/*$('#datepicker, #datepickerMileStone').datepicker({
			dateFormat: "yy-mm-dd",
			beforeShow: function (input, inst) {
				var offset = $(input).offset();
				var height = $(input).height();
				window.setTimeout(function () {
					inst.dpDiv.css({ top: (offset.top + height + 25) + 'px', left: offset.left + 'px' })
				}, 1);
			}
		});*/
		
		// datepicker function initate
		var datePickInit = function () {
			$('#datepickerMileStone, #datepicker').datepicker({
				dateFormat: "yy-mm-dd",
				beforeShow: function (input, inst) {
					var offset = $(input).offset();
					var height = $(input).height();
					window.setTimeout(function () {
						inst.dpDiv.css({ top: (offset.top + height + 25) + 'px', left: offset.left + 'px' })
					}, 1);
				}
			});
		};

		// Init date picker event bubbling
		setTimeout(function () { datePickInit(); }, 0);
		$('body, html').on('click', '#datepickerMileStone, #datepicker', function(e) {
			datePickInit();
		});


		// Init Placeholder
		//
		$('input, textarea').placeholder();
		
		// Init thickness slider
		//
		$('#master').slider({
			value:4,
			orientation:"horizontal",
			range:"min",
			min: 1,
			max: 7,
			slide: function( event, ui ) {
				$('#thick').val( ui.value );
			},
			animate: true
		});
		var slideThick = $('#master').slider( 'value' );
		$('#thick').val( slideThick );

		// Init timeline title size slider
		//
		$('#timelineTitleSizeMaster').slider({
			value:24,
			orientation:"horizontal",
			range:"min",
			min: 1,
			max: 30,
			slide: function( event, ui ) {
				$('#timelineTitleSize').val( ui.value );
			},
			animate: true
		});
		var slideTimelineSize = $('#timelineTitleSizeMaster').slider( 'value' );
		$('#timelineTitleSize').val( slideTimelineSize );
		

		// Init task size slider
		//
		$('#titleSizeMaster').slider({
			value:16,
			orientation:"horizontal",
			range:"min",
			min: 1,
			max: 30,
			slide: function( event, ui ) {
				$('#titleSize').val( ui.value );
			},
			animate: true
		});
		var slideTitleSize = $('#titleSizeMaster').slider( 'value' );
		$('#titleSize').val( slideTitleSize );

		// Init date size slider
		//
		$('#dateSizeMaster').slider({
			value:12,
			orientation:"horizontal",
			range:"min",
			min: 1,
			max: 30,
			slide: function( event, ui ) {
				$('#dateSize').val( ui.value );
			},
			animate: true
		});
		var slideDateSize = $('#dateSizeMaster').slider( 'value' );
		$('#dateSize').val( slideDateSize );


		// Init timelineTitle disable enable
		//
		//disableTimelineTitleBtn();

		// Highlight tasks
		//
		$('body, html').on('click', '.numTasksLeft', function(){
			$('span.completeTasks strong').addClass('highlight');
			setTimeout( function() { removeHighlight }, 500);
		});
		
		// Cursor move on editable tasks
		//
		$('.editableTasks li').on({
			mouseenter: function() {
				$(this).css('cursor', 'move');
			},
			mouseleave: function() {
				$(this).css('cursor', 'default');
			}
		});

		// Submit task btn
		//
		$('.completeTasks').hide();
		$('#submitTaskBtn, #submitList').on('click', function(){
			$('.completeTasks').fadeIn();
			$('#noData').fadeOut('fast');
		});
		
		// Thickness of timeline
		//
		$('.ui-slider-handle').on('mousedown mouseup mouseenter mouseleave', function(e) {
			CustomizeColor.lineThickfunc();
			CustomizeColor.timelineTitleSizefunc();
			CustomizeColor.titleSizefunc();
			CustomizeColor.dateSizefunc();
			e.preventDefault();
		});

		// Timeline title colour
		//
		$('input#timelineTitleColour').change(function(){
			CustomizeColor.timelineTitleColourfunc();
		});
		
		// Timeline title size
		//
		//$('#timelineTitleSize').val(25);
		$('#timelineTitleSizeBtn').on('click', function(e){
			CustomizeColor.timelineTitleSizefunc();
			e.preventDefault();
		});
		
		// Title colour picker
		//
		$('input#titleColour').change(function(){
			CustomizeColor.titleColourValfunc();
		});

		// Title size
		//
		//$('#titleSize').val(16);
		$('#titleSizeBtn').on('click', function(e){
			CustomizeColor.titleSizefunc();
			e.preventDefault();
		});
		
		// Date colour picker
		//
		$('input#dateColour').change(function(){
			CustomizeColor.dateColourfunc();
		});

		// Datesize
		//
		//$('#dateSize').val(12);
		$('#dateSizeBtn').on('click', function(e){
			CustomizeColor.dateSizefunc();
			e.preventDefault();
		});	
		
		// Line colour picker
		//
		$('input#lineColour').change(function(){	
			CustomizeColor.lineColourfunc();
		});
		
		// Background task colour picker
		//
		$('input#bgTaskColour').change(function(){
			CustomizeColor.backgroundColourTaskfunc();
		});

		// Background date colour picker
		//
		$('input#bgDateColour').change(function () {
			CustomizeColor.backgroundColourDatefunc();
		});

		$('input#bgTimelineTitleColour').change(function () {
			CustomizeColor.backgroundColourTitlefunc();
		});
				
		// Character validation
		//
		$('#task').on({
			focus: function(){
				$('.characterError').fadeIn('fast');
				$(this).addClass('redBorder');
			}, 
			blur: function () {
				$('.characterError').fadeOut('slow');
				$(this).removeClass('redBorder');
			}
		});
			
		// Print
		//
		$('#print').on('click', function() {
			window.print();
			return false;
		});
		
	/*----------------------------------------------------------------------*/
	/* Scroller                                  						    */
	/*----------------------------------------------------------------------*/

		$('a.gorightpeople').click(function(e) {	  
			var currentLeft = $('#timeWrapper').css('left');
			var currentWidth = $('.timeBlocks').width();
			var totalCount = $('.timeBlocks').length;
					
			var totalWidth = currentWidth * totalCount;
			var screenWidth = $('#timeCenter').width();
			
			if (totalWidth < screenWidth) {
				return false;
			} else {
				// below variable is NB if tiles up are reduced in responsive design!!
				var numTiles = 4;		 
				var totalLeft  = -(currentWidth * totalCount/*-numTiles*/);
				//console.log(currentLeft + ' - ' + totalLeft);		
				var newLeft = (parseInt(currentLeft) - currentWidth);
				//console.log(currentLeft + ' - ' + newLeft);	
				var newLeft =  (newLeft<totalLeft) ? totalLeft+'px':newLeft+'px';			
				//console.log(newLeft);
		
				$('#timeWrapper').stop().animate({
					left: newLeft
				}, 200);
						
				e.preventDefault();
			}
		});

		$('a.goleftpeople').click(function(e) {  
			var currentLeft = $('#timeWrapper').css('left');
			var currentWidth = $('.timeBlocks').width();
			var newLeft = (parseInt(currentLeft) + currentWidth);
			var newLeft =  (newLeft>0) ? '0px':newLeft+'px';

			$('#timeWrapper').stop().animate({
				left: newLeft
			}, 200);
				
			e.preventDefault();	
		});	
		
		// Canvas Support
		//
		try {
			document.createElement("canvas").getContext("2d");
			//HTML5 Canvas is supported in your browser
			$('.cSupport').show();
			$('.cNotSupport').hide();
			setTimeout(function() { $('.cSupport').fadeOut('fast'); }, 5000);
		} catch (e) {
			//HTML5 Canvas is not supported in your browser
			$('.cSupport').hide();
			$('.cNotSupport').show();
		}
		
		$('#back').on('click', function(){
			$('#timeline, #customize').css('display','block');
			$('#export').css('display','block');
			$('#back, #print, #canvasPlay, #clear, #save').css('display','none'); //#clone
			$('#canvasImg').attr('src',' ');
			$('#imgWrapper').css('display','none');
			//$('#clone #timeWrapper').remove();
			return false;
		});
		
		// Kinetic canvas
		//	
		$('#clear').on('click', function() {
			clearCanvas();
			return false;
		});
		
		//Save as image
		//
		$('#save').on('click', function() {
			saveImage();
			return false;
		});
		
		// Save as JSON and generate timeline - Preview button
		//
		$('#saveJSON').on('click', function(e){
			$('#timeline').hide();
			$('.previewWrapper').hide();
			$('#export').css('display','none');
			$('#back, #print, #canvasPlay, #clear, #save').css('display','block');
			
			// Data
			var jsonVal = $('#jsonVal').val();
			data = JSON.parse(jsonVal);

			//console.debug(jsonVal);
			
			var safari = $.browser.safari;
			if (safari) {	
				for (i = 0; i < data.length; i++) {
					data.sort(function(a,b){
						var aDate = parseDate(a.date);
						var bDate = parseDate(b.date);
						var getDateA = new Date(aDate);
						var getDateB = new Date(bDate);
						//a = getDateA.getFullYear() + '-' + getDateA.getMonth() + '-' + getDateA.getDate();
						//b = getDateB.getFullYear() + '-' + getDateB.getMonth() + '-' + getDateB.getDate();
						
						a = getDateA.getTime();
						b = getDateB.getTime();
						console.log("A: "+a);
						console.log("B: "+b);
						//a = new Date(a.date);
						//b = new Date(b.date);
						return a<b?-1:a>b?1:0;
					});	
				}
			} else {
				for (i = 0; i < data.length; i++) {
					data.sort(function(a,b){
						var getDateA = new Date(a.date);
						var getDateB = new Date(b.date);
						//a = getDateA.getFullYear() + '-' + getDateA.getMonth() + '-' + getDateA.getDate();
						//b = getDateB.getFullYear() + '-' + getDateB.getMonth() + '-' + getDateB.getDate();
						
						a = getDateA.getTime();
						b = getDateB.getTime();
						console.log("A: "+a);
						console.log("B: "+b);
						//a = new Date(a.date);
						//b = new Date(b.date);
						return a<b?-1:a>b?1:0;
					});
				}	
			}
			

			// Generate Timeline
			dataLength = data.length;
				if ($('#container canvas').is(':visible')) {
					clearCanvas();
					$('#container div').remove();
					generateTimeline();
				} else {
					generateTimeline();
				}
			hideCanvasSupport();
			e.preventDefault();
			e.stopPropagation();	
		});

		/*$('#reEdit').on('click', function (e){ 
			var stage2 = Kinetic.Node.create(jsonCanvas, 'container');
			e.preventDefault;
		});*/

		// Show hide timeline aggreation type
		//
		$('#individualTimelines .multiple').on('click', function (e) {
			showMultipleTimeline();
			e.preventDefault();
		});

		$('#multipleTimelines .individual').on('click', function (e) {
			showIndividualTimeline();
			e.preventDefault();
		});

		// Save all
		$('#saveALL').on('click', function(e) {
			saveAll();

			e.preventDefault();
		});
			
	});//END document.ready
})(jQuery);









// variables, function expresions and function declarations
var stage, layer, data, jsonCanvas, 
	textColour,
	dateColour,
	lineColour,
	lineThick, 
	textSize,
	dateSize,
	textBGcolour,
	timelineTitle,
	timelineTextSize,
	dateBGColour,
	bgTimelineTitleColour,
	timelineTextColour;	 

// Get started login
var showLogin = function () {
	$('#login').fadeIn('fast');
	$('.startBtn').addClass('disableStart');

};

// Parse date for safri
var parseDate = function (input) {
	var parts = input.match(/(\d+)/g);
	return new Date(parts[0], parts[1]-1, parts[2]);
};

// Disable tabbing
var CatchTab = function (myfield, e) {
    var keycode;
    if (window.event) {
        keycode = window.event.keyCode;
        //alert('test');
        console.log("keycode: " + keycode);
    } else if (e) { 
        keycode = e.which;
    } else {
        return true;
    }

    if ( keycode == 97 ) {
    	alert('a clicked');
    } 
    if (keycode == 9) { // if is the tab key
        // Do stuff, return false to prevent key from being output
        //alert('test');
        e.focus();
        return false;
      }  
    /*} else if (keycode == 65) {
    	alert('this is a clicked');
    	//return true;
	}*/
    
};

// Adding events
var showIndividualTimeline = function () {
 	$('#individualTimelines').show();
 	$('#multipleTimelines').hide();
};

var showMultipleTimeline = function () {
	$('#multipleTimelines').show();
	$('#individualTimelines').hide();
};

// Customize timeline colour object
var CustomizeColor = {
	// timeline title size
	timelineTitleSizefunc: function () {
		//var timelineTitleSizeVal = ($('#timelineTitleSize').val()) + 'px';
		var slideTimelineSize = $('#timelineTitleSizeMaster').slider( 'value' );
		$('.timelineTitle').css({'font-size': slideTimelineSize });
	},

	// timeline title colour
	timelineTitleColourfunc: function () {
		var timelineTitleColourVal = $('input#timelineTitleColour').val();
		$('.timelineTitle').css({'color': timelineTitleColourVal});
	}, 

	// title size
	titleSizefunc: function () {
		//var titleSizeVal = ($('#titleSize').val()) + 'px';
		var slideTitleSize = $('#titleSizeMaster').slider( 'value' );
		$('.mileStoneTitle').css({'font-size': slideTitleSize});
	},

	// title colour
	titleColourValfunc: function () {
		var titleColourVal = $('input#titleColour').val();
		$('.mileStoneTitle').css({'color': titleColourVal});
	},

	// data size
	dateSizefunc: function () {
		//var dateSizeVal = ($('#dateSize').val()) + 'px';
		var slideDateSize = $('#dateSizeMaster').slider( 'value' );
		$('.mileStoneDate').css({'font-size': slideDateSize});
	},

	// data colour
	dateColourfunc: function () {
		var dateColourVal = $('input#dateColour').val();
		$('.mileStoneDate').css({'color': dateColourVal});
	},

	// line colour
	lineColourfunc: function () {
		var lineColourVal = $('input#lineColour').val();
		$('.top, .bottom').css({'border-bottom-color': lineColourVal, 'border-right-color':lineColourVal});
	},

	// background colour task / title
	backgroundColourTaskfunc: function () {
		var bgColourTaskVal = $('input#bgTaskColour').val();
		$('.mileTwrapper').css({'background-color': bgColourTaskVal});
	}, 

	// background colour date
	backgroundColourDatefunc: function () {
		var bgColourDateVal = $('input#bgDateColour').val();
		$('.mileDwrapper').css({'background-color': bgColourDateVal});
	},

	// background colour timeline title
	backgroundColourTitlefunc: function () {
		var bgColourTimelineTitleVal = $('input#bgTimelineTitleColour').val();
		$('.timelineTitle').css({'background-color': bgColourTimelineTitleVal});
	},

	// line thickness
	lineThickfunc: function () {
		var lineColour = $('#lineColour').val();
		var slideThick = $('#master').slider( 'value' );
		var originalLineStyle = $('.top').css({'border-bottom-style':'solid'});
		var originalLineColor = $('.top').css({'border-bottom-color': lineColour});
		var lineThicknessValx = $('#thick').val( slideThick );
		$('.top').css({'border-bottom-width': slideThick});		
	}
};


/*----------------------------------------------------------------------*/
/* Canvas Functions                                           			*/
/*----------------------------------------------------------------------*/

// Remove highlight from task check box
//
var removeHighlight = function (){
	$('span.completeTasks strong').removeClass('highlight');
};

// Hide canvas support text
//
var hideCanvasSupport = function () {
	$('.cSupport, .cNotSupport').hide();
};
	
// Clear canvas
//
var clearCanvas = function () {
    stage.clear();
	$('#imgWrapper').hide();
};
	
// Count obj function
//
var countProperties = function (obj) {
	var prop;
	var propCount = 0;

	for (prop in obj) {
		propCount++;
	}
	return propCount;
	alert(propCount);
};
	
// Generate timeline
//
var generateTimeline = function (){
	// Set defualt variables
	var janWidth, febWidth, marWidth, aprilWidth, mayWidth, juneWidth, julWidth, augWidth, septWidth, octWidth, novWidth, decWidth;
	var janGroup, febGroup, marGroup, aprilGroup, mayGroup, juneGroup, julGroup, augGroup, septGroup, octGroup, novGroup, decGroup;	
	var janText, febText, marText, aprilText, mayText, juneText, julText, augText, septText, octText, novText, decText;
	var textText, dateText, timelineText;
	var taskRect, dateRect, timelineTextRect;
	var janLine, febLine, marLine, aprilLine, mayLine, juneLine, julLine, augLine, septLine, octLine, novLine, decLine;
	var month, monthText, monthLine, monthGroup;
	
	var xPos = 0;

	// Graph grid
	var graphLineX, graphLineY;

	// Set canvas width and height
	var lineAmountWidth = (dataLength * 150); 
	var canvasWidth = (lineAmountWidth < 990)? 1024: lineAmountWidth + 600;//(dataLength * 150) + 250;
	var wholeWidth = (lineAmountWidth < 990)? 1024: lineAmountWidth + 600;
	var canvasHeight = 420;
	var canvasWrapperWidth = canvasWidth;
	var containerWidth = canvasWidth;
	var setCanvasWidth = $('#canvasWrapper').css({'width': canvasWrapperWidth});
	var setContainerWidth = $('#container').css('width', containerWidth);

	// Set timeline title variables
	var containerWidthTrue = $('#container').width();
	var timelineTextPos = containerWidthTrue / 2;
	var timelineTextWidth = $('.timelineTitle').width();
	timelineTextSize = $('#timelineTitleSize').val();
	timelineTextColour = $('#timelineTitleColour').val();
	bgTimelineTitleColour = $('#bgTimelineTitleColour').val();
	timelineTitle = $('h1.timelineTitle').text();
	
	// Set random colours
	var colors = ['#ff0000','#00ff00','#0000ff','rgb(50,50,50)','rgb(200,200,200)','purple','orange','black'];
	var color = colors[Math.floor(Math.random()*colors.length)];
	
	// Set text and date colours
	var gridWidth = 1;
	var gridColour = "#d6dfee";			
	textColour = $('#titleColour').val(); 
	dateColour = $('#dateColour').val();
	lineColour = $('#lineColour').val();
	lineThick = $('#thick').val();		
	textSize = $('#titleSize').val();
	dateSize = $('#dateSize').val();
	textBGcolour = $('#bgTaskColour').val();
	dateBGColour = $('#bgDateColour').val();
	
	// Create new stage and layer
	//
	stage = new Kinetic.Stage({ container: 'container', width: canvasWidth, height: canvasHeight });	
	layer = new Kinetic.Layer();

	// Generate grid lines in the background
	// Create arrays
	graphLineX = [];
	graphLineY = [];
	
	// Set grid position defaults
	var gridPosY = 0;
	var gridPosX = 0;
	for(j = 0; j < wholeWidth; j++){
		gridPosY += 10;
		gridPosX +=10;
		
		graphLineX.push(j);
		graphLineX[j] = new Kinetic.Line({ points: [0, gridPosY, wholeWidth, gridPosY], stroke: gridColour, strokeWidth: gridWidth, lineCap: 'square', lineJoin: 'square' });
		
		graphLineY.push(j);
		graphLineY[j] = new Kinetic.Line({ points: [gridPosX, 0, gridPosX, canvasHeight], stroke: gridColour, strokeWidth: gridWidth, lineCap: 'square', lineJoin: 'square' });
		
		graphLineY[j].moveToBottom();
		graphLineX[j].moveToBottom();

		layer.add(graphLineY[j]);
		layer.add(graphLineX[j]);
	}

	// Create new time line title
	//
	var timelineTitleGroup = new Kinetic.Group({ draggable:true });
	timelineTitleGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
	timelineTitleGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });	
	timelineText = new Kinetic.Text({ x: timelineTextPos, y: 10, text: timelineTitle, fontSize:  timelineTextSize, fontFamily: 'Calibri', fill: timelineTextColour, padding: 5, align: 'center' });	
	timelineTextRect = new Kinetic.Rect({ x: timelineTextPos, y: 10, width: timelineText.getWidth(), height: timelineText.getHeight(), fill: bgTimelineTitleColour, stroke: bgTimelineTitleColour, strokeWidth: 0, cornerRadius: 4 });
		
	timelineText.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
	timelineText.on('mouseout', function() { document.body.style.cursor = 'default'; });
	timelineTitleGroup.add(timelineTextRect);
	timelineTitleGroup.add(timelineText);
	layer.add(timelineTitleGroup);

	// Add all layers to a group
	//
	var generateMonthGroup = function (monthGroup, monthWidth, textMonth, monthText, monthLine) {
		monthGroup = new Kinetic.Group({ draggable:true });
		var monthTextYpos = 50;
		var monthTextXplus = 25
		var monthLineXplus = 45;
		var monthLineYpos = canvasHeight - 330;
		var monthLinePosition = 70;
		var monthLineThick = 4;
		var monthTextFont = 18;
		var monthLineColor = "#adc9be";

		monthGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
		monthGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
		monthGroup.add(taskRect);
		monthGroup.add(dateRect);
		monthGroup.add(textText);
		monthGroup.add(dateText);
		monthGroup.add(timeLine);
		
		monthGroup.setWidth(xPos);
		monthWidth = monthGroup.getWidth();
		monthGroup.move(0, 0);

		monthText = new Kinetic.Text({ x: monthWidth+monthTextXplus, y: monthTextYpos, text: textMonth, fontSize:  16, fontFamily: 'Calibri', fill: timelineTextColour, draggable: true });
		monthLine = new Kinetic.Line({ points: [monthWidth+monthLineXplus, monthLinePosition, monthWidth+monthLineXplus, monthLineYpos], stroke: monthLineColor, strokeWidth: monthLineThick, lineCap: 'square', lineJoin: 'square' });	
							
		monthGroup.add(monthText);
		monthGroup.add(monthLine);

		layer.add(monthGroup);
	};	

	// Generate the top and bottom task, date and lines
	var generateLinesPerMonth = function () {

		// if value is odd
		if (i % 2) {
			// Task
			textText = new Kinetic.Text({ x: xPosText-5, y: textTitlePosBottom + 5, text: data[i].title, fontSize: textSize, fontFamily: 'Calibri', fill: textColour, width: 150, padding: 10, align: 'center', draggable: true });
			taskRect = new Kinetic.Rect({ x: xPosText, y: textTitlePosBottom, width: textText.getWidth(), height: textText.getHeight(), fill: textBGcolour, stroke: textBGcolour, strokeWidth: 0, cornerRadius: 4 });

			// Date
			dateText = new Kinetic.Text({ x: xPosDate, y: dateTitlePosBottom, text: newDate, fontSize: dateSize, fontFamily: 'Calibri', fill: dateColour, padding: 4, align: 'center', draggable: true });				
			dateRect = new Kinetic.Rect({ x: xPosDate-1, y: dateTitlePosBottom-4, width: dateText.getWidth(), height: dateText.getHeight(), fill: dateBGColour, stroke: textBGcolour, strokeWidth: 0, cornerRadius: 4 });
			
			// Timeline
			timeLine = new Kinetic.Line({ points: [xPos, yPos, xPos2, yPos, xPos2, bottomTitlePos], stroke: lineColour, strokeWidth: lineThick, lineCap: 'round', lineJoin: 'round' });
		}

		// if value is even
		else {
			// Task
			textText = new Kinetic.Text({ x: xPosText-5, y: textTitlePosTop + 5, text: data[i].title, fontSize: textSize, fontFamily: 'Calibri', fill: textColour, width:150, padding: 10, align: 'center', draggable: true });				
			taskRect = new Kinetic.Rect({ x:xPosText, y: textTitlePosTop-10, width: textText.getWidth(), height: textText.getHeight(), fill: textBGcolour, stroke:textBGcolour, strokeWidth: 0, cornerRadius: 4 });

			// Date
			dateText = new Kinetic.Text({ x: xPosDate, y: dateTitlePosTop, text: newDate, fontSize: dateSize, fontFamily: 'Calibri', fill: dateColour, padding: 4, align: 'center', draggable: true });								
			dateRect = new Kinetic.Rect({ x: xPosDate-2, y: dateTitlePosTop+2, width: dateText.getWidth(), height: dateText.getHeight(), fill: dateBGColour, stroke: textBGcolour, strokeWidth: 0, cornerRadius: 4 });				
			
			// Timeline
			timeLine = new Kinetic.Line({ points: [xPos, yPos, xPos2, yPos, xPos2, topTitlePos], stroke: lineColour, strokeWidth: lineThick, lineCap: 'round', lineJoin: 'round' });					
		}

		// Offset
		textText.setOffset({ x: textText.getWidth() / 2 });
		textText.setOffset({ y: textText.getHeight() / 2 });

		taskRect.setOffset({ x: taskRect.getWidth() / 2 });
		taskRect.setOffset({ x: taskRect.getHeight() / 2 });

		dateText.setOffset({ x: dateText.getWidth() / 2 });
		//dateText.setOffset({ x: dateText.getHeight() / 2 });

		//dateRect.setOffset({ x: dateRect.getHeight() / 2 });
		dateRect.setOffset({ x: dateRect.getWidth() / 2 });		

		// reposition line, date and task text
		timeLine.move(-170, 0);
		dateText.move(-170, 0);
		textText.move(-170, 0);
		taskRect.move(-240, 0);
		dateRect.move(-170, 0);

		// Mouse over and out states
		textText.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
		textText.on('mouseout', function() { document.body.style.cursor = 'default'; });
		dateText.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
		dateText.on('mouseout', function() { document.body.style.cursor = 'default'; });
	};

	// Segregate by month
	//
	var monthSeg = function () {
		generateLinesPerMonth();
		//JAN
		if (month == 1) {
			var textMonth = "JAN";	 
			generateMonthGroup(janGroup, janWidth, textMonth, janText, janLine);
		} 
		//FEB
		if (month == 2) {
			var textMonth = "FEB"; 
			generateMonthGroup(febGroup, febWidth, textMonth, febText, febLine);
		}
		//MAR 
		if  (month == 3) { 
			var textMonth = "MAR";
			generateMonthGroup(marGroup, marWidth, textMonth, marText, marLine);				
		} 
		//APR
		if (month == 4) {
			var textMonth = "APRIL"; 
			generateMonthGroup(aprilGroup, aprilWidth, textMonth, aprilText, aprilLine);
		} 
		//MAY
		if (month == 5) {
			var textMonth = "MAY";
			generateMonthGroup(mayGroup, mayWidth, textMonth, mayText, mayLine);
		} 
		//JUNE
		if (month == 6) {
			var textMonth = "JUNE"; 
			generateMonthGroup(juneGroup, juneWidth, textMonth, juneText, juneLine);
		} 
		//JULY
		if (month == 7) {
			var textMonth = "JUL"; 
			generateMonthGroup(julGroup, julWidth, textMonth, julText, julLine);
		}
		//AUG  
		if (month == 8) { 
			var textMonth = "AUG";
			generateMonthGroup(augGroup, augWidth, textMonth, augText, augLine);
		}
		//SEPT 
		if (month == 9) {
			var textMonth = "SEPT"; 
			generateMonthGroup(septGroup, septWidth, textMonth, septText, septLine);
		} 
		//OCT
		if (month == 10) { 
			var textMonth = "OCT";
			generateMonthGroup(octGroup, octWidth, textMonth, octText, octLine);
		} 
		//NOV
		if (month == 11) {
			var textMonth = "NOV"; 
			generateMonthGroup(novGroup, novWidth, textMonth, novText, novLine);
		} 
		//DEC
		if (month == 12) {
			var textMonth = "DEC"; 
			generateMonthGroup(decGroup, decWidth, textMonth, decText, decLine);
		} else { }
	};	
	
	// Loop through all values in array and position top and bottom
	//
	var num = 0;			
	for (i = num; i < data.length; i++) {	
		// Set x and y line values
		//
		xPos += 150;
		var xPos2 = xPos+150;
		var xPos3 = xPos2;
		var xPos4 = xPos3 + 20;
		var yPos = canvasHeight / 2; 

		// Set text and date x and y values
		//
		var xPosText = xPos2 + 15;
		var xPosDate = xPos2;
		var topTitlePos = yPos - (yPos/3); var bottomTitlePos = yPos + (yPos/3);				
		var textTitlePosTop = topTitlePos - 30; var textTitlePosBottom = bottomTitlePos + 10;				
		var dateTitlePosTop = topTitlePos + 75; var dateTitlePosBottom = bottomTitlePos - 90;
		
		// need to filter year

		// need filter by month

		// filter by date

		var safari = $.browser.safari;
		// Order by month
		//
		if (safari) {
			var dataValues = parseDate(data[i].date);
			var presentDate = new Date();
			var presentYear = presentDate.getFullYear();
			var getDate = new Date(dataValues);
			var day = getDate.getDate();
			var month = ((getDate.getMonth())+(1));
			var getYear = getDate.getFullYear();
			var newDate = day + '-' + month + '-' + getYear;
			console.log("Day: "+day);
			console.log(newDate);
		} else { 	
			var dataValues = data[i].date;
			var presentDate = new Date();
			var presentYear = presentDate.getFullYear();
			var getDate = new Date(dataValues);
			var day = getDate.getDate();
			var month = ((getDate.getMonth())+(1));
			var getYear = getDate.getFullYear();
			var newDate = day + '-' + month + '-' + getYear;
			console.log("Day: "+day);
			console.log(newDate);
		}
		
		if (presentYear) {
			monthSeg();
		} 
		else { } // do nothing
	}//end loop
	
	stage.add(layer);
};
	
// Save image function
//
var saveImage = function () {
	//document.getElementById('save').addEventListener('click', function() {				
	stage.toDataURL({
		callback: function(dataURL){
			//window.open(dataURL);
			document.getElementById('canvasImg').src = dataURL;
			$('#imgWrapper').css('display','block');
			$('#canvasImg').css('display','block');
		}
	});
	//}, false);
};


// Timeblock style creation
//
var timeBlocksAddTaskStyle = function () {
	$('.timeBlocks').removeClass('timeBlockBottom').removeClass('timeBlockTop');
	//add classes
	$('.timeBlocks:odd').addClass('timeBlockBottom');
	$('.timeBlocks:even').addClass('timeBlockTop');
				
	//calculuate title horizontal position
	var mTitleWidth = $('.mileTwrapper').width();
	var mTitleRight = -(mTitleWidth / 3.598599604963728)+'%'; //4.75
	$('.mileTwrapper').css({'right': mTitleRight});
			
	//reconfigure line thickness
	CustomizeColor.lineThickfunc();

	//reconfigure title colour
	CustomizeColor.titleColourValfunc();
	
	//reconfigure title size
	CustomizeColor.titleSizefunc();

	//reconfigure date colour
	CustomizeColor.dateColourfunc();
			
	//reconfigure line colour
	CustomizeColor.lineColourfunc();
			
	//reconfigure bg task colour
	CustomizeColor.backgroundColourTaskfunc();

	//reconfigure bg date colour
	CustomizeColor.backgroundColourDatefunc();

	//reconfigure bg timeline title colour
	CustomizeColor.backgroundColourTitlefunc();
			
	//update time inner width
	var articleWidth = $('.timeBlocks').width();
	var timeInnerWidth = $('#timeInner').width();
	var totalTimeWidth = timeInnerWidth + articleWidth + 200;
	$('#timeInner, #timeWrapper').css({'width': totalTimeWidth});
};
	
// Timeblock remove style
//
var timeBlocksRemoveTaskStyle = function () {
	//add classes
	$('.timeBlocks').removeClass('timeBlockBottom').removeClass('timeBlockTop');
	$('.timeBlocks:odd').addClass('timeBlockBottom');
	$('.timeBlocks:even').addClass('timeBlockTop');
		
	//check tasks
	if($('.timeBlocks').is(':visible')){
		$('#noData').fadeOut('fast');
	} else {
		$('#noData').fadeIn('fast');
	}
};

/*----------------------------------------------------------------------*/
/* Extended KO Bindings                                    */
/*----------------------------------------------------------------------*/

ko.bindingHandlers.sortable = {
    init: function (element, valueAccessor) {
        // cached vars for sorting events
        var startIndex = -1,
            koArray = valueAccessor();

        var sortableSetup = {
            // cache the item index when the dragging starts
            start: function (event, ui) {
                startIndex = ui.item.index();              
                // set the height of the placeholder when sorting
                ui.placeholder.height(ui.item.height());
            },
            // capture the item index at end of the dragging
            // then move the item
            stop: function (event, ui) {             
                // get the new location item index
                var newIndex = ui.item.index();           
                if (startIndex > -1) {
                    //  get the item to be moved
                    var item = koArray()[startIndex];                     
                    //  remove the item
                    koArray.remove(item);                   
                    //  insert the item back in to the list
                    koArray.splice(newIndex, 0, item);
                    //  ko rebinds the array so we need to remove duplicate ui item
                    ui.item.remove();
                }	
				timeBlocksAddTaskStyle();
            },
            placeholder: 'taskMoving'
        };        
        // bind
        $(element).sortable( sortableSetup );  
    }
};

// Knockout Functions
// Task object
//
var disableTimelineTitleBtn = function () {
	$('#submitTitleBtn').on('click', function() {
		$(this).attr('disabled');
		console.log('submit clicked');
	});
	$('#removeTitleBtn').on('click', function() {
		$('#submitTitleBtn').removeAttr('disabled');
		console.log('remove clicked');
	});
};

var Task = function (data) {
	this.title = ko.observable(data.title);//.extend({ required: "Please enter a task name" });
	this.date = ko.observable(data.date);
	this.isDone = ko.observable(data.isDone);	
};

// Timeline title object
//
var tfTitle = function (data) {
	this.timelineTitle = ko.observable(data.timelineTitle);
};

// Footer list
//
var footerList = function () {
	var self = this;
	self.about = "about";
	self.contact = "contact";
	self.help = "help";
	self.legals = "legals";
	self.terms = "terms";
};

// Steps
//
var stepList = function () {
	var self = this;
	self.add = "1 Add Items";
	self.stylize = "2 Stylize";
	self.finalize = "3 Finalize & Download/Embed";
};

// View model
//
var TaskListViewModel = function () {
	// Data
	var self = this;
	
	self.tasks = ko.observableArray([]);
	self.titleTimeline = ko.observableArray([]);
	
	self.newTaskText = ko.observable();
	self.newDateText = ko.observable();
	self.newTaskDateText = ko.observable();
	self.incompleteTasks = ko.computed(function() {
		return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
	});
	
	self.newTimelineTitle = ko.observable();
	
	// Footer list
	self.foot = ko.observableArray([
		new footerList()
	]);

	// Step list
	self.stepList = ko.observableArray([
		new stepList()
	]);
	
	self.sortItems = function() {
		self.tasks.sort();
	};
	
	// Operations
	self.addTitle = function() {
		self.titleTimeline.remove(tfTitle);
		//self.titleTimeline.sort();
		self.titleTimeline.push(new tfTitle({ timelineTitle: this.newTimelineTitle()}));
		self.newTimelineTitle("");
		CustomizeColor.timelineTitleColourfunc();
		CustomizeColor.timelineTitleSizefunc();
	}
	
	self.addTask = function() {
		//self.tasks.sort();
		self.tasks.push(new Task({ title: this.newTaskText(), date: this.newDateText()}));
		var x = self.newTaskText("");
		var y = self.newDateText("");
		timeBlocksAddTaskStyle();			
	};

	self.addTaskList = function () {

        //var textarea = $('textarea').val();
        //console.log(textarea);            
        var textArr = [];
        //textArr = textarea.split(/\n/);
        textArr = this.newTaskDateText().split(/\n/);
        //var data = []; 
            for(var i = 0; i < textArr.length; i += 1 ) {
                var query = textArr[i].split(' ');
                //data.push({
                //    title: query[0],
                //    date: query[1]
                //});
            	self.tasks.push(new Task({ title: query[0], date: query[1]}));
            }
            
        //console.debug(data);	

     	//self.tasks.push(new Taskdata);       
		var z = self.newTaskDateText("");
		timeBlocksAddTaskStyle();	
	};
	
	self.removeTask = function(task) { 
		self.tasks.remove(task);
		timeBlocksRemoveTaskStyle(); 			
	};
	
	self.removeTitle = function(tfTitle) {
		self.titleTimeline.remove(tfTitle);
	};

	self.save = function() {
		self.lastSavedJson(JSON.stringify(ko.toJS(self.tasks), null, 2));
		//self.tasks.sort();
	};

	self.lastSavedJson = ko.observable("");	
};	

// Save all
//
var saveAll = function () {
	// define objects
	var timeline = {};
	var timelineItem = {};
	var timelineSettings = {};

	// grab values
		// canvas layout - JSON object of the canvas drawing
		var jsonCanvas = stage.toJSON();
		// timeline item data
		var timelineItemVal = $('#jsonVal').val();


	// set objects
		// timeline item object
		timelineItem = JSON.parse(timelineItemVal);
		//console.log(timelineItem);
		console.debug(timelineItem);

		// timeline object
		timeline = {
			"timelineTitle": timelineTitle, 
			"layout": jsonCanvas
		};
		//console.log(timeline);
		console.debug(timeline);

		// timeline settings object
		timelineSettings = {
			"timlineSize": lineThick,
			"timelineColour": lineColour,
			"titleSize": timelineTextSize,
			"titleColour": timelineTextColour,
			"titleBg": bgTimelineTitleColour,
			"taskSize": textSize,
			"taskColour": textColour,
			"taskBg": textBGcolour,
			"dateSize": dateSize,
			"dateColour": dateColour,
			"dateBg": dateBGColour
		};
		//console.log(timelineSettings);
		console.debug(timelineSettings);

		// check types
		console.log("TYPES:" + "\n" + "what is timlineItem: " + typeof timelineItem + "\n" + "what is timeline: " + typeof timeline + "\n" + "what is timelineSettings: " + typeof timelineSettings);
};
	