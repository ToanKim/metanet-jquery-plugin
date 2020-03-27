const url = 'http://5b0f708f3c5c110014145cc9.mockapi.io/api/nexacro-demo';

const initData = (callback) => {
    $.ajax({
        url: url,
        method: 'GET',
        accepts: 'application/json',

        success: (message) => {
            callback(message);
        },
        error: (message) => {
            console.error(message);
        }
    });
}

const createData = (data) => {
    return $.ajax({
        url: url,
        method: 'POST',
        data: data,
        accepts: 'application/json',
        dataType: 'json',
    })
}

const updateData = (data) => {
    return $.ajax({
        url: `${url}/${data.id}`,
        method: 'PUT',
        data: data,
        accepts: 'application/json',
        dataType: 'json',
    })
}

const deleteData = (id) => {
    return $.ajax({
        url: `${url}/${id}`,
        method: 'DELETE',
        data: {},
        accepts: 'application/json',
        dataType: 'json',
    })
}