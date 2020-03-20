(function ($) {
    $.fn.table = function(options) {
        // Event listeners
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
            if (this.checked) {
                $(this).closest('tr').addClass('chosen');
            } else {
                $(this).closest('tr').removeClass('chosen');
            }
            
            if ($('input.check__box[type=checkbox]:checked').length == $('input.check__box[type=checkbox]').length) {
                $('input#check-all[type=checkbox]').prop('checked', true);
            } else {
                $('input#check-all[type=checkbox]').prop('checked', false);
            }
            event.stopPropagation();
        })
        
        $('.table-container').on('click', 'tbody tr', function (event) {
            $(this).find('input.check__box[type=checkbox]').trigger('click');
        })

        
        // End of Event listeners
        


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

        $(this).append(
            `<table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" id="check-all">
                        </th>
                        ${Object.keys(defaultOptions.columns).map((item) => {
                            return `<th>${defaultOptions.columns[`${item}`].name}</th>`;
                        })}
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
                        ${Object.keys(defaultOptions.columns).map(attr => {
                            return `<td>${record[attr]}</td>`;
                        })}
                    </tr>`
                })    
            );

            

            return this;
        }

        return addData;
    }

    
}(jQuery));