const initData = (url, callback) => {
    $.ajax({
        url: url,
        method: 'GET',
        accepts: 'application/json',

        success: (message) => {
            console.table(message);
            callback(message);
        },
        error: (message) => {
            console.error(message);
        }
    });
}

const createData = (url, data, callback) => {
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        accepts: 'application/json',

        success: (message) => {
            console.table(message);
        },
        error: (message) => {
            console.error(message);
        }
    })
}

const updateData = (url, data, callback) => {
    let id = 3;
    $.ajax({
        url: `${url}/${id}`,
        method: 'PUT',
        data: {},
        accepts: 'application/json',

        success: (message) => {
            console.table(message)
        },
        error: (message) => {
            console.error(message);
        }
    })
}

const deleteData = (url, id, callback) => {
    $.ajax({
        url: `${url}/${id}`,
        method: 'DELETE',
        data: {},
        accepts: 'application/json',

        success: (message) => {
            console.table(message)
        },
        error: (message) => {
            console.error(message);
        }
    })
}