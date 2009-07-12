$(function() {
  ui_init();
});

function ui_init() {
  add_image_loader();
  help_init();
  calendar_init();
  table_init();
}

function help_init() {
  $('div#help').hide();
  $('div#help').after('<a href="#" class="help_link">Help</a>');
  $('a.help_link').livequery('click', function(event) {
		event.preventDefault();
    $('div#help').toggle('blind');
  });
}

$('a.calendar, a.table').livequery('click', function(event) {
  event.preventDefault();
  
  var href = $(this).attr("href");
  update_dashboard(href);
  
  href.match(/calendar/) ? calendar_init() : table_init();
});

function update_dashboard(link) {
  ajax_get(link, function(data) {
    $('div#dashboard').html(data);
    $('table#reservations_table').length ? table_init() : calendar_init();
    add_image_loader();
  });
}

function add_image_loader() {
  $('div#dashboard').prepend('<img class="ajax_loader" src="images/ajax-loader.gif" alt="Ajax Loader" />');
  $('img.ajax_loader').hide();
}

function load_new_reservation_form(link) {
  if($('div#new_reservation_wrapper').length) {
    $('div#new_reservation_wrapper').blind_remove();
    link.text('New Reservation');
  }
  else {
    ajax_get(link.attr("href"), function(data) {
      link.text('Cancel');
      $('div#content').prepend(data);
      $('div#new_reservation_wrapper').show("blind").find('select#reservation_unit_id').disable_element();
    });
  }
}

$('.resdatepicker, .editdatepicker').livequery(function() {
  $('form.new_reservation select#reservation_unit_id').disable_element();
  datepicker = $(this);
  datepicker.datepicker({
    showOn: 'focus',
    buttonImageOnly: false,
    constrainInput: true,
    dateFormat: 'd M, yy',
    beforeShow: customRange,
    onClose: function() {
      $(this).hasClass('.editdatepicker') ? '' : get_available_rooms($(this));
    }
  });
});

function get_available_rooms(input) {
  var fieldset = $(input).parent();
  var start_date_value = fieldset.find('input#reservation_start_date').val();
  var end_date_value = fieldset.find('input#reservation_end_date').val();
  
  if(start_date_value.length == 0 || end_date_value.length == 0) {
    $('select#reservation_unit_id').disable_element();
  }
  else {
    
    $('select#reservation_unit_id').enable_element().after('<img class="small_ajax_loader" src="images/small-ajax-loader.gif" />');
    $.getJSON('/units',
      {start_date: start_date_value, end_date: end_date_value },
      function(data) {
        $('img.small_ajax_loader').remove();
        $('p.reservation_error, p.reservation_success').remove();
        
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