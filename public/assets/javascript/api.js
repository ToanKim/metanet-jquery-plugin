const initData = (url, callback) => {
    $.ajax({
        url: url,
        method: 'GET',
        accepts: 'application/json',

        success: (message) => {
            // console.table(message);
            callback(message);
        },
        error: (message) => {
            console.error(message);
        }
    });
}

const createData = (url, data) => {
    return $.ajax({
        url: url,
        method: 'POST',
        data: data,
        accepts: 'application/json',

        // success: (message) => {
        //     console.table(message);
        // },
        // error: (message) => {
        //     console.error(message);
        // }
    })
}

const updateData = (url, data) => {
    return $.ajax({
        url: `${url}/${data.id}`,
        method: 'PUT',
        data: data,
        accepts: 'application/json',

        // success: (message) => {
        //     console.table(message)
        // },
        // error: (message) => {
        //     console.error(message);
        // }
    })
}

const deleteData = (url, id) => {
    return $.ajax({
        url: `${url}/${id}`,
        method: 'DELETE',
        data: {},
        accepts: 'application/json',

        // success: (message) => {
        //     console.table(message)
        // },
        // error: (message) => {
        //     console.error(message);
        // }
    })
}