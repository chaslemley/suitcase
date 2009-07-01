// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(document).ready(function() {
  $('.datepicker').livequery(function() {
    datepicker = $(this);
    datepicker.datepicker({
      showOn: 'focus',
      // buttonImage: '/images/calendar.gif',
      buttonImageOnly: false,
      constrainInput: true,
      dateFormat: 'd M, yy',
      onSelect: function(dateText) { $('form#date_picker').submit(); }
    });
  });
});

function calendar_slide(event) {
  event.preventDefault();

  var direction = '';
  switch($(this).attr("class")) {
    case 'previous_date':
      direction = "left";
    break;
    case 'next_date':
      direction = "right";
    break;
    default:
      direction = "down";
    break;
  }

  $.ajax({
    url: $(this).attr('href'),
    dataType: 'script',
    beforeSend: function() {
    	$('img.ajax_loader').show();
    },
    success: function(data, textStatus) {
      $('#dashboard').html(data).show('slide', {direction: direction});
      calendar_init();
    }
  });
}

$('div#calendar_nav a').livequery('click', calendar_slide);
	
	$('#date_picker').livequery('submit', function(event) {
		  event.preventDefault();  		
  		$.ajax({
  			dataType: 'script',
  			data: $('#date_picker').serialize(),
  			url: $(this).attr('action'),
  			beforeSend: function() {
        	$('img.ajax_loader').show();
        },
  			success: function(data, textStatus) {
  				$('#dashboard').html(data).show('slide', {direction: 'down'});
  				calendar_init();		
  			}
  		});
  	});	


function help_setup() {
  $('div#help').hide();
  $('div#help').after('<a href="#" class="help_link">Help</a>');
  $('a.help_link').livequery('click', function(event) {
		event.preventDefault();
    $('div#help').toggle('blind');
  });
}

function calendar_snap() {
  
  $('div#calendar_wrapper').width('100%');
  var width = $('div#calendar_wrapper').width();
  $('div#calendar_wrapper').width(Math.floor(width/100)*100);
}

function bind_window_resize() {
  $(window).resize(function() {
    calendar_init();
  });
}

function calendar_init() {
  calendar_snap();
  tooltip_hide();
  $('img.ajax_loader').hide();  
}

function tooltip_hide() {
  $('div.reservation div.tooltip').hide();
}

$('div.reservation div:first-child').livequery('mouseenter', function(event) {
  $(this).next('div.tooltip').show();
});

$('div.reservation div:first-child').livequery('mouseleave', function(event) {
  $('div.reservation div.tooltip').hide();
});


$(document).ready(function() {
  help_setup();
  calendar_init();
  bind_window_resize();
});