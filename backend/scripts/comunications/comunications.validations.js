function validateFields(title, paragraph) {
    /*
    if (title.length > 26 || title.length < 10 || paragraph.length < 15 || paragraph.length > 100) {
        Swal.fire({
            title: 'Formato de Texto invalido',
            text: "Titulo o parrafo demasiado largos o demasiado cortos",
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
        console.log(title.length, paragraph.length)
        return false
    }*/
    return true
}

export {validateFields}