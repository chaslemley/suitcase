$('.datepicker').livequery(function() {
  $(this).parent('form').find('input[type=submit]').hide();
  make_datepicker($(this));
});

$('form#bookings_form').livequery('submit', function(event) {
  event.preventDefault();
  
  make_json_request($(this));
});

function make_json_request(form) {
  $.getJSON($(form).attr("action"), form.serialize(), function(json) {
    $('div#unit_list').html(json.html_data);
  });
}

function create_unit_list(json) {
  var list = "<ul>\n";
  $(json).each(function() {
    list += "<li>\n" + create_unit(this.unit) + "</li>\n";
  });
  
  list += "</ul>";
  
  return list;
}

function create_unit(unit) {
  var xhtml = "\t<h4>" + unit.name + "</h4>\n";
  xhtml += "\t<p>" + unit.description + "</p>\n";
  xhtml += create_image_tag(unit.id, unit.photo_file_name, unit.name);

  return xhtml;
}

function create_image_tag(id, file_name, name) {
  return "<img src='/system/photos/" + id + "/small/" + file_name + "' alt='" + name + "' />";
}

function submit_datepicker_form(text, input) {
  var form = $('#' + input.id).parent();
  var start_date = form.find('input[id*=start_date]');
  var end_date = form.find('input[id*=end_date]');

  if(start_date.val() != '' && end_date.val() != '') {
    form.submit();
  }
}

function customRange(input) {
  minDate = new Date();
  if(input.id.match(/^.*end_date.*$/) && $(input).parent().find('input[id*=start_date]').val() != '') {
    minDate = new Date($('input[id*=start_date]').val());
  }
  return {
    minDate: minDate
  };
}

function make_datepicker(input) {
  datepicker = input;
  datepicker.datepicker({
    showOn: 'button',
    buttonImage: '/images/calendar.gif',
    buttonImageOnly: true,
    constrainInput: true,
    dateFormat: 'd M, yy',
    beforeShow: customRange,
    onSelect: submit_datepicker_form
  });
}
