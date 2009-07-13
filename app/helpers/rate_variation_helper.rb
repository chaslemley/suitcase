module RateVariationHelper
  def days_of_week_select_options
    [
      ['Please Select',           ''],
      ['day',                     '1111111'],
      ['Sunday',                  '1000000'],
      ['Monday',                  '0100000'],
      ['Tuesday',                 '0010000'],
      ['Wednesday',               '0001000'],
      ['Thursday',                '0000100'],
      ['Friday',                  '0000010'],
      ['Saturday',                '0000001'],
      ['Friday and Saturday',     '0000011'],
      ['Sunday through Thursday', '1111100']
    ]
  end
  
  def variation_type_select_options
    [
      ['Please Select', ''],
      ['increases', 'increase'],
      ['decreases', 'decrease']
    ]
  end
end