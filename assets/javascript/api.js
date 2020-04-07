const url = 'https://5b0f708f3c5c110014145cc9.mockapi.io/api/nexacro-demo';

const initData = (callback) => {
    $.ajax({
        url: url,
        method: 'GET',
        accepts: 'application/json',

        success: (message) => {
            callback(message);
        },
        error: (message) => {
            alert('Failed to fetch data');
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
        error: (message) => {
            alert(`Failed to create record ${data}`);
        }
    })
}

const updateData = (data) => {
    return $.ajax({
        url: `${url}/${data.id}`,
        method: 'PUT',
        data: data,
        accepts: 'application/json',
        dataType: 'json',
        error: (message) => {
            alert(`Failed to update record ${data.id}`)
        }
    })
}

const deleteData = (id) => {
    return $.ajax({
        url: `${url}/${id}`,
        method: 'DELETE',
        data: {},
        accepts: 'application/json',
        dataType: 'json',
        error: (message) => {
            alert(`Failed to delete record ${id}`);
        }
    })
}