$(function() {
  help_setup();
  calendar_init();
  bind_window_resize();
});

$('div#calendar_nav a').livequery( 'click', change_date );
$('#date_picker').livequery('submit', set_date);

function change_date(event) {
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
  
  calendar_slide(direction, $(this).attr('href'));
  
}

function calendar_slide(direction, href) {
  
  
  $.ajax({ 
    url: href,
    dataType: 'html',
    processData: false,
    beforeSend: function(xhr) {
      $('img.ajax_loader').show();
      xhr.setRequestHeader("Accept", "text/javascript");
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
}

$('div.reservation div:first-child').livequery( function() {
  $(this).hover(
    function() {
      var tooltip = $(this).next('div.tooltip').clone().prependTo('body').fadeIn(200);
      $(this).mousemove(function(event) {
        tooltip.css("left", (event.pageX - tooltip.width()) + "px");
        tooltip.css("top", (event.pageY - tooltip.height() - 20) + "px");
      });
    },
    function() {
      $('body>div.tooltip').remove();
    }
  );
});

$('a.primary_operation[href="/reservations/new"]').livequery('click', function(event) {
  event.preventDefault();
  $('div#new_reservation_wrapper').toggle('blind');
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

$(document).ready(function() {
  $('.resdatepicker').livequery(function() {
    datepicker = $(this);
    datepicker.datepicker({
      showOn: 'focus',
      // buttonImage: '/images/calendar.gif',
      buttonImageOnly: false,
      constrainInput: true,
      dateFormat: 'd M, yy',
    });
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////////

// rails auth token enabled in jquery
$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  settings.data = settings.data || "";
  settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
});

// add javascript request type

$('#new_reservation').livequery('submit', function(event){
  event.preventDefault();
  
  $.ajax({
    dataType: 'json',
    type: 'POST',
    data: $(this).serialize(),
    url: $(this).attr('action'),
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    success: new_reservation_success
  });  
});

function new_reservation_success(data) {
  $('div.error').remove();

  if(data['message'] == "success") { //success
     $('div#new_reservation_wrapper').toggle('blind', function() {
        calendar_slide("down", "/");
        });
      $('#new_reservation').clearForm();
  }
  else { //error
    $('#new_reservation').prepend(error_messages(data["details"])).find('.error').hide().fadeIn(500);
  }
  
}


function error_messages(response_text){
  var json = eval(response_text);
  var error_text = "";
  var len = json.length;

  for (var x = 0; x <len; x++)
  {
      error_text += "<li>" + json[x][0] + " " + json[x][1] +".</li>";
  }

  if (len> 0){
      error_text = "<div class='error'><p>There was a problem with your submission.</p><ul>" + error_text + "</ul></div>";
    }

    return error_text;
  }



$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form')
      return $(':input',this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = '';
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
};

