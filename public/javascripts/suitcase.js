jQuery(function() {
  bindlisteners();
});

function bindlisteners() {
  jQuery('a.suitcase').each(function(a) {
    this.href += '?TB_iframe=true&height=378&amp;width=505';
  });
}