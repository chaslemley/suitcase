jQuery(function() {
  bindlisteners();
});

function bindlisteners() {
  jQuery('a.suitcase').each(function(a) {
    this.href += '?TB_iframe=true&height=400&amp;width=700';
  });
}