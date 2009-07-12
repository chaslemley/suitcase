function table_init() {
  $('body>div.tooltip').remove();
  $('table#reservations_table').dataTable({
    "bLengthChange": false,
    "aaSorting": [[ 0, "desc" ]],
    "aoColumns": [ 
      /* id */          { "bSearchable": true,
      			              "bVisible":    false },
      /* name */        { "sType": "html" },
      /* email */       null,
      /* state */       null,
      /* reservation */ null
    ]
  });
  $('div#reservations_table_previous').append("Previous");
  $('div#reservations_table_next').append("Next");
}

