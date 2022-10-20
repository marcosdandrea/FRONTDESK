function validateFields(title, paragraph) {
    return true
}


function validateFile(file) {
    if (file.size > 104857600) {
        return (["No se pueden subir comunicados con archivos de video mayores a 100MB", false])
    } else {
        return ([null, true])
    }
}

export { validateFields, validateFile }   