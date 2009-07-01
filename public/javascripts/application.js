$(function() {
  help_setup();
  calendar_init();
  bind_window_resize();
});

$('div#calendar_nav a').livequery( 'click', calendar_slide );
$('#date_picker').livequery('submit', set_date);

function calendar_slide(event) {
  event.preventDefault();

  switch($(this).attr("class")) {
    case 'previous_date':
      var direction = "left";
    break;
    case 'next_date':
      var direction = "right";
    break;
    default:
      var direction = "down";
    break;
  }
  
  $.ajax({ 
    url: $(this).attr('href'),
    dataType: 'script',
    beforeSend: function() {
      $('img.ajax_loader').show();
    },
    success: function(data, textStatus) {
      $('#dashboard').html(data).show('slide', { direction: direction }, 800 );
      calendar_init();
    }
  });
}

function set_date(event) {
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
}

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
    calendar_snap();
  });
}

function calendar_init() {
  calendar_snap();
  $('div#dashboard').prepend('<img class="ajax_loader" src="images/ajax-loader.gif" alt="Ajax Loader" />');
  $('div.tooltip *:first-child').addClass('tooltip_top');
}

$('div.reservation div:first-child').livequery( function() {
  $(this).hover(
    function() {
      $(this).next('div.tooltip').fadeIn();
    },
    function() {
      $('div.reservation div.tooltip').fadeOut();
    }
  );
});

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
