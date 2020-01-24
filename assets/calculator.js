$(function () {
    "use strict";

    $('[data-toggle="tooltip"]').tooltip();

    let fnReset = function () {
        $('select#addStat option').show();
        $('tr[data-stat-id]').hide();
        $('input.negative-stat').prop('checked', false).change();
        fnSetSink(0);
    };

    let fnToggleAll = function () {
        let $elts = $('tr[data-stat-id]'),
            toggle = $elts.filter(':visible').length !== $elts.length;
        $elts.toggle(toggle);
        $('select#addStat option').toggle(!toggle);
    };

    let fnSetSink = function (value) {
        value = parseFloat(value).toFixed(2);

        $('input#sink').val(value)
            .toggleClass('border-light', value === 0)
            .toggleClass('border-danger', value < 0)
            .toggleClass('border-success', value > 0);

        $('button[data-power]').each(function () {
            $(this)
                .toggleClass('border-danger', value !== 0 && $(this).data('power') > value)
                .toggleClass('border-success', value !== 0 && $(this).data('power') <= value);
        });
    };

    let fnAddSink = function (value) {
        fnSetSink(parseFloat($('input#sink').val()) + value);
    };

    $(document)
        .on('click', 'button[data-hide-stat]', function () {
            let id = $(this).closest('tr[data-stat-id]').hide().data('statId');
            $('select#addStat').find('option[value=' + id + ']').show();
        })
        .on('change', 'select#addStat', function () {
            $('tr[data-stat-id=' + $(this).val() + ']').show();
            $(this).find(':selected').hide();
            $(this).val(null);
        })
        .on('click', 'button[data-add-bonus]', function (e) {
            fnAddSink((e.shiftKey ? 1 : -1) * ($(this).data('addBonus') * $(this).closest('tr[data-stat-id]').data('currentSink')));
        })
        .on('change', 'input#sink', function () {
            fnSetSink(parseFloat($(this).val()));
        })
        .on('change', 'input.negative-stat', function () {
            let $stat = $(this).closest('[data-stat-id]'),
                isChecked = $(this).is(':checked');
            $stat.data('currentSink', isChecked ? $stat.data('negativeSink') : $stat.data('positiveSink')).toggleClass('table-danger', isChecked);
        })
        .on('keydown change', 'input.fast-sink-input', function (e) {
            if (e.type === 'change' || (e.type === 'keydown' && e.keyCode === 13)) {
                fnAddSink(parseFloat($(this).closest('[data-stat-id]').data('currentSink') * -$(this).val()));
                $(this).val(0);

                let elts = $('input.fast-sink-input:visible').get(),
                    idx = elts.findIndex(x => x === this);

                if (e.shiftKey) {
                    $(elts[idx === 0 ? elts.length - 1 : idx - 1]).focus();
                } else {
                    $(elts[idx === elts.length - 1 ? 0 : idx + 1]).focus();
                }
            }
        })
        .on('click', 'button#toggleAll', fnToggleAll)
        .on('click', 'button#reset', fnReset);

    fnReset();
});
