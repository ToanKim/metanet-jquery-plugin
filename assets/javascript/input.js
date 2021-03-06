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

    if (requestArray.length === 0) {
        alert('Nothing to save');
    } else {
        $.when(...requestArray).done(function (){

            // Clear fields
            $('form input').each(function (index) {
                $(this).val($(this).prop('defaultValue'));
            });
    
            // Clear table
            $('.table-container').empty();
            $('.table-container').unbind();
    
            alert('Saved successfully');
    
            // Kinda redundant, don't know how to resolve yet
            initData(function (data) {
                $('.table-container').table(data, config)
            })
        })
    }


});

// $("button#update").on('click', () => {
//     if (isValid() === false) {
//         return;
//     }
//     const updatingRow = $('table tbody tr.updating');
//     updatingRow.find('td:not(:first-child)').each(function (index) {
//         const input = $(this).data('input');
//         const formInput = $(`form input[data-input=${input}]`);
//         const type = formInput.data('type');
//         $(this).html(type == 'money' ? parseInt(formInput.val()).toLocaleString('en') : $.trim(formInput.val()).replace(/\s+/g, " "));
//     })

//     // Clear fields
//     clearForm();

//     // Remove updating status
//     updatingRow.removeClass('updating')
//     if (!updatingRow.hasClass('add')) {
//         updatingRow.addClass('update')
//     }
// })

$("#form-detail input:not(#id)").on('input', function () {
    const updatingRow = $('table tbody tr.updating');

    if (updatingRow.length === 1) {
        if (isValid() === false) {
            return;
        }

        updatingRow.find('td:not(:first-child)').each(function (index) {
            const input = $(this).data('input');
            const formInput = $(`form input[data-input=${input}]`);
            const type = formInput.data('type');
            $(this).html(type == 'money' ? parseInt(formInput.val()).toLocaleString('en') : $.trim(formInput.val()).replace(/\s+/g, " "));
        })

        if (!updatingRow.hasClass('add')) {
            updatingRow.addClass('update');
        }
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
        `<tr class="add${$('input#check-all[type=checkbox]').prop('checked') ? ' chosen' : ''}">
            <td class="checkbox__container"><input type="checkbox" class="check__box" ${$('input#check-all[type=checkbox]').prop('checked') ? 'checked' : ''}><span class="checkmark"></span></td>
            <td data-input="id"></td>
            ${detail.map((item, index) => {
                return `<td data-input=${item.name}>${item.name === 'employee_salary' ? parseInt(item.value).toLocaleString('en') : $.trim(item.value).replace(/\s+/g, " ")}</td>`
            }).join('')}
        </tr>`
    );
});

$("button#delete").on("click", () => {
    // Get only rows that have been chosen and not yet deleted
    const checkedRow = $('table tbody tr.chosen:not(".delete")');
    
    // If is updating, trigger click again to remove the class
    if (checkedRow.hasClass('updating')) {
        checkedRow.find('td:not(:first-child)').first().trigger('click');
    }
    // Add .delete class
    checkedRow.each(function (index) {
        $(this).addClass('delete').removeClass('chosen');
        $(this).find('td input[type=checkbox]').prop('checked', false).removeClass('check__box');
    })
});

function isValid() {
    $('#form-detail input').removeClass('border--invalid').siblings('p.error__text').empty();
    let isValid = true;
    $('#form-detail input').each(function (index) {
        if ($(this).prop('required') && $(this).val() == '') {
            $(this).siblings('p.error__text').html('Empty Field or Invalid Value');
            $(this).addClass('border--invalid');
            isValid = false;
            return;
        }

        if ($(this).data('input') === 'employee_name' && /^[a-zA-Z]+(\s[a-zA-Z]+)*$/g.test($.trim(removeAscent($(this).val())).replace(/\s+/g, " ")) == false) {
            $(this).siblings('p.error__text').html('Invalid Name');
            $(this).addClass('border--invalid');
            isValid = false;

        } else if ($(this).data('input') === 'employee_age' && ($(this).val() < 21 || $(this).val() > 64)) {
            $(this).siblings('p.error__text').html('Invalid Age (from 21 - 64)');
            $(this).addClass('border--invalid');
            isValid = false;

        } else if ($(this).data('input') === 'employee_salary' && $(this).val() < 0) {
            $(this).siblings('p.error__text').html('Invalid Salary (greater than 0)');
            $(this).addClass('border--invalid');
            isValid = false;
        }
    })

    return isValid;
}

function clearForm() {
    $('#form-detail input').each(function (index) {
        $(this).val($(this).prop('defaultValue'));
    })
}

function removeAscent (str) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }