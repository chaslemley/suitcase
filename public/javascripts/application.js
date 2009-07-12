// $(function() {
//   help_setup();
//   calendar_init();
//   bind_window_resize();
//  table_init();
//  add_dashboard_controls();
// });

///////////////////////////////////////////////////////////////////////////////////////////////////

// rails auth token enabled in jquery
// $(document).ajaxSend(function(event, request, settings) {
//   if (typeof(AUTH_TOKEN) == "undefined") return;
//   settings.data = settings.data || "";
//   settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
//   console.log(settings.data);
// });

// add javascript request type

$('div#guest_information form, div#reservation_information form').livequery('submit', function(event) {
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
          var start_date = '';
          var first_td = $('table#calendar td')[0];
          if(first_td)
            start_date = first_td.id.match(/\d{4}-\d{2}-\d{2}/);
          form.remove();
          info_wrapper.find('ul, dl').replaceWith(data.html_data);  
          show_edit_button($('a.cancel'));
          info_wrapper.show("blind");
          update_dashboard($('div.modes a').attr("href") == "/?mode=calendar" ? "/?mode=table" : "/?mode=calendar&qd=" + start_date);
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

$('div#actions select').livequery('change', function(event) {
  $(this).parent('form').submit();
});

$('div#actions form').livequery("submit", function(event) {
  event.preventDefault();

  $.ajax({
    url: $(this).attr("action"),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
  
  beforeSend: function(xhr) {
    xhr.setRequestHeader("Accept", "text/javascript");
  },
  
  success: function(data) {
    if(data.message == "success") {
      var start_date = '';
      var first_td = $('table#calendar td')[0];
      if(first_td)
        start_date = first_td.id.match(/\d{4}-\d{2}-\d{2}/);
      $('div.status span').attr("class", data.status_value).text(data.status_message);
      update_dashboard($('div.modes a').attr("href") == "/?mode=calendar" ? "/?mode=table" : "/?mode=calendar&qd=" + start_date);
    }
    if(data.message == "failure") {
      var response_text = eval(data.details);
      $('div#actions').prepend('<p class="error">' + capitalize(response_text[0][0]) + ' ' + response_text[0][1] + '.</p>');
    }
  }
 });
});

function capitalize(word) {
  return word.substr(0,1).toUpperCase() + word.substr(1, word.length -1);
}

$('a.link_to_unit_details').livequery('click', function(event) {
  event.preventDefault();
  var href = $(this).attr("href");
  if($('div#new_unit_wrapper').length) {
    $('div#new_unit_wrapper').blind_remove(function() {
      ajax_get(href, show_unit_list_details);
    });
    $('a.primary_operation[href="/units/new"]').text('New Unit');
  }
  else {
    ajax_get(href, show_unit_list_details);
  }
});

function show_unit_list_details(data) {
  var previous_details = $('div.unit_information_wrapper');
  var new_details = $("<div class='unit_information_wrapper wrapper'>" + data + "<a href='#' class='close'>close</a></div>");
  $('a.close').livequery('click', close_div);
  
  $('div#units_list').before(new_details.hide());
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

function add_unit_information(data) {
  $('div#content').prepend(data).find('div.unit_information_wrapper').hide();
  $('div.unit_information_wrapper').show('blind');
}

$('div#unit_information form.edit_unit').livequery('submit', function(event) {
  event.preventDefault();
  
  var form = $(this);
  $.ajax({
    url: $(this).attr("action"),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
    
  beforeSend: function(xhr) {
    xhr.setRequestHeader("Accept", "text/javascript");
  },

  success: function(data) {
    if(data.message == 'success') {
      var info_wrapper = form.parent();
      info_wrapper.hide("blind", function() {
        var start_date = '';
        var first_td = $('table#calendar td')[0];
        if(first_td)
          start_date = first_td.id.match(/\d{4}-\d{2}-\d{2}/);
        form.remove();
        info_wrapper.find('ul, dl, p').replaceWith(data.html_data);  
        show_edit_button($('a.cancel'));
        info_wrapper.show("blind");
      });
      
    }
    else {
      form.validate(data.details);
      form.parent().prepend(error_messages(data["details"])).find('.error').hide().fadeIn(500);
    }
  }
  });
});

