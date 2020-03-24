(function ($) {
    $.fn.table = function(userOptions) {
        const defaultOptions = {
            pagination: {
                limit: 10
            },
            columns: {}
        }

        const allOptions = $.extend(defaultOptions, userOptions)

        // Event listeners

        // Checkbox
        $(this).on('click', 'input#check-all[type=checkbox]', function () {
            if ($(this).prop('checked')) {
                $('input.check__box[type=checkbox]').prop('checked', true);
                $('input.check__box[type=checkbox]').closest('tr').addClass('chosen');
            } else {
                $('input.check__box[type=checkbox]').prop('checked', false);
                $('input.check__box[type=checkbox]').closest('tr').removeClass('chosen');
            }
        })

        $(this).on('click', 'input.check__box[type=checkbox]', function (event) {
            event.stopPropagation();
            const record = $(this).closest('tr');

            if (this.checked) {
                record.addClass('chosen');
            } else {
                record.removeClass('chosen');
            }
            
            // THIS MAY NOT BE PART OF THE PLUGIN
            // If there is only 1 checked box, push to detail form to edit
            if ($('input.check__box[type=checkbox]:checked').length == 1) {
                $.each($('input.check__box[type=checkbox]:checked').closest('td').nextAll(), function (index) {
                    const input = $(this).data('input');
                    $(`form input[data-input=${input}]`).val($(this).html());
                })
            } else {
                // Empty form
                $('form input').each(function (index) {
                    $(this).val($(this).prop('defaultValue'))
                })

            }
            // END OF PART MAY NOT BE IN THE PLUGIN

            if ($('input.check__box[type=checkbox]:checked').length == $('input.check__box[type=checkbox]').length) {
                $('input#check-all[type=checkbox]').prop('checked', true);
            } else {
                $('input#check-all[type=checkbox]').prop('checked', false);
            }
        })
        
        $(this).on('click', 'tbody tr', function (event) {
            console.count('tr');
            $(this).find('input.check__box[type=checkbox]').trigger('click');
        })

        $(this).on('click', 'thead th.sortable', function(index) {
            $(this).siblings('th.sortable').not(this).data('dir', 'none');
            const data = $(this).data('input');
            const type = $(this).data('type');

            let records = $(this).closest('thead').siblings('tbody').find('tr');

            if ($(this).data('dir') === 'none') {
                $(this).data('dir', 1);

                records.sort(function (a, b) {
                    const A = $(a).find(`td[data-input="${data}"]`).html();
                    const B = $(b).find(`td[data-input="${data}"]`).html();

                    if (type === 'text') {
                        return A.localeCompare(B);
                    } else if (type === 'number' || type === 'money') {
                        return parseInt(A.replace(/,/g, '')) - parseInt(B.replace(/,/g, ''));
                    }
                    return 0;
                })
                $(this).closest('thead').siblings('tbody').append(records);

            } else {
                $(this).data('dir', +!$(this).data('dir'));
                $(this).closest('thead').siblings('tbody').append(records.get().reverse())
            }
        })

        // End of Event listeners

        $(this).append(
            `
            <div class="pagination"></div>
            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" id="check-all">
                        </th>
                        ${
                            Object.keys(allOptions.columns).map((item) => {
                                return `<th ${allOptions.columns[item].sortable ? 'class="sortable"' : ''}
                                            data-input=${item}
                                            data-dir="none"
                                            data-type=${allOptions.columns[item].type}>
                                            ${allOptions.columns[item].name}
                                        </th>`;
                            }).join('')
                        }
                    </tr>
                </thead>
                <tbody>
                        
                </tbody>
            </table>`
        );


        // Callback to load data
        const addData = function (data) {
            $('table tbody').append(
                data.map(record => {
                    return `<tr>
                        <td><input type="checkbox" class="check__box"></td>
                        ${Object.keys(allOptions.columns).map((attr, index) => {
                            return `<td data-input=${attr}>${allOptions.columns[attr].type === 'money' ? parseInt(record[attr]).toLocaleString('en') : record[attr] }</td>`;
                        }).join('')}
                    </tr>`
                })    
            );

            // Pagination starts here
            const offset = allOptions.pagination.limit;
            const size = data.length;

            console.log({offset}, {size})
            
            // Pagination ends here

            return this;
        }
        return addData;
    }
}(jQuery));