$("button#save").on("click", () => {
    // initData(apiUrl);

    // Get delete record but not just added
    const deletes = $('tr.delete:not(".add")');

    // Get added records that are not deleted
    const adds = $('tr.add:not(".delete")');

    // Get updated records that not has .add class or .delete class
    const updates = $('tr.update:not(".delete")')

    let requestArray = [];

    adds.each(function (index) {
        const data = {
            'employee_name': $(this).find('td[data-input="employee_name"]').html(),
            'employee_age': $(this).find('td[data-input="employee_age"]').html(),
            'employee_salary': $(this).find('td[data-input="employee_salary"]').html().replace(/,/g, ''),
        }

        requestArray.push(createData(data));
    })

    deletes.each(function (index) {
        requestArray.push(deleteData($(this).find('td[data-input="id"]').html()));
    })

    updates.each(function (index) {
        const data = {
            'id': $(this).find('td[data-input="id"]').html(),
            'employee_name': $(this).find('td[data-input="employee_name"]').html(),
            'employee_age': $(this).find('td[data-input="employee_age"]').html(),
            'employee_salary': $(this).find('td[data-input="employee_salary"]').html().replace(/,/g, ''),
        }

        requestArray.push(updateData(data));
    })

    $('.loading-container').show();
    $.when(...requestArray).done(function (){

        // Clear fields
        $('form input').each(function (index) {
            $(this).val($(this).prop('defaultValue'));
        });

        // Clear table
        $('.table-container').empty();
        $('.table-container').unbind();

        // Kinda redundant, don't know how to resolve yet
        initData(function (data) {
            $('.table-container').table(data,
                {
                    columns: {
                        id: {
                            name: 'ID',
                            type: 'number',
                            sortable: true,
                        },
                        employee_name: {
                            name: 'Employee Name',
                            type: 'text',
                            sortable: true,
                        },
                        employee_age: {
                            name: 'Age',
                            type: 'number',
                            sortable: true,
                        },
                        employee_salary: {
                            name: 'Salary',
                            type: 'money',
                            sortable: true,
                        }
                    }
                }
        )
        })
    })


});

$("button#update").on('click', () => {
    if (isValid() === false) {
        return;
    }

    const checkedRow = $('input.check__box[type=checkbox]:checked');
    $.each(checkedRow.closest('td').nextAll(), function (index) {
        const input = $(this).data('input');
        const formInput = $(`form input[data-input=${input}]`);
        const type = formInput.data('type');

        $(this).html(type == 'money' ? parseInt(formInput.val()).toLocaleString('en') : formInput.val());
    })
    checkedRow.prop('checked', false);

    // Clear form
    clearForm();

    // .add and .update class
    const row = checkedRow.closest('tr');
    row.removeClass('chosen');
    if (!row.hasClass('add')) {
        row.addClass('update');
    }
})

$("button#add").on("click", () => {
    if (isValid() === false) {
        return;
    }

    const form = $('#form-detail');
    const detail = form.find('input').serializeArray();

    // Add new row to the table
    $("table tbody").prepend(
        `<tr class="add">
            <td><input type="checkbox" class="check__box"></td>
            <td data-input="id"></td>
            ${detail.map((item, index) => {
                return `<td data-input=${item.name}>${item.name === 'employee_salary' ? parseInt(item.value).toLocaleString('en') : item.value}</td>`
            }).join('')}
        </tr>`
    );
    
    // Clear form
    clearForm();


});

$("button#delete").on("click", () => {
    // Get only rows that have been chosen and not yet deleted
    const checkedRow = $('table tbody tr.chosen:not(".delete")');

    // Add .delete class
    checkedRow.each(function (index) {
        $(this).addClass('delete');
        $(this).find('td input[type=checkbox]').prop('checked', false).removeClass('check__box');
    })

    // Clear form
    clearForm();
});

function isValid() {
    $('#form-detail input').removeClass('border--invalid');
    let errors = [];
    $('#form-detail input').each(function (index) {
        if ($(this).prop('required') && $(this).val().toString() === '') {
            errors.push({
                name: `${$(this).siblings('label').html()} input`,
                type: `Empty Field`,
            })
            $(this).addClass('border--invalid');
            return;
        }

        if ($(this).data('input') === 'employee_name' && /^[a-zA-Z]+(\s[a-zA-Z]+)*$/g.test($(this).val().toString()) == false) {
            errors.push({
                name: `${$(this).siblings('label').html()} input`,
                type: `Invalid Name`
            })
            $(this).addClass('border--invalid');

        } else if ($(this).data('input') === 'employee_age' && ($(this).val() < 21 || $(this).val() > 64)) {
            errors.push({
                name: `${$(this).siblings('label').html()} input`,
                type: `Invalid Age (from 21 - 64)`
            })
            $(this).addClass('border--invalid');

        } else if ($(this).data('input') === 'employee_salary' && $(this).val() < 0) {
            errors.push({
                name: `${$(this).siblings('label').html()} input`,
                type: `Invalid Salary (greater than 0)`
            })
            $(this).addClass('border--invalid');

        }
    })

    const error_box = $('#form-detail .error__box').empty();
    errors.map(error => {
        error_box.append(`<p>${error.name}: ${error.type}</p>`);
    })

    return errors.length == 0 ? true : false;
}

function clearForm() {
    $('#form-detail input').each(function (index) {
        $(this).val($(this).prop('defaultValue'));
    })
}