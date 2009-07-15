$('.datepicker').livequery(function() {
  $(this).parent('form').find('input[type=submit]').hide();
  make_datepicker($(this));
});

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
    beforeShow: customRange
  });
}
