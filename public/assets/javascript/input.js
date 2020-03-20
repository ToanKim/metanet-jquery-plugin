$('button#save').on('click', () => {
    initData(apiUrl);
})

$('button#add').on('click', () => {
    const detail = $('#form-detail input[name!=id-input]').serialize();
    console.log(detail);

    createData(apiUrl, detail); 
})

$('button#delete').on('click', () => {
    // const id = 45;

    deleteData(apiUrl, id);
})