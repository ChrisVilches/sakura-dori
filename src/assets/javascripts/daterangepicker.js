/* globals $: false */
/* globals moment: false */
// TODO: In /archive, the dateFrom becomes invalid.
//       Some other things might not work as well.
/** Initialize date range pickers. */
$(document).ready(() => {
  const DATE_FORMAT = 'YYYY-MM-DD'
  const EARLIEST_DATE = moment().subtract(10, 'days').format(DATE_FORMAT)
  const $forms = $('form[enable-daterangepicker]')

  const onRangeChange = ($form, start, end) => {
    $form.find('[name="dateFrom"]').val(start.format(DATE_FORMAT))
    $form.find('[name="dateTo"]').val(end.format(DATE_FORMAT))
  }

  const initializeRangePicker = $form => {
    const $input = $($form.find('[role="daterangepicker"]')[0])
    const dateFrom = $form.find('[name=dateFrom]').val() || ''
    const dateTo = $form.find('[name=dateTo]').val() || moment().add(5, 'd').format(DATE_FORMAT)
    const limitDateFrom = $input.attr('data-limit-date-from')

    const options = {
      startDate: dateFrom,
      endDate: dateTo,
      locale: {
        format: DATE_FORMAT
      },
      opens: 'left'
    }

    if (limitDateFrom) {
      options.minDate = limitDateFrom
    }

    // Set startDate if it's missing.
    if (!options.startDate) {
      if (options.minDate) {
        options.startDate = options.minDate
      } else {
        options.startDate = EARLIEST_DATE
      }
    }

    // Make it comply with the expected format.
    options.startDate = options.startDate.replace(/-/g, '/')
    options.endDate = options.endDate.replace(/-/g, '/')

    // Trigger an initial change to the hidden inputs.
    // TODO: But sadly we have to convert them back to YYYY/MM/DD so that moment() doesn't complain.
    onRangeChange($form, moment(options.startDate.replace(/\//g, '-')), moment(options.endDate.replace(/\//g, '-')))

    $input.daterangepicker(options, (start, end) => onRangeChange($form, start, end))
  }

  $forms.each((_, ele) => {
    const $form = $(ele)
    const rangePicker = $form.find('[role="daterangepicker"]')
    if (rangePicker.length !== 1) throw new Error('There must be exactly one daterangepicker inside this form.')
    initializeRangePicker($form)
  })
})
