$(function() {
  help_setup();
  calendar_init();
  bind_window_resize();
});

$('div#calendar_nav a').livequery( 'click', change_date );
$('form#date_picker').livequery('submit', set_date);

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
      $('#dashboard').html(data);
      calendar_init();
    }
  });
}

function set_date(event) {
  event.preventDefault();
  
  $.ajax({
    dataType: 'html',
    data: $('#date_picker').serialize(),
    url: $(this).attr('action'),
    beforeSend: function(xhr) {
      $('img.ajax_loader').show();
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    success: function(data, textStatus) {
      $('#dashboard').html(data);
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

$.fn.blind_remove = function(callback) {
  return $(this).hide("blind", function() {
    $(this).remove();
    callback ? callback() : '';
  });
};

$('div.reservation div:first-child').livequery( function() {
  $(this).hover(
    function() {
      var tooltip = $(this).next('div.tooltip').clone().prependTo('body').hide();
      $(this).mousemove(function(event) {
        tooltip.show();
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
  var link = $(this);
  if($('div.reservation_details_wrapper').length) {
    $('div.reservation_details_wrapper').blind_remove(function() {
      load_new_reservation_form(link);
    });
  }
  else {
    load_new_reservation_form(link);
  }
});

function load_new_reservation_form(link) {
  if($('div#new_reservation_wrapper').length) {
    $('div#new_reservation_wrapper').blind_remove();
    link.text('New Reservation');
  }
  else {
    load_dashboard(link.attr("href"), function(data) {
      link.text('Cancel Reservation');
      $('div#content').prepend(data);
      $('div#new_reservation_wrapper').show("blind").find('select#reservation_unit_id').disable_element();
    });
  }
}

$('a.link_to_reservation_details').livequery('click', function(event) {
  event.preventDefault();
  var href = $(this).attr("href");
  if($('div#new_reservation_wrapper').length) {
    $('div#new_reservation_wrapper').blind_remove(function() {
      load_dashboard(href, show_unit_details);
    });
    $('a.primary_operation[href="/reservations/new"]').text('New Reservation');
  }
  else {
    load_dashboard(href, show_unit_details);
  }
});

function load_dashboard(href, success_function) {
  $.ajax({
    url: href,
    dataType: 'html',
    beforeSend: function(xhr) {
      $('img.ajax_loader').show();
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    success: function(data) {
      $('img.ajax_loader').hide();
      success_function(data);
    }
  });
}

function show_unit_details(data) {
  var previous_details = $('div.reservation_details_wrapper');
  var new_details = $("<div class='reservation_details_wrapper wrapper'>" + data + "<a href='#' class='close'>close</a></div>");
  
  $('a.close').livequery('click', close_div);
  
  $('div#dashboard').before(new_details.hide());
  if(previous_details.length > 0) {
    previous_details.hide("blind", 500, function() {
      $(this).remove();
      new_details.show("blind");
    });
  }
  else {
    new_details.show("blind");
  }
}



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
  $('select#reservation_unit_id').disable_element();
    datepicker = $(this);
    datepicker.datepicker({
      showOn: 'focus',
      // buttonImage: '/images/calendar.gif',
      buttonImageOnly: false,
      constrainInput: true,
      dateFormat: 'd M, yy',
      beforeShow: customRange,
      onClose: get_available_rooms
    });
  });
});

$(document).ready(function() {
  $('input#reservation_start_date').livequery('change', reload_calendar);
});

function reload_calendar() {
  $('input#date').attr("value", $(this).val());
  $('form#date_picker').submit();
}

function get_available_rooms() {
  var fieldset = $(this).parent();
  var start_date_value = fieldset.find('input#reservation_start_date').val();
  var end_date_value = fieldset.find('input#reservation_end_date').val();
  
  if(start_date_value.length == 0 || end_date_value.length == 0) {
    $('select#reservation_unit_id').disable_element();
  }
  else {
    $('select#reservation_unit_id').enable_element().after('<img src="images/small-ajax-loader.gif" />');
    $.getJSON('/units',
      {start_date: start_date_value, end_date: end_date_value },
      function(data) {
        $('form#new_reservation img').remove();
        $('select#reservation_unit_id').next('p.reservation_error, p.reservation_success').remove();
        
        if(data.message == 'success') {
          $('select#reservation_unit_id').loadSelect(data.units);
          var success_message = pluralize(data.units.length, "unit") + " available for this date range (" + pluralize(days_between(data.start_date, data.end_date), "night") + ").";
          $('select#reservation_unit_id').after("<p class='reservation_success'>" + success_message + "</p>");
        }
        else {          
          $('select#reservation_unit_id').emptySelect().disable_element().after("<p class='reservation_error'>"+ data.message + "</p>");
        }
      });
  }  
}

function days_between(start_date, end_date) {
  var arrival = Date.parse(start_date);
  var departure = Date.parse(end_date);
  
  return (departure - arrival)/86400000;
}

function pluralize(quantity, noun) {
  if(quantity != 1)
    return quantity + " " + noun + "s";
  else
    return quantity + " " + noun;
}

function customRange(input) {
	minDate = new Date();
	maxDate = null;
	if(input.id == 'reservation_end_date' && $('#reservation_start_date').val() != '') minDate = new Date(new Date($("#reservation_start_date").val()).getTime());
	if(input.id == 'reservation_start_date' && $('#reservation_end_date').val() != '') maxDate = new Date(new Date($('#reservation_end_date').val()).getTime());
	return {
		minDate: minDate,
		maxDate: maxDate
	};
}


$.fn.disable_element = function() {
  return this.attr("disabled", true);
};

$.fn.enable_element = function() {
  return this.attr("disabled", false);
};

$.fn.loadSelect = function(optionsDataArray) {
  return this.emptySelect().each( function() {
    if(this.tagName == 'SELECT') {
      var selectElement = this;
      $.each(optionsDataArray, function(index, optionData) {
        var option = new Option(optionData.unit.name,
                                optionData.unit.id);
        selectElement.add(option, null);
      });
    }
  });
};

$.fn.emptySelect = function() {
  return this.each(function() {
    if(this.tagName == 'SELECT') this.options.length = 0;
    var option = new Option('Please Select','');
    this.add(option, null);
  });
};


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
      $('form#new_reservation img').remove();
      $('select#reservation_unit_id').next('p.reservation_error, p.reservation_success').remove();
      $('select#reservation_unit_id').emptySelect().disable_element();
      $('h2+a.primary_operation').after("<p class='success_message'>" + data.details + "</p>");
      $('p.success_message').fadeOut(6000, function() { $(this).remove(); });
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
      var field = json[x][0].substr(0,1).toUpperCase() + json[x][0].substr(1, json[x][0].length -1);
      var problem = json[x][1];
      
      error_text += "<li>" + field.replace(/_/g,' ') + " " + problem.replace(/_/g,' ') +".</li>";
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

function close_div(event) {
  event.preventDefault();
  
  $(this).parent().hide("blind", function() { $(this).remove(); });
}

$('a.edit').livequery('click', function(event) {
  event.preventDefault();
  var current_element = $(this);
  
  $.ajax({
    url: $(this).attr("href"),
    dataType: 'html',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    success: function(data) {
      show_edit_form(data, current_element);
    }
  });
});

$('a.cancel').livequery('click', function(event) {
  event.preventDefault();
  
  show_edit_button($(this));
  var info_wrapper = $(this).parent().find('div.information_wrapper');
  info_wrapper.hide("blind", function() {
    info_wrapper.find('form').remove();
    info_wrapper.find('div.error').remove();
    info_wrapper.find('ul, dl').show();
    info_wrapper.show("blind");
  });
});

function show_edit_button(current_element) {
  current_element.text('edit').attr("class", "edit");
}


function show_edit_form(data, current_element) {
  show_cancel_button(current_element);
  var info_wrapper = current_element.parent().find('div.information_wrapper');
  info_wrapper.hide("blind", function() {
    var list = info_wrapper.find('ul, dl').hide();
    info_wrapper.prepend(data);
    info_wrapper.show("blind");
  });
}

function show_cancel_button(edit_button) {
  edit_button.text('cancel').attr("class", "cancel");
}

$('div.information_wrapper form').livequery('submit', function(event) {
  event.preventDefault();
  
  
  var form = $(this);
  $.ajax({
    url: form.attr("action"),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    success: function(data) {
			$('div.error').remove();
      if(data.message == 'success') {
        var info_wrapper = form.parent();
        info_wrapper.hide("blind", function() {
          form.remove();
          info_wrapper.find('ul, dl').replaceWith(data.html_data);  
          show_edit_button($('a.cancel'));
          info_wrapper.show("blind");
          calendar_slide("down", "/");
        });
        
      }
      else {
        form.validate(data.details);
        form.parent().prepend(error_messages(data["details"])).find('.error').hide().fadeIn(500);
      }
    }
  });
});

$.fn.validate = function(details) {
  var json = $(eval(details));
  var form = $(this);
  return form.find('input.text_field').each(function() {
    var input = $(this);
    input.removeClass('error');
    json.each(function() {
      var regex = new RegExp(this[0]);
      if(input.attr('id').match(regex)) {
        input.addClass('error');
      }
    });
  });
};