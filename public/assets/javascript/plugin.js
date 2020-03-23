(function ($) {
    $.fn.table = function(options) {
        const defaultOptions = {
            columns: {
                id: {
                    name: 'ID',
                    type: 'number'
                },
                employee_name: {
                    name: 'Employee Name',
                    type: 'text'
                },
                employee_age: {
                    name: 'Age',
                    type: 'number',
                },
                employee_salary: {
                    name: 'Salary',
                    type: 'number'
                }
            }
        }

        // Event listeners

        // Checkbox
        $('.table-container').on('click', 'input#check-all[type=checkbox]', function () {
            if ($(this).prop('checked')) {
                $('input.check__box[type=checkbox]').prop('checked', true);
                $('input.check__box[type=checkbox]').closest('tr').addClass('chosen');
            } else {
                $('input.check__box[type=checkbox]').prop('checked', false);
                $('input.check__box[type=checkbox]').closest('tr').removeClass('chosen');
            }
        })

        $('.table-container').on('click', 'input.check__box[type=checkbox]', function (event) {
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

            if ($('input.check__box[type=checkbox]:checked').length == $('input.check__box[type=checkbox]').length) {
                $('input#check-all[type=checkbox]').prop('checked', true);
            } else {
                $('input#check-all[type=checkbox]').prop('checked', false);
            }
        })
        
        $('.table-container').on('click', 'tbody tr', function (event) {
            console.count('tr');
            $(this).find('input.check__box[type=checkbox]').trigger('click');
        })



        // End of Event listeners

        $(this).append(
            `<table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" id="check-all">
                        </th>
                        ${
                            Object.keys(defaultOptions.columns).map((item) => {
                                return `<th>${defaultOptions.columns[item].name}</th>`;
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
                        ${Object.keys(defaultOptions.columns).map((attr, index) => {
                            return `<td data-input=${attr}>${record[attr]}</td>`;
                        }).join('')}
                    </tr>`
                })    
            );
            return this;
        }
        return addData;
    }
}(jQuery));