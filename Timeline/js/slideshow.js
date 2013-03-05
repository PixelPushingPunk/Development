(function($){
  $(document).ready(function(){
    var currentPosition = 0;
    var slideWidth = 990;
    var slides = $('.slide');
    var numberOfSlides = slides.length;

    // Remove scrollbar in JS
    //
    $('#slidesContainer').css('overflow', 'hidden');

    // Wrap all .slides with #slideInner div
    //
    slides
    .wrapAll('<div id="slideInner"></div>')

    // Float left to display horizontally, readjust .slides width
    //
    .css({
      'float' : 'left',
      'width' : slideWidth
    });

    // Set #slideInner width equal to total width of all slides
    //
    $('#slideInner').css('width', slideWidth * numberOfSlides);

    // Insert left and right arrow controls in the DOM
    //
    $('#slideshow')
      .prepend('<span class="control" id="leftControl">Back</span>')
      .append('<span class="control" id="rightControl">Next</span>')
      .append('<div class="right previewWrapper"><button data-bind="click: save, enable: tasks().length>0" id="saveJSON">Preview</button></div>');

    // Hide left arrow control on first load
    //
    manageControls(currentPosition);

    // Display step position
    stepsPosition(currentPosition);

    // Create event listeners for .controls clicks
    //
    $('.control')
      .bind('click', function(){
        var $this = $(this);
      // Determine new position
        //currentPosition = ($(this).attr('id')=='saveJSON')? currentPosition+1 : currentPosition-1;
        currentPosition = ($(this).attr('id')==('rightControl'||'saveJSON'))? currentPosition+1 : currentPosition-1;
  
        // Hide or show controls
        //
        manageControls(currentPosition);

        // Display step position
        //
        stepsPosition(currentPosition);

        console.log(currentPosition);

        // Move slideInner using margin-left
        //
        $('#slideInner').animate({
          'marginLeft' : slideWidth*(-currentPosition)
        });
      });

      $('#saveJSON').on('click', function(){
        currentPosition = ($(this).attr('id')=='saveJSON')? currentPosition+1 : currentPosition-1;
         // Hide or show controls
        //
        manageControls(currentPosition);

        // Display step position
        //
        stepsPosition(currentPosition);

        //left current position
        //
        var secondToLast = numberOfSlides-2;
        var lastPos = numberOfSlides-1;
        console.log('lastPos: '+lastPos);
        if(currentPosition==lastPos) {
            $('#leftControl').on('click', function() {
               // Display play about timeline on back click from canvas
                  $('#timeline, #customize').css('display','block');
                  $('.previewWrapper, .previewWrapp #saveJSON').show();
                  $('#export').css('display','block');
                  $('#back, #print, #canvasPlay, #clear, #save').css('display','none'); //#clone
                  $('#canvasImg').attr('src',' ');
                  $('#imgWrapper').css('display','none');
            });
        }
        // Move slideInner using margin-left
        //
        $('#slideInner').animate({
          'marginLeft' : slideWidth*(-currentPosition)
        });
      });

      // Skip to step
      //

    // manageControls: Hides and shows controls depending on currentPosition
    //
    function manageControls (position) {
      // Hide left arrow if position is first slide
      if (position==0){ 
        $('#leftControl').hide(); 
      } else { 
        $('#leftControl').show(); 
      }
      
      // Hide right arrow if position is last slide
      if (position==numberOfSlides-2) {
          $('#rightControl').hide();
          $('.previewWrapper #saveJSON').show();
      } else if (position==numberOfSlides-1) { 
          $('#rightControl').hide();
          $('.previewWrapper, .previewWrapper #saveJSON').hide();
      } else { 
        $('#rightControl').show() 
        $('.previewWrapper #saveJSON').hide(); 
      }
    }

    // Target steps
    //
    function stepsPosition (position) {
      var step1 = $('#step .step1');
      var step2 = $('#step .step2');
      var step3 = $('#step .step3');
      if (position == 0 || position == 1 || position == 2) {
        step1.addClass('bold');
        step2.removeClass('bold');
        step3.removeClass('bold');
      }
      if(position==numberOfSlides-2){
        step1.removeClass('bold');
        step2.addClass('bold');
        step3.removeClass('bold'); 
      }
      if (position==numberOfSlides-1) {
        step1.removeClass('bold');
        step2.removeClass('bold');
        step3.addClass('bold');
      }
      /*
      if (position==numberOfSlides-1) {
        step3.addClass('bold');
        step1.removeClass('bold');
        step2.removeClass('bold');
      }
      */
    }

  }); // End.document.ready
})(jQuery);