$(function() {
  calendar_init();
});

function calendar_init() {
  calendar_snap();
  bind_window_resize();
}

$('.datepicker').livequery(datepicker_init);
$('div#calendar_nav a').livequery( 'click', change_date );
$('form#date_picker').livequery('submit', set_date);
$('input#reservation_start_date').livequery('change', reload_calendar);

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

$('a.link_to_reservation_details').livequery('click', function(event) {
  event.preventDefault();
  var href = $(this).attr("href");
  if($('div#new_reservation_wrapper').length) {
    $('div#new_reservation_wrapper').blind_remove(function() {
      ajax_get(href, show_unit_details);
    });
    $('a.primary_operation[href="/reservations/new"]').text('New Reservation');
  }
  else {
    ajax_get(href, show_unit_details);
  }
});

function reload_calendar() {
  $('input#date').attr("value", $(this).val());
  $('form#date_picker').submit();
}

function datepicker_init() {
  datepicker = $(this);
  datepicker.datepicker({
    showOn: 'button',
    buttonImage: '/images/calendar.gif',
    buttonImageOnly: true,
    constrainInput: true,
    dateFormat: 'd M, yy',
    onSelect: function(dateText) { $('form#date_picker').submit(); }
  });
}

function calendar_snap() {
  var wrapper = $('div#calendar_wrapper');
  var margin =  parseInt(wrapper.css('margin-left'), 10) + parseInt(wrapper.css('margin-right'), 10);
  wrapper.width(wrapper.parent().width() - margin);

  var width = wrapper.width();
  wrapper.width(Math.floor(width/100)*100);
}

function change_date(event) {
  event.preventDefault();

  update_calendar($(this).attr('href'));
}

function update_calendar(href) {
  ajax_get(href, function(data, textStatus) {
    $('#dashboard').html(data);
    calendar_init();
  });
}

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

function set_date(event) {
  event.preventDefault();

  ajax_get($(this).attr('action'), function(data) {
    $('#dashboard').html(data);
    calendar_init();   
  }, $(this).serialize());
}

function bind_window_resize() {
  $(window).resize(function() {
    calendar_snap();
  });
}

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
				//need to get the url for the current one
				var new_start_date = data["start_date"];
        update_dashboard($('div.modes a').attr("href") == "/?mode=calendar" ? "/?mode=table" : "/?mode=calendar&qd=" + new_start_date );
      });
      $('#new_reservation').clearForm();
      $('form#new_reservation img').remove();
      $('select#reservation_unit_id').next('p.reservation_error, p.reservation_success').remove();
      $('select#reservation_unit_id').emptySelect().disable_element();
      $('h2+a.primary_operation').after("<p class='success_message'>" + data.details + "</p>");
      $('a.primary_operation[href="/reservations/new"]').text('New Reservation');
      $('div#new_reservation_wrapper').remove();
      $('p.success_message').fadeOut(6000, function() { $(this).remove(); });
      
  }
  else { //error
    $('#new_reservation').prepend(error_messages(data["details"])).find('.error').hide().fadeIn(500);
  }
}
