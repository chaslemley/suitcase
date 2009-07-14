$(function() {
  $('table#units_table').dataTable({
    "bLengthChange": false
  });
  
  $('div#units_table_previous').append("Previous");
  $('div#units_table_next').append("Next");
});

$('a.next_month, a.previous_month').livequery('click', function(event) {
  event.preventDefault();
  $.ajax({
    url: $(this).attr("href"),
    type: 'GET',
    
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
  
    success: function(data) {
      $('div#rate_calendar').html(data);
    }
  });
  
});

$('ul.rate_variations a.edit_rate_variation').livequery('click', function(event) {
  event.preventDefault();
  
  var li = $(this).parents('li');
  var edit_li = $("<li class='edit_variation'></li>");
  li.after(edit_li);
  li.hide();
  
  $.ajax({
    url: $(this).attr("href"),
    type: 'GET',
    
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
  
    success: function(data) {
        edit_li.html(data);
    }
  });
});

$('a.cancel_edit_variation').livequery('click', function(event) {
  event.preventDefault();
  
  var li = $(this).parents('li');
  var previous_li = li.prev('li');
  
  $('a.new_rate_variation').show();
  
  li.remove();
  previous_li.show();
  
});

$('form.edit_rate_variation').livequery('submit', function(event) {
  event.preventDefault();
  
  var li = $(this).parents('li');
  var previous_li = li.prev('li');
  
  $.ajax({
    url: $(this).attr("action"),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
    
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
  
    success: function(data) {
      li.remove();
      previous_li.html(data.html_data);
      previous_li.show("highlight", 2000);
    }
  });
});

$('a.new_rate_variation').livequery('click', function(event) {
  event.preventDefault();
  
  var ul = $('ul.rate_variations');
  
  if(ul.length <= 0) {
    ul = $('<ul class="rate_variations"></ul>');
    $(this).parent().append(ul);
  }
  var link = $(this);
  
  $.ajax({
    url: $(this).attr("href"),
    type: 'GET',
  
    beforeSend: function(xhr) {
      link.hide();
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    
    success: function(data) {
      ul.append('<li class="edit_variation">' + data + '</li>');
    }
  
  });
  
});

$('form.new_rate_variation').livequery('submit', function(event) {
  event.preventDefault();
  
  var form = $(this);
  var ul = $('ul.rate_variations');
  
  $.ajax({
    url: $(this).attr('action'),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
  
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
    
    success: function(data) {
      if(data.message == 'success') {
        
        $('div#rate_variations p.empty_list').remove();
        $('a.new_rate_variation').show();
        ul.append('<li>' + data.html_data + '</li>').find('li:last-child').show('highlight', 2000);
        form.parent('li').remove();
      }
   }
  });
});

$('form.delete_variation').livequery('submit', function(event) {
  event.preventDefault();
  
  var li = $(this).closest('li');
  
  $.ajax({
    url: $(this).attr("action"),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
    
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Accept", "text/javascript");
    },
  
    success: function(data) {
      if(data.message == 'success') 
        li.remove();
    }
    });
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
