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
  if(input.id.match(/^.*end_date.*$/) && $(input).parent().find('input[id*=start_date]').val() != '') {
    minDate = new Date($('input[id*=start_date]').val());
  }
  return {
    minDate: minDate
  };
}

function ajax_get() {
  var href = arguments[0];
  var success_function = arguments[1];
  var data_value = arguments[2] != null ? arguments[2] : '';
  
  $.ajax({ 
    url: href,
    type: 'GET',
    processData: false,
    data: data_value,

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

$.fn.disable_element = function() {
  return this.attr("disabled", true);
};

$.fn.enable_element = function() {
  return this.attr("disabled", false);
};

$.fn.blind_remove = function(callback) {
  return $(this).hide("blind", function() {
    $(this).remove();
    callback ? callback() : '';
  });
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

  $('a.edit').livequery('click', function(event) {
    event.preventDefault();
    var current_element = $(this);

    $.ajax({
      url: $(this).attr("href"),
      // dataType: 'html',
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
      info_wrapper.find('ul, dl, p').show();
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
      var list = info_wrapper.find('ul, dl, p').hide();
      info_wrapper.prepend(data);
      info_wrapper.show("blind");
      if($('form.edit_unit_photo').length) {
        var form = $('form.edit_unit_photo');
        form.ajaxForm({
          dataType: 'json',
          success: function(data) {
            var info_wrapper = form.parent();
            info_wrapper.hide("blind", function() {
              form.remove();
              info_wrapper.find('ul, dl').replaceWith(data.html_data);  
              show_edit_button($('a.cancel'));
              info_wrapper.show("blind");
            });
          }
        });
      }

    });
  }

  function show_cancel_button(edit_button) {
    edit_button.text('cancel').attr("class", "cancel");
  }