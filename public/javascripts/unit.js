$(function() {
  $('table#units_table').dataTable({
    "bLengthChange": false
  });
  
  $('div#units_table_previous').append("Previous");
  $('div#units_table_next').append("Next");
});

$('a.primary_operation[href="/units/new"]').livequery('click', function(event) {
  event.preventDefault();
  var link = $(this);
  if($('div.unit_information_wrapper').length) {
    $('div.unit_information_wrapper').blind_remove(function() {
      load_new_unit_form(link);
    });
  }
  else {
    load_new_unit_form(link);
  }
});

function load_new_unit_form(link) {
  if($('div#new_unit_wrapper').length) {
    $('div#new_unit_wrapper').blind_remove();
    link.text('New Unit');
  }
  else {
    ajax_get(link.attr("href"), function(data) {
      link.text('Cancel');
      $('div#content').prepend(data);
      $('div#new_unit_wrapper').show("blind").find('select#reservation_unit_id').disable_element();
    });
  }
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
