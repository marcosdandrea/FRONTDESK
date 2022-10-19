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

/*

Los archivos de imagenes y videos deben tener un tamaño
recomendado de 800px x 482px (aspecto 16:9).
Los videos deben tener un peso menor a 100MB.

*/

function validateFile(file) {
    if (file.size > 104857600) {
        return (["No se pueden subir comunicados con archivos de video mayores a 100MB", false])
    } else {
        return ([null, true])
    }
}

export { validateFields, validateFile }   