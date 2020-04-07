(function ($) {
    $.fn.table = function(data, userOptions) {
        const defaultOptions = {
            pagination: {
                limit: 10,
                step: 2,
            },
            columns: {},
            resizable: true
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

            if ($('input.check__box[type=checkbox]:checked').length == $('input.check__box[type=checkbox]').length) {
                $('input#check-all[type=checkbox]').prop('checked', true);
            } else {
                $('input#check-all[type=checkbox]').prop('checked', false);
            }
        })
        
        $(this).on('click', 'tbody tr td:not(:first-child)', function (event) {
            const row = $(this).closest('tr');
            if (row.hasClass('updating')) {
                row.removeClass('updating');

                // Clear form
                $('form input').each(function (index) {
                    $(this).val($(this).prop('defaultValue'))
                })
            } else {
                $('table tbody tr').removeClass('updating');
                row.addClass('updating');

                // Bind data
                row.find('td:not(:first-child)').each(function (index) {
                    const input = $(this).data('input');
                    $(`form input[data-input=${input}]`).val($(this).html().replace(/,/g, ''));
                })
            }
        })


        // Sort table
        $(this).on('click', 'thead th span svg.caret', function (event) {
            event.stopPropagation();

            const sign = $(this).hasClass('caret--up') ? 1 : -1;
            const data = $(this).closest('th').data('input');
            const type = $(this).closest('th').data('type');

            // Remove all class .active
            $(this).closest('thead').find('th svg').removeClass('active');
            $(this).addClass('active');

            const records = $(this).closest('thead').siblings('tbody').find('tr');

            records.sort(function (a, b) {
                const A = $(a).find(`td[data-input="${data}"]`).html();
                const B = $(b).find(`td[data-input="${data}"]`).html();

                if (type === 'text') {
                    return sign*A.localeCompare(B);
                } else if (type === 'number' || type === 'money') {
                    return sign*(parseInt(A.replace(/,/g, '')) - parseInt(B.replace(/,/g, '')));
                }
                return 0;
            })
            $(this).closest('thead').siblings('tbody').append(records);
            $.renderPagination(allOptions.pagination.limit, allOptions.pagination.step, parseInt($('a.current-page p').html()))
        })

        $(this).on('click', 'thead th.sortable', function(event) {
            if ($(this).find('span svg.caret.active').length === 0) {
                $(this).find('span svg.caret--up').trigger('click');
            } else {
                $(this).find(`span svg.caret--${$(this).find('span svg.caret.active').hasClass('caret--up') ? 'down' : 'up'}`).trigger('click');
            }
        })

        // End of Event listeners

        $(this).append(
            `
            <table>
                <thead>
                    <tr>
                        <th class="checkbox__container">
                            <input type="checkbox" id="check-all">
                            <span class="checkmark"></span>
                        </th>
                        ${
                            Object.keys(allOptions.columns).map((item) => {
                                return `<th ${allOptions.columns[item].sortable ? 'class="sortable"' : ''}
                                            style="max-width: ${allOptions.columns[item].max_width}; min-width: ${allOptions.columns[item].min_width}"
                                            data-input=${item}
                                            data-dir="none"
                                            data-type=${allOptions.columns[item].type}>
                                                <span>${allOptions.columns[item].name}</span>
                                                ${allOptions.columns[item].sortable ? 
                                                    `<span class="caret__container">
                                                        <svg viewBox="0 0 1024 1024" class="caret caret--up">
                                                            <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
                                                        </svg>
                                                        <svg viewBox="0 0 1024 1024" class="caret caret--down">
                                                            <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                                                        </svg>
                                                    </span>`
                                                    : ''}
                                            </th>`;
                            }).join('')
                        }
                    </tr>
                </thead>
                <tbody>
                        
                </tbody>
            </table>
            <div class="table-pagination"></div>
            `
        );


        // Resizable columns
        if (allOptions.resizable === true) {
            let isColResizing = false;
            let resizingPosX = 0;

            $(this).find('table thead th').each(function (index) {
                $(this).css('position', 'relative');
                if ($(this).is(':not(:last-child)')) {
                    $(this).append("<div class='resizer' style='position:absolute;top:0px;right:-3px;bottom:0px;width:6px;z-index:999;background:transparent;cursor:col-resize'></div>");
                }
            })

            $(document).mouseup(function (event) {
                if (isColResizing) {
                    $(this).find('table thead th').removeClass('resizing');
                    isColResizing = false;

                    event.stopPropagation();
                }
            })

            $(this).on('mousedown', 'table thead th div.resizer', function (event) {
                $('table thead th').removeClass('resizing');
                $(this).closest('th').addClass('resizing');
                resizingPosX = event.pageX;
                isColResizing = true;

                event.stopPropagation();
            })

            $(this).on('mousemove', 'table', function (event) {
                if (isColResizing) {
                    const resizer = $(this).find('thead th.resizing .resizer');

                    if (resizer.length == 1) {
                        const nextColumn = $(this).find('thead th.resizing + th');
                        const mouseX = event.pageX || 0;
                        const widthDiff = mouseX - resizingPosX;

                        const currColWidth = resizer.closest('th').innerWidth() + widthDiff;
                        const currColMinWidth = parseInt(resizer.closest('th').css('min-width'), 10);
                        const currColMaxWidth = parseInt(resizer.closest('th').css('max-width'), 10);

                        const nextColWidth = nextColumn.innerWidth() - widthDiff;
                        const nextColMinWidth = parseInt(nextColumn.css('min-width'), 10);
                        const nextColMaxWidth = parseInt(nextColumn.css('max-width'), 10);

                        console.log({currColMaxWidth, currColWidth, nextColMaxWidth, nextColWidth})

                        if (resizingPosX != 0 && widthDiff != 0 && 
                            currColWidth > currColMinWidth && nextColWidth > nextColMinWidth && 
                            currColWidth < currColMaxWidth && nextColWidth < nextColMaxWidth) 
                        {
                            resizer.closest('th').innerWidth(currColWidth);
                            resizingPosX = event.pageX;
                            nextColumn.innerWidth(nextColWidth);
                        }
                    }
                }
            })
        }

        // End of resizable columns


        // Callback to load data
        // const addData = function (data) {
        $('table tbody').append(
            data.map(record => {
                return `<tr>
                    <td class="checkbox__container"><input type="checkbox" class="check__box"><span class="checkmark"></span></td>
                    ${Object.keys(allOptions.columns).map((attr, index) => {
                        return `<td style="max-width: ${allOptions.columns[attr].max_width}; min-width: ${allOptions.columns[attr].min_width}"
                                    data-input=${attr}>${allOptions.columns[attr].type === 'money' ? parseInt(record[attr]).toLocaleString('en') : record[attr] }</td>`;
                    }).join('')}
                </tr>`
            })    
        );

        // Pagination starts here
        const pageLimit = allOptions.pagination.limit;
        const pageStep = allOptions.pagination.step;

        $('.table-pagination').append(
            `<a id="button-prev">&#8249;</a>
            <span class="pagination__box"></span>
            <a id="button-next">&#8250;</a>`
        )

        $.renderPagination(pageLimit, pageStep);

        // Event handlers for navigating
        $('.table-pagination').on('click', '#button-prev', function () {
            let current = $('a.current-page p').html();

            if (parseInt(current) - 1 >= 1) {
                $('a.current-page').removeClass('current-page');
                // Call render function
                $.renderPagination(pageLimit, pageStep, parseInt(current) - 1);
            } else {
                $('a.current-page').removeClass('current-page');
                // Call render function
                $.renderPagination(pageLimit, pageStep, Math.ceil($('tbody tr').length / pageLimit ));
            }

        })

        $('.table-pagination').on('click', '#button-next', function () {
            let current = $('a.current-page p').html();

            if (parseInt(current) + 1 <= Math.ceil($('tbody tr').length / pageLimit )) {
                $('a.current-page').eq(0).removeClass('current-page');
                // Call render function
                $.renderPagination(pageLimit, pageStep, parseInt(current) + 1);
            } else {
                $('a.current-page').eq(0).removeClass('current-page');
                // Call render function
                $.renderPagination(pageLimit, pageStep, 1);
            }
        })

        $('.table-pagination').on('click', '.page-index', function () {
            let index = $(this).find('p').html();
            // Call render function
            $.renderPagination(pageLimit, pageStep, parseInt(index));
        })
        // Pagination ends here

        //     return this;
        // }
        return this;
    }

    $.renderPagination = function (limit, step, index = 1) {
        const size = Math.ceil($('tbody tr').length / limit);

        // 4 situations
        // 1 - No ... at both sides
        // 2 - ... only at start
        // 3 - ... only at end
        // 4 - ... on both sides
        let code = '';
        // No ... both sides
        if (size < step * 2 + 4) {
            code += $.renderNumber(1, size);
        }
        // ... at start 
        else if (index > size - step * 2) {
            code += $.renderDots(true);
            code += $.renderNumber(index - step, size);
        }
        // ... at end
        else if (index < step * 2 + 1) {
            code += $.renderNumber(1, index + step);
            code += $.renderDots(false, size);
        } else {
            code += $.renderDots(true);
            code += $.renderNumber(index - step, index + step);
            code += $.renderDots(false, size);
        }

        $('.table-pagination span.pagination__box').empty().append(code);
        $('.table-pagination span.pagination__box a').each(function (i) {
            if ($(this).find('p').html() === index.toString()) {
                $(this).addClass('current-page')
            }
        })

        // Re-render records
        $('tbody tr').slice((index - 1) * limit, (index * limit)).show();
        $('tbody tr').not($('tbody tr').slice((index - 1) * limit, (index * limit))).hide();
    }

    $.renderDots = function (isStart, number = 1) {
        return isStart ? 
                `<a class="page-index"><p>${number}</p></a><i>...</i>` : 
                `<i>...</i><a class="page-index"><p>${number}</p></a>`;
    }

    $.renderNumber = function (start, end) {
        let tempStr = '';
        for (let i = start; i <= end; i++) {
            tempStr += `<a class="page-index"><p>${i}</p></a>`;
        }
        return tempStr;
    }


}(jQuery));