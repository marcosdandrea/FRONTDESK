const fsPromises = require('fs').promises;
const path = require('path');

module.exports = {
    //lee archivos en el disco. Retora una promesa.
    readFile: function async(file) {
        return new Promise((resolve, reject) => {
            fsPromises.readFile(path.join(__dirname, file), "utf8")
                .catch((err) => { reject(err) })
                .then((response) => JSON.parse(response))
                .then((response) => resolve(response))
        })
    },

    writeFile: function async(file, data) {
        return new Promise((resolve, reject) => {

            fsPromises.writeFile(path.join(__dirname, file), data, 'utf8')
                .catch((err) => reject(err))
                .then((res) => resolve("File Written successfully", file))

        })
    },

    copyFile: function async(file, newName) {
        return new Promise((resolve, reject) => {
            fsPromises.copyFile(path.join(__dirname, file), path.join(__dirname, newName))
                .catch((err) => reject(err))
                .then((res) => resolve("file renamed"))
        })
    },

    listDir: function async(dir) {
        return new Promise((resolve, reject) => {
            fsPromises.readdir(dir)
                .catch((err) => reject(err))
                .then(res => resolve(res))
        })
    },

    deleteFile: function async(file) {
        return new Promise((resolve, reject) => {
            fsPromises.rm(file)
                .catch((err) => reject(err))
                .then(() => resolve("File deleted"))
        })
    },

    cleanPanelFiles: function (curentEndPointName) {
        return new Promise((resolve, reject) => {
            fsPromises.readdir(path.join(__dirname, '../../backend'))
                .then(dir => {
                    const htmlFiles = dir.filter(htmlFile => (
                        htmlFile != 'index.html' &&
                        htmlFile != 'panel.html' &&
                        htmlFile.endsWith(".html"))
                    )


                    if (curentEndPointName != undefined) {
                        const htmlFilesReFiltered = htmlFiles.filter(htmlFile =>
                            htmlFile != curentEndPointName
                        )


                        console.log("Cleaning old panel files", htmlFilesReFiltered)

                        try {
                            htmlFilesReFiltered.forEach(htmlFile => {
                                fsPromises.rm(path.join(__dirname, '../../backend', htmlFile))
                                    .catch((err) => reject(console.log(err)))
                                    .then(() => resolve())
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                });
        })
    }

}
