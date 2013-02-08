jQuery(document).ready(function($){
	if (Modernizr.localstorage) { console.log("window.localStorage is available!"); } 
	else { console.log("no native support for HTML5 storage :("); } // maybe try dojox.storage or a third-party solution 

	if(typeof(Storage)!=="undefined") { console.log("Yes! localStorage and sessionStorage support!"); } 
	else { console.log("Sorry! No web storage support.."); }
	
	//init Knockout
	ko.applyBindings(new TaskListViewModel());
	
	//init Simple Colour
	$('#titleColour, #dateColour, #lineColour, #bgColour, #timelineTitleColour').simpleColor();
	
	//init Datepicker
	$('#datepicker').datepicker({
		dateFormat: "mm-dd-yy",
		beforeShow: function (input, inst) {
			var offset = $(input).offset();
			var height = $(input).height();
			window.setTimeout(function () {
				inst.dpDiv.css({ top: (offset.top + height + 25) + 'px', left: offset.left + 'px' })
			}, 1);
		}
	});
	
	//Init Placeholder
	$('input, textarea').placeholder();
	
	//Highlight tasks
	$('body, html').on('click', '.numTasksLeft', function(){
		$('span.completeTasks strong').addClass('highlight');
		setTimeout(removeHighlight, 500);
	});
		
	//Submit task btn
	$('.completeTasks').hide();
	$('#submitTaskBtn').on('click', function(){
		$('.completeTasks').fadeIn();
		$('#noData').fadeOut('fast');
	});
		
	//Timeline title colour
	$('input#timelineTitleColour').change(function(){
		var timelineTitleColourVal = $('input#timelineTitleColour').val();
		$('.timelineTitle').css({'color': timelineTitleColourVal});
	});
	
	//Timeline title size
	$('#timelineTitleSize').val(25);
	$('#timelineTitleSizeBtn').on('click', function(){
		var timelineTitleSizeVal = ($('#timelineTitleSize').val()) + 'px';
		$('.timelineTitle').css({'font-size': timelineTitleSizeVal});
		return false;
	});
	
	//Title colour picker
	$('input#titleColour').change(function(){
		var titleColourVal = $('input#titleColour').val();
		$('.mileStoneTitle').css({'color': titleColourVal});
	});
	
	//Title size
	$('#titleSize').val(16);
	$('#titleSizeBtn').on('click', function(){
		var titleSizeVal = ($('#titleSize').val()) + 'px';
		console.log(titleSizeVal);
		$('.mileStoneTitle').css({'font-size': titleSizeVal});
		return false;
	});
	
	//Date colour picker
	$('input#dateColour').change(function(){
		var dateColourVal = $('input#dateColour').val();
		$('.mileStoneDate').css({'color': dateColourVal});
	});

	//Datesize
	$('#dateSize').val(12);
	$('#dateSizeBtn').on('click', function(){
		var dateSizeVal = ($('#dateSize').val()) + 'px';
		console.log(dateSizeVal);
		$('.mileStoneDate').css({'font-size': dateSizeVal});
		return false;
	});	
	
	//Line colour picker
	$('input#lineColour').change(function(){	
		var lineColourVal = $('input#lineColour').val();
		$('.top, .bottom').css({'border-bottom-color': lineColourVal, 'border-right-color':lineColourVal});
	});
	
	//Background colour picker
	$('input#bgColour').change(function(){
		var bgColourVal = $('input#bgColour').val();
		$('.mileTwrapper, .mileDwrapper').css({'background-color': bgColourVal});
	});
	
	//Line thickness remove error
	$('input#thick').on('blur', function(){
		$('.error').fadeOut('fast');
	});	
	
	//Character validation
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
	
	$('#thick').on({
		focus: function(){
			$('.thickError').fadeIn('fast');
			$(this).addClass('redBorder');
		}, 
		blur: function () {
			$('.thickError').fadeOut('slow');
			$(this).removeClass('redBorder');
		}
	});
	
	//Print
	$('#print').on('click', function() {
		window.print();
		return false;
	});
	
/*----------------------------------------------------------------------*/
/* Scroller                                  						*/
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
	
	//Canvas Support
	try {
		document.createElement("canvas").getContext("2d");
		//HTML5 Canvas is supported in your browser
		$('.cSupport').show();
		$('.cNotSupport').hide();
	} catch (e) {
		//HTML5 Canvas is not supported in your browser
		$('.cSupport').hide();
		$('.cNotSupport').show();
	}
	
	//canvas clone
	/*$('#export').on('click', function(){	
		//$('#timeWrapper').clone().appendTo('#clone');
		//$('#clone #timeWrapper').css({'left':'0px'});
		//$('#clone #timeInner').prepend('<div class="circle"></div>');
		$('#timeline, #customize').css('display','none');
		$('#export').css('display','none');
		$('#back, #print, #canvasPlay').css('display','block'); //#clone
		
	});*/
	
	$('#back').on('click', function(){
		$('#timeline, #customize').css('display','block');
		$('#export').css('display','block');
		$('#back, #print, #canvasPlay, #clear, #save').css('display','none'); //#clone
		$('#canvasImg').attr('src',' ');
		$('#imgWrapper').css('display','none');
		//$('#clone #timeWrapper').remove();
		return false;
	});
	
	//Kinetic canvas	
	$('#clear').on('click', function() {
		clearCanvas();
		return false;
	});
	
	//Save as image
	$('#save').on('click', function() {
		saveImage();
		return false;
	});
	
	//Save as JSON and generate timeline - Preview button
	$('#saveJSON').on('click', function(){
		$('#timeline, #customize').css('display','none');
		$('#export').css('display','none');
		$('#back, #print, #canvasPlay, #clear, #save').css('display','block');
		
		//DATA
		var jsonVal = $('#jsonVal').val();
		data = JSON.parse(jsonVal);
		//data = $.makeArray(dataF);		
		for (i = 0; i < data.length; i++) {	
			console.log("REAL: "+ data[i].date);
			data.sort(function(a,b){
				a = new Date(a.date);
				b = new Date(b.date);
				//if (a > b) return 1;
				//if (a < b) return -1;
				//return 0;
				return a<b?-1:a>b?1:0;
			});	
		}
		
		//GENERATE
		dataLength = data.length;
			if ($('#container canvas').is(':visible')) {
				clearCanvas();
				$('#container div').remove();
				generateTimeline2();
			} else {
				generateTimeline2();
			}
		hideCanvasSupport()	
	});
	
	/*$('#generateTimeline').on('click', function(){
		var jsonVal = $('#jsonVal').val();
		data = JSON.parse(jsonVal);	
			for (i = 0; i < data.length; i++){
				console.log('data title ' + data[i].title + 'data date: ' + data[i].date);
			}
		dataLength = data.length;
		console.log('data length: ' + dataLength);	
		generateTimeline2();
	});*/
	
	//var data = [{ "title": "Project 1", "date": "01/01/2013"},{ "title": "Project 2", "date": "01/02/2013" }, { "title": "Project 3", "date": "01/03/2013" }, { "title": "Project 4", "date": "01/04/2013" }, { "title": "Project 5", "date": "01/05/2013" }, { "title": "Project 6", "date": "01/06/2013" }];
	//var dataLength = data.length;

	/*var arr = [ "one", "two", "three", "four", "five" ];
	var obj = { one:1, two:2, three:3, four:4, five:5 };
	
	$.each(data, function(title, date) {
		console.log('title: ' + this.title + ' date: ' + this.date);
	});

	$.each(obj, function(i, val) {
		console.log('i: ' + i + ' and val: ' +val);
	});*/
	
	// bind event handler to clear button
	
});//END document.ready

/*----------------------------------------------------------------------*/
/* Canvas Functions                                           			*/
/*----------------------------------------------------------------------*/
	function removeHighlight(){
		$('span.completeTasks strong').removeClass('highlight');
	}

	function hideCanvasSupport() {
		$('.cSupport, .cNotSupport').hide();
	}
	
   	function clearCanvas() {
        stage.clear();
		$('#imgWrapper').hide();
	}
	
	function countProperties(obj) {
		var prop;
		var propCount = 0;

		for (prop in obj) {
			propCount++;
		}
		return propCount;
		alert(propCount);
	}
	
	function generateTimeline2(){
		var janWidth = 0; var febWidth = 0; var marWidth = 0; var aprilWidth = 0; var mayWidth = 0; var juneWidth = 0; var julWidth = 0; var augWidth = 0; var septWidth = 0; var octWidth = 0; var novWidth = 0; var decWidth = 0;
		var canvasWidth = (dataLength * 150) + 250;
		var canvasHeight = 420;
		var canvasWrapperWidth = canvasWidth + 100;
		var containerWidth = canvasWidth;

		$('#canvasWrapper').css({'width': canvasWrapperWidth});
		$('#container').css('width', containerWidth);

		var timelineTitle = $('h1.timelineTitle').text();
		var containerWidthTrue = $('#container').width();
		var timelineTextPos = containerWidthTrue / 2;
		var timelineTextWidth = $('.timelineTitle').width();
		var timelineTextSize = $('#timelineTitleSize').val();
		var timelineTextColour = $('#timelineTitleColour').val();
			
		var textText; var dateText; var timelineText; 
		var xPos = 0;		
		
		var colors = ['#ff0000','#00ff00','#0000ff','rgb(50,50,50)','rgb(200,200,200)','purple','orange','black'];
		var color = colors[Math.floor(Math.random()*colors.length)];
				
		var textColour = $('#titleColour').val(); 
		var dateColour = $('#dateColour').val();
		var lineColour = $('#lineColour').val();
		var lineThick = $('#thick').val();
		var gridWidth = 1;
		var gridColour = "#d5d5d5";
				
		var textSize = $('#titleSize').val();
		var dateSize = $('#dateSize').val();
		
		stage = new Kinetic.Stage({ container: 'container', width: canvasWidth, height: canvasHeight });	
		layer = new Kinetic.Layer();
		timelineText = new Kinetic.Text({ x: timelineTextPos, y: 10, text: timelineTitle, fontSize:  timelineTextSize, fontFamily: 'Arial', fill: timelineTextColour, draggable: true });	
			
		janGroup = new Kinetic.Group({ draggable:true });
		febGroup = new Kinetic.Group({ draggable:true });
		marGroup = new Kinetic.Group({ draggable:true });
		aprilGroup = new Kinetic.Group({ draggable:true });	
		mayGroup = new Kinetic.Group({ draggable:true });	
		juneGroup = new Kinetic.Group({ draggable:true });
		julGroup = new Kinetic.Group({ draggable:true });
		augGroup = new Kinetic.Group({ draggable:true });
		septGroup = new Kinetic.Group({ draggable:true }); 
		octGroup = new Kinetic.Group({ draggable:true }); 
		novGroup = new Kinetic.Group({ draggable:true });	
		decGroup = new Kinetic.Group({ draggable:true });
			
			//var testLength = Math.floor(Math.random()*200) * 5;
				/*var janNum = $.map(data, function(value, key) { 
					var dataValues = value.date; 
					var newDate = new Date(value.date);
					var newTitle = value.title;
					var b = newDate.getMonth(); 
					if (b == 0) { 
					return newDate; 
					} else {} ; 
				});
				
				var janLength = janNum.length;
				var febNum = $.map(data, function(value, key) { var dataValues = value.date; var newDate = new Date(value.date);var b = newDate.getMonth(); if (b == 1) { return newDate; } });
				var febLength = febNum.length;
				var marNum = $.map(data, function(value, key) { var dataValues = value.date; var newDate = new Date(value.date);var b = newDate.getMonth(); if (b == 2) { return newDate; } });
				var marLength = marNum.length;
				var aprilNum = $.map(data, function(value, key) { var dataValues = value.date; var newDate = new Date(value.date);var b = newDate.getMonth(); if (b == 0) { return newDate; } });
				var aprilLength = aprilNum.length;	*/
				
		//loop through values
		var num = 0;			
		for (i = num; i < data.length; i++) {	
				xPos += 150;
				var xPos2 = xPos+150;
				var xPos3 = xPos2;
				var xPos4 = xPos3 + 20;
				var yPos = canvasHeight / 2; 
				var xPosText = xPos2 + 15;
				var xPosDate = xPos2;
				var topTitlePos = yPos - (yPos/3); var bottomTitlePos = yPos + (yPos/3);				
				var textTitlePosTop = topTitlePos - 30; var textTitlePosBottom = bottomTitlePos + 10;				
				var dateTitlePosTop = topTitlePos + 75; var dateTitlePosBottom = bottomTitlePos - 90;
				
				var dataValues = data[i].date;
				var newDate = new Date(dataValues);
				var month = newDate.getMonth();
				//generateLinesPerMonth();
				if (month == 0) {	 
					//JAN
					var monthVal = "Jan";
					generateLinesPerMonth();
					janGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					janGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					janGroup.add(textText);
					janGroup.add(dateText);
					janGroup.add(redLine);
					janGroup.add(timelineText);
					janGroup.setWidth(xPos);
					janWidth = janGroup.getWidth();
					janGroup.move(-30, 0);
					layer.add(janGroup);

				} else if (month == 1) { 
					//FEB
					var monthVal = "Feb";
					generateLinesPerMonth();
					febGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					febGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });http://www.html5canvastutorials.com/libraries/kinetic-v4.3.0-beta2.js
					febGroup.add(textText);
					febGroup.add(dateText);
					febGroup.add(redLine);
					febGroup.add(timelineText);
					febGroup.setWidth(xPos);
					febWidth = febGroup.getWidth();
					febGroup.move(0, 0);
					layer.add(febGroup);
				} else if  (month == 2) { 
					//MAR
					var monthVal = "Mar";
					generateLinesPerMonth();
					marGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					marGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					marGroup.add(textText);
					marGroup.add(dateText);
					marGroup.add(redLine);
					marGroup.add(timelineText);
					marGroup.setWidth(xPos);
					marWidth = marGroup.getWidth();					
					marGroup.move(30, 0);
					layer.add(marGroup);
				} else if (month == 3) { 
					//APR
					var monthVal = "April";
					generateLinesPerMonth();
					aprilGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					aprilGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					aprilGroup.add(textText);
					aprilGroup.add(dateText);
					aprilGroup.add(redLine);
					aprilGroup.add(timelineText);
					aprilGroup.setWidth(xPos);
					aprilWidth = aprilGroup.getWidth();
					aprilGroup.move(60, 0);
					layer.add(aprilGroup);
				} else if (month == 4) {
					//MAY
					var monthVal = "May";
					generateLinesPerMonth();
					mayGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					mayGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					mayGroup.add(textText);
					mayGroup.add(dateText);
					mayGroup.add(redLine);
					mayGroup.add(timelineText);
					mayGroup.setWidth(xPos);
					mayWidth = mayGroup.getWidth();
					mayGroup.move(90, 0);
					layer.add(mayGroup);
				} else if (month == 5) { 
					//JUNE
					var monthVal = "June";
					generateLinesPerMonth();
					juneGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					juneGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					juneGroup.add(textText);
					juneGroup.add(dateText);
					juneGroup.add(redLine);
					juneGroup.add(timelineText);
					juneGroup.setWidth(xPos);
					juneWidth = juneGroup.getWidth();
					juneGroup.move(120, 0);
					layer.add(juneGroup);
				} else if (month == 6) { 
					//JULY
					var monthVal = "July";
					generateLinesPerMonth();
					julGroup.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
					julGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					julGroup.add(textText);
					julGroup.add(dateText);
					julGroup.add(redLine);
					julGroup.add(timelineText);
					julGroup.setWidth(xPos);
					julWidth = julGroup.getWidth();
					julGroup.move(150, 0);
					layer.add(julGroup);
				}  else if (month == 7) { 
					//AUG
					var monthVal = "Aug";
					generateLinesPerMonth();
					augGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
					augGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					augGroup.add(textText);
					augGroup.add(dateText);
					augGroup.add(redLine);
					augGroup.add(timelineText);
					augGroup.setWidth(xPos);
					augWidth = augGroup.getWidth();
					augGroup.move(180, 0);
					layer.add(augGroup);
				} else if (month == 8) { 
					//SEPT
					var monthVal = "Sept";
					generateLinesPerMonth();
					septGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
					septGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					septGroup.add(textText);
					septGroup.add(dateText);
					septGroup.add(redLine);
					septGroup.add(timelineText);
					septGroup.setWidth(xPos);
					septWidth = septGroup.getWidth();
					septGroup.move(210, 0);
					layer.add(septGroup);
				} else if (month == 9) { 
					//OCT
					var monthVal = "Oct";
					generateLinesPerMonth();
					octGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
					octGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					octGroup.add(textText);
					octGroup.add(dateText);
					octGroup.add(redLine);
					octGroup.add(timelineText);
					octGroup.setWidth(xPos);
					octWidth = octGroup.getWidth();
					octGroup.move(240, 0);
					layer.add(octGroup);
				} else if (month == 10) { 
					//NOV
					var monthVal = "Nov";
					generateLinesPerMonth();
					novGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
					novGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					novGroup.add(textText);
					novGroup.add(dateText);
					novGroup.add(redLine);
					novGroup.add(timelineText);
					novGroup.setWidth(xPos);
					novWidth = novGroup.getWidth();
					novGroup.move(270, 0);
					layer.add(novGroup);
				} else if (month == 11) { 
					//DEC
					var monthVal = "Dec";
					generateLinesPerMonth();
					decGroup.on('mouseover', function() { document.body.style.cursor = 'move'; });
					decGroup.on('mouseout', function() { document.body.style.cursor = 'default'; });
					decGroup.add(textText);
					decGroup.add(dateText);
					decGroup.add(redLine);
					decGroup.add(timelineText);
					decGroup.setWidth(xPos);
					decWidth = decGroup.getWidth();
					decGroup.move(300, 0);
					layer.add(decGroup);
				} else { }
				
		}//end loop
		function generateLinesPerMonth() {
			if (i % 2) {
				textText = new Kinetic.Text({ x: xPosText, y: textTitlePosBottom, text: data[i].title, fontSize: textSize, fontFamily: 'Arial', fill: textColour, width: 150, draggable: true });
				dateText = new Kinetic.Text({ x: xPosDate, y: dateTitlePosBottom, text: data[i].date, fontSize: dateSize, fontFamily: 'Arial', fill: dateColour, draggable: true });				
				textText.setOffset({ x: textText.getWidth() / 2 });								
				dateText.setOffset({ x: dateText.getWidth() / 2 });		
				redLine = new Kinetic.Line({ points: [xPos, yPos, xPos2, yPos, xPos2, bottomTitlePos], stroke: lineColour, strokeWidth: lineThick, lineCap: 'round', lineJoin: 'round' });
			} else {
				textText = new Kinetic.Text({ x: xPosText, y: textTitlePosTop, text: data[i].title, fontSize: textSize, fontFamily: 'Arial', fill: textColour, width:150, draggable: true });				
				dateText = new Kinetic.Text({ x: xPosDate, y: dateTitlePosTop, text: data[i].date, fontSize: dateSize, fontFamily: 'Arial', fill: dateColour, draggable: true });								
				textText.setOffset({ x: textText.getWidth() / 2 });
				textText.setOffset({ y: textText.getHeight() / 2 });				
				dateText.setOffset({ x: dateText.getWidth() / 2 });							
				redLine = new Kinetic.Line({ points: [xPos, yPos, xPos2, yPos, xPos2, topTitlePos], stroke: lineColour, strokeWidth: lineThick, lineCap: 'round', lineJoin: 'round' });					
			}
			redLine.move(-130, 0);
			dateText.move(-130,0);
			textText.move(-130, 0);
			textText.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
			textText.on('mouseout', function() { document.body.style.cursor = 'default'; });
			dateText.on('mouseover', function() { document.body.style.cursor = 'pointer'; });
			dateText.on('mouseout', function() { document.body.style.cursor = 'default'; });
		}
				
		(function generateGraphLines() {
			graphLineX = [];
			graphLineY = [];
			var gridPosY = 0;
			var gridPosX = 0;
			for(j = 0; j < canvasWidth; j++){
				gridPosY += 20;
				gridPosX +=20;
				
				graphLineX.push(j);
				graphLineX[j] = new Kinetic.Line({ points: [0, gridPosY, canvasWidth, gridPosY], stroke: gridColour, strokeWidth: gridWidth, lineCap: 'square', lineJoin: 'square' });
				
				graphLineY.push(j);
				graphLineY[j] = new Kinetic.Line({ points: [gridPosX, 0, gridPosX, canvasHeight], stroke: gridColour, strokeWidth: gridWidth, lineCap: 'square', lineJoin: 'square' });
				
				graphLineY[j].moveToBottom();
				graphLineX[j].moveToBottom();
				layer.add(graphLineY[j]);
				layer.add(graphLineX[j]);
			}
		})();//self invoking generate graph
			
		var stageWidthHalf = stage.getWidth() / 2;
		janText = new Kinetic.Text({
				//x: xPos2, //stage.getWidth() / 5,
				//x: ((stage.getWidth()/2) - (janText.getWidth()/2)),
			x: janWidth,
			y: 50, 
			text: "JAN",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true
		});
			
		febText = new Kinetic.Text({
			x:  febWidth, 
			y: 50, 
			text: "FEB",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		marText = new Kinetic.Text({
			x: marWidth, 
			y: 50, 
			text: "MAR",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		aprilText = new Kinetic.Text({
			x:  aprilWidth, 
			y: 50, 
			text: "APRIL",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		mayText = new Kinetic.Text({
			x:  mayWidth, 
			y: 50, 
			text: "MAY",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		juneText = new Kinetic.Text({
			x:  juneWidth, 
			y: 50, 
			text: "JUNE",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		julText = new Kinetic.Text({
			x:  julWidth, 
			y: 50, 
			text: "JUL",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		augText = new Kinetic.Text({
			x:  augWidth, 
			y: 50, 
			text: "AUG",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		septText = new Kinetic.Text({
			x:  septWidth, 
			y: 50, 
			text: "SEPT",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		octText = new Kinetic.Text({
			x: octWidth, 
			y: 50, 
			text: "OCT",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		novText = new Kinetic.Text({
			x: novWidth, 
			y: 50, 
			text: "NOV",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});
		
		decText = new Kinetic.Text({
			x:  decWidth, 
			y: 50, 
			text: "DEC",
			fontSize:  16,
			fontFamily: 'Arial',
			fill: timelineTextColour,
			//width: timelineTextWidth,
			draggable: true				
		});

		janGroup.add(janText);
		febGroup.add(febText);
		marGroup.add(marText);
		aprilGroup.add(aprilText);
		mayGroup.add(mayText);
		juneGroup.add(juneText);
		julGroup.add(julText);
		augGroup.add(augText);
		septGroup.add(septText);
		octGroup.add(octText);
		novGroup.add(novText);
		decGroup.add(decText);
		layer.add(timelineText);
		stage.add(layer);
	}
	
	function saveImage() {
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
	}

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


	//Knockout Functions
	function Task(data) {
		this.title = ko.observable(data.title).extend({ required: "Please enter a task name" });
		this.date = ko.observable(data.date);
		this.isDone = ko.observable(data.isDone);	
	}

	function tfTitle(data) {
		this.timelineTitle = ko.observable(data.timelineTitle);
	}

	function TaskListViewModel() {
		// Data
		var self = this;
		
		self.tasks = ko.observableArray([]);
		self.titleTimeline = ko.observableArray([]);
		
		/*this.itemToAdd = ko.observable("");*/
		
		self.newTaskText = ko.observable();
		self.newDateText = ko.observable();
		self.incompleteTasks = ko.computed(function() {
			return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
		});
		
		/*this.addItem = function () {
			if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0)) // Prevent blanks and duplicates
            this.allItems.push(this.itemToAdd());
			this.itemToAdd(""); // Clear the text box
		};*/
		
		self.newTimelineTitle = ko.observable();
		
		self.sortItems = function() {
			self.tasks.sort();
		};
		
		// Operations
		self.addTitle = function() {
			self.titleTimeline.remove(tfTitle);
			//self.titleTimeline.sort();
			self.titleTimeline.push(new tfTitle({ timelineTitle: this.newTimelineTitle()}));
			self.newTimelineTitle("");
			titleColour();
		}
		
		self.addTask = function() {
			//self.tasks.sort();
			self.tasks.push(new Task({ title: this.newTaskText(), date: this.newDateText()}));
			var x = self.newTaskText("");
			var y = self.newDateText("");
			timeBlocksAddTaskStyle();			
		};
		
		self.removeTask = function(task) { 
			self.tasks.remove(task);
			timeBlocksRemoveTaskStyle(); 			
		};
		
		self.removeTitle = function(tfTitle) {
			self.titleTimeline.remove(tfTitle);
		};
		
		var originalLineThickness = $('.top').css({'border-bottom':'5px solid #ccc'});
		self.addThick = function(){
			thickValidation();
		};

		self.save = function() {
			self.lastSavedJson(JSON.stringify(ko.toJS(self.tasks), null, 2));
			//self.tasks.sort();
		};

		self.lastSavedJson = ko.observable("");	
		
	}
	
	function timeBlocksAddTaskStyle() {
				$('.timeBlocks').removeClass('timeBlockBottom').removeClass('timeBlockTop');
			//add classes
				$('.timeBlocks:odd').addClass('timeBlockBottom');
				$('.timeBlocks:even').addClass('timeBlockTop');
					
				//calculuate title horizontal position
				var mTitleWidth = $('.mileTwrapper').width();
				var mTitleRight = -(mTitleWidth / 3.598599604963728)+'%'; //4.75
				$('.mileTwrapper').css({'right': mTitleRight});
				
				//reconfigure line thickness
				$('input#thick').val(4);
				var lineThicknessValx = $('input#thick').val();
				$('.top').css({'border-bottom-width': lineThicknessValx});

				//reconfigure title colour
				var titleColourValx = $('input#titleColour').val();
				$('.mileStoneTitle').css({'color': titleColourValx});
				
				//reconfigure date colour
				var dateColourValx = $('input#dateColour').val();
				$('.mileStoneDate').css({'color': dateColourValx});
				
				//reconfigure line colour
				var lineColourValx = $('input#lineColour').val();
				$('.top, .bottom').css({'border-bottom-color':lineColourValx, 'border-right-color':lineColourValx});
				
				//reconfigure bg colour
				var bgColourValx = $('input#bgColour').val();
				$('.mileTwrapper, .mileDwrapper').css({'background-color': bgColourValx});
				
				//update time inner width
				var articleWidth = $('.timeBlocks').width();
				var timeInnerWidth = $('#timeInner').width();
				var totalTimeWidth = timeInnerWidth + articleWidth + 200;
				$('#timeInner, #timeWrapper').css({'width': totalTimeWidth});
	}
	
	function timeBlocksRemoveTaskStyle() {
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
	}
	
	function thickValidation() {
			var thickRegEx = "^[0-9]+$";
			var thickValidation = $('input#thick').val();
			
			//error handling
			if((thickValidation.match(thickRegEx)) && ((thickValidation <= 7) && (thickValidation > 0)) ){
				var thickVal = $('input#thick').val() +'px';
				$('.top').css({'border-bottom-width':thickVal});
				$('.thickError').css('display','none');		
			} else {
				$('.thickError').fadeIn('fast');
				return false;
			}
	}
	
	function titleColour(){
		//reconfigure title colour
		var timelineTitleColourValx = $('input#timelineTitleColour').val();
		$('.timelineTitle').css({'color':  timelineTitleColourValx});
	}

	